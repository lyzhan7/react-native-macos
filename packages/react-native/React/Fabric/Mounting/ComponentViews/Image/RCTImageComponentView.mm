/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "RCTImageComponentView.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>
#import <React/RCTImageBlurUtils.h>
#import <React/RCTImageResponseObserverProxy.h>
#import <react/renderer/components/image/ImageComponentDescriptor.h>
#import <react/renderer/components/image/ImageEventEmitter.h>
#import <react/renderer/components/image/ImageProps.h>
#import <react/renderer/imagemanager/ImageRequest.h>
#import <react/renderer/imagemanager/RCTImagePrimitivesConversions.h>

using namespace facebook::react;

@implementation RCTImageComponentView {
  ImageShadowNode::ConcreteState::Shared _state;
  RCTImageResponseObserverProxy _imageResponseObserverProxy;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static auto const defaultProps = std::make_shared<ImageProps const>();
    _props = defaultProps;

    _imageView = [RCTUIImageViewAnimated new];
    _imageView.clipsToBounds = YES;
    _imageView.contentMode = RCTContentModeFromImageResizeMode(defaultProps->resizeMode);
    _imageView.layer.minificationFilter = kCAFilterTrilinear;
    _imageView.layer.magnificationFilter = kCAFilterTrilinear;

    _imageResponseObserverProxy = RCTImageResponseObserverProxy(self);

    self.contentView = _imageView;
  }

  return self;
}

#pragma mark - RCTComponentViewProtocol

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<ImageComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  auto const &oldImageProps = *std::static_pointer_cast<ImageProps const>(_props);
  auto const &newImageProps = *std::static_pointer_cast<ImageProps const>(props);

  // `resizeMode`
  if (oldImageProps.resizeMode != newImageProps.resizeMode) {
    _imageView.contentMode = RCTContentModeFromImageResizeMode(newImageProps.resizeMode);
  }

  // `tintColor`
  if (oldImageProps.tintColor != newImageProps.tintColor) {
    _imageView.tintColor = RCTUIColorFromSharedColor(newImageProps.tintColor);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(State::Shared const &)state oldState:(State::Shared const &)oldState
{
  RCTAssert(state, @"`state` must not be null.");
  RCTAssert(
      std::dynamic_pointer_cast<ImageShadowNode::ConcreteState const>(state),
      @"`state` must be a pointer to `ImageShadowNode::ConcreteState`.");

  auto oldImageState = std::static_pointer_cast<ImageShadowNode::ConcreteState const>(_state);
  auto newImageState = std::static_pointer_cast<ImageShadowNode::ConcreteState const>(state);

  [self _setStateAndResubscribeImageResponseObserver:newImageState];

  bool havePreviousData = oldImageState && oldImageState->getData().getImageSource() != ImageSource{};

  if (!havePreviousData ||
      (newImageState && newImageState->getData().getImageSource() != oldImageState->getData().getImageSource())) {
    // Loading actually starts a little before this, but this is the first time we know
    // the image is loading and can fire an event from this component
    std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onLoadStart();

    // TODO (T58941612): Tracking for visibility should be done directly on this class.
    // For now, we consolidate instrumentation logic in the image loader, so that pre-Fabric gets the same treatment.
  }
}

- (void)_setStateAndResubscribeImageResponseObserver:(ImageShadowNode::ConcreteState::Shared const &)state
{
  if (_state) {
    auto &observerCoordinator = _state->getData().getImageRequest().getObserverCoordinator();
    observerCoordinator.removeObserver(_imageResponseObserverProxy);
  }

  _state = state;

  if (_state) {
    auto &observerCoordinator = _state->getData().getImageRequest().getObserverCoordinator();
    observerCoordinator.addObserver(_imageResponseObserverProxy);
  }
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  [self _setStateAndResubscribeImageResponseObserver:nullptr];
  _imageView.image = nil;
}

#pragma mark - RCTImageResponseDelegate

- (void)didReceiveImage:(UIImage *)image metadata:(id)metadata fromObserver:(void const *)observer
{
  if (!_eventEmitter || !_state) {
    // Notifications are delivered asynchronously and might arrive after the view is already recycled.
    // In the future, we should incorporate an `EventEmitter` into a separate object owned by `ImageRequest` or `State`.
    // See for more info: T46311063.
    return;
  }

  std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onLoad();
  std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onLoadEnd();

  const auto &imageProps = *std::static_pointer_cast<ImageProps const>(_props);

#if !TARGET_OS_OSX // [macOS]
  if (imageProps.tintColor) {
    image = [image imageWithRenderingMode:UIImageRenderingModeAlwaysTemplate];
  }

  if (imageProps.resizeMode == ImageResizeMode::Repeat) {
    image = [image resizableImageWithCapInsets:RCTUIEdgeInsetsFromEdgeInsets(imageProps.capInsets)
                                  resizingMode:UIImageResizingModeTile];
  } else if (imageProps.capInsets != EdgeInsets()) {
    // Applying capInsets of 0 will switch the "resizingMode" of the image to "tile" which is undesired.
    image = [image resizableImageWithCapInsets:RCTUIEdgeInsetsFromEdgeInsets(imageProps.capInsets)
                                  resizingMode:UIImageResizingModeStretch];
  }
#else
  if (imageProps.resizeMode == ImageResizeMode::Repeat) {
    image.capInsets = RCTUIEdgeInsetsFromEdgeInsets(imageProps.capInsets);
    image.resizingMode = NSImageResizingModeTile;
  }
#endif // [macOS]

  if (imageProps.blurRadius > __FLT_EPSILON__) {
    // Blur on a background thread to avoid blocking interaction.
    CGFloat blurRadius = imageProps.blurRadius;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
      UIImage *blurredImage = RCTBlurredImageWithRadius(image, blurRadius);
      RCTExecuteOnMainQueue(^{
        self->_imageView.image = blurredImage;
      });
    });
  } else {
    self->_imageView.image = image;
  }
}

- (void)didReceiveProgress:(float)progress fromObserver:(void const *)observer
{
  if (!_eventEmitter) {
    return;
  }

  std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onProgress(progress);
}

- (void)didReceiveFailureFromObserver:(void const *)observer
{
  _imageView.image = nil;

  if (!_eventEmitter) {
    return;
  }

  std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onError();
  std::static_pointer_cast<ImageEventEmitter const>(_eventEmitter)->onLoadEnd();
}

@end

#ifdef __cplusplus
extern "C" {
#endif

// Can't the import generated Plugin.h because plugins are not in this BUCK target
Class<RCTComponentViewProtocol> RCTImageCls(void);

#ifdef __cplusplus
}
#endif

Class<RCTComponentViewProtocol> RCTImageCls(void)
{
  return RCTImageComponentView.class;
}
