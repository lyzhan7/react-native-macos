/*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#ifndef RCT_USE_HERMES
#if __has_include(<reacthermes/HermesExecutorFactory.h>)
#define RCT_USE_HERMES 1
#else
#define RCT_USE_HERMES 0
#endif
#endif

#ifdef RCT_NEW_ARCH_ENABLED
#ifndef RN_FABRIC_ENABLED
#define RN_FABRIC_ENABLED
#endif
#endif

#if RCT_USE_HERMES
#import <reacthermes/HermesExecutorFactory.h>
#else
#import <React/JSCExecutorFactory.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTCxxBridgeDelegate.h>
#import <React/RCTDataRequestHandler.h>
#import <React/RCTFileRequestHandler.h>
#import <React/RCTGIFImageDecoder.h>
#import <React/RCTHTTPRequestHandler.h>
#import <React/RCTImageLoader.h>
#import <React/RCTJSIExecutorRuntimeInstaller.h>
#import <React/RCTJavaScriptLoader.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTLocalAssetImageLoader.h>
#import <React/RCTNetworking.h>
#import <React/RCTRootView.h>

#import <cxxreact/JSExecutor.h>

#if !TARGET_OS_TV && !TARGET_OS_UIKITFORMAC
#import <React/RCTPushNotificationManager.h>
#endif

#ifdef RN_FABRIC_ENABLED
#import <React/RCTFabricSurfaceHostingProxyRootView.h>
#import <React/RCTSurfacePresenter.h>
#import <React/RCTSurfacePresenterBridgeAdapter.h>

#import <React/RCTLegacyViewManagerInteropComponentView.h>
#import <react/config/ReactNativeConfig.h>
#import <react/renderer/runtimescheduler/RuntimeScheduler.h>
#import <react/renderer/runtimescheduler/RuntimeSchedulerBinding.h>
#import <react/renderer/runtimescheduler/RuntimeSchedulerCallInvoker.h>
#endif

#if DEBUG
#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitLayoutPlugin/SKDescriptorMapper.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#endif
#endif

#import <ReactCommon/RCTTurboModuleManager.h>
#import "RNTesterTurboModuleProvider.h"

#if !TARGET_OS_OSX // [macOS]
@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate> {
#else // [macOS
@interface AppDelegate () <RCTCxxBridgeDelegate, RCTTurboModuleManagerDelegate, NSUserNotificationCenterDelegate> {
#endif // macOS]
#ifdef RN_FABRIC_ENABLED
  RCTSurfacePresenterBridgeAdapter *_bridgeAdapter;
  std::shared_ptr<const facebook::react::ReactNativeConfig> _reactNativeConfig;
  facebook::react::ContextContainer::Shared _contextContainer;
  std::shared_ptr<facebook::react::RuntimeScheduler> _runtimeScheduler;
#endif

  RCTTurboModuleManager *_turboModuleManager;
}
@end

static NSString *const kRNConcurrentRoot = @"concurrentRoot";

@implementation AppDelegate

#ifdef RN_FABRIC_ENABLED
- (instancetype)init
{
  if (self = [super init]) {
    _contextContainer = std::make_shared<facebook::react::ContextContainer const>();
    _reactNativeConfig = std::make_shared<facebook::react::EmptyReactNativeConfig const>();
    _contextContainer->insert("ReactNativeConfig", _reactNativeConfig);
  }
  return self;
}
#endif

#if !TARGET_OS_OSX // [macOS]
- (BOOL)application:(__unused UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#else // [macOS
- (void)applicationDidFinishLaunching:(NSNotification *)notification
{
    NSApplication *application = [notification object];
    NSDictionary *launchOptions = [notification userInfo];
#endif // macOS]
  RCTEnableTurboModule(YES);

  _bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  // Appetizer.io params check
  NSDictionary *initProps = [self prepareInitialProps];

#ifdef RN_FABRIC_ENABLED
  _bridgeAdapter = [[RCTSurfacePresenterBridgeAdapter alloc] initWithBridge:_bridge contextContainer:_contextContainer];

  _bridge.surfacePresenter = _bridgeAdapter.surfacePresenter;

  RCTUIView *rootView = [[RCTFabricSurfaceHostingProxyRootView alloc] initWithBridge:_bridge // [macOS]
                                                                          moduleName:@"RNTesterApp"
                                                                   initialProperties:initProps];
  [self registerPaperComponents:@[ @"RNTMyLegacyNativeView" ]];
#else
  RCTUIView *rootView = [[RCTRootView alloc] initWithBridge:_bridge moduleName:@"RNTesterApp" initialProperties:initProps]; // [macOS]
#endif

#if !TARGET_OS_OSX // [macOS
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [self initializeFlipper:application];

  return YES;
#else // [macOS
  NSRect frame = NSMakeRect(0,0,1024,768);
  self.window = [[NSWindow alloc] initWithContentRect:NSZeroRect
                                            styleMask:NSWindowStyleMaskTitled | NSWindowStyleMaskResizable | NSWindowStyleMaskClosable | NSWindowStyleMaskMiniaturizable
                                              backing:NSBackingStoreBuffered
                                                defer:NO];
  self.window.title = @"RNTester-macOS";
  self.window.autorecalculatesKeyViewLoop = YES;
  NSViewController *rootViewController = [NSViewController new];
  rootViewController.view = rootView;
  rootView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
  rootView.frame = frame;
  self.window.contentViewController = rootViewController;
  [self.window makeKeyAndOrderFront:self];
  [self.window center];
  [self initializeFlipper:application];
#endif // macOS]
}

- (BOOL)concurrentRootEnabled
{
  // Switch this bool to turn on and off the concurrent root
  return true;
}

- (NSDictionary *)prepareInitialProps
{
  NSMutableDictionary *initProps = [NSMutableDictionary new];

  NSString *_routeUri = [[NSUserDefaults standardUserDefaults] stringForKey:@"route"];
  if (_routeUri) {
    initProps[@"exampleFromAppetizeParams"] = [NSString stringWithFormat:@"rntester://example/%@Example", _routeUri];
  }

#ifdef RN_FABRIC_ENABLED
  initProps[kRNConcurrentRoot] = @([self concurrentRootEnabled]);
#endif

  return initProps;
}

- (NSURL *)sourceURLForBridge:(__unused RCTBridge *)bridge
{
#if !TARGET_OS_OSX // [macOS]
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"js/RNTesterApp.ios"];
#else // [macOS
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"js/RNTesterApp.macos"];
#endif
}

- (void)initializeFlipper:(UIApplication *)application
{
#if DEBUG
#ifdef FB_SONARKIT_ENABLED
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application
                                                withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
#endif
#endif
}

#if !TARGET_OS_OSX // [macOS]
- (BOOL)application:(UIApplication *)app
            openURL:(NSURL *)url
            options:(NSDictionary<UIApplicationOpenURLOptionsKey, id> *)options
{
  return [RCTLinkingManager application:app openURL:url options:options];
}
#endif // [macOS]

- (void)loadSourceForBridge:(RCTBridge *)bridge
                 onProgress:(RCTSourceLoadProgressBlock)onProgress
                 onComplete:(RCTSourceLoadBlock)loadCallback
{
  [RCTJavaScriptLoader loadBundleAtURL:[self sourceURLForBridge:bridge] onProgress:onProgress onComplete:loadCallback];
}

#pragma mark - RCTCxxBridgeDelegate

// This function is called during
// `[[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];`
- (std::unique_ptr<facebook::react::JSExecutorFactory>)jsExecutorFactoryForBridge:(RCTBridge *)bridge
{
  std::shared_ptr<facebook::react::CallInvoker> callInvoker = bridge.jsCallInvoker;

#ifdef RN_FABRIC_ENABLED
  _runtimeScheduler = std::make_shared<facebook::react::RuntimeScheduler>(RCTRuntimeExecutorFromBridge(bridge));
  _contextContainer->erase("RuntimeScheduler");
  _contextContainer->insert("RuntimeScheduler", _runtimeScheduler);
  callInvoker = std::make_shared<facebook::react::RuntimeSchedulerCallInvoker>(_runtimeScheduler);
#endif
  _turboModuleManager = [[RCTTurboModuleManager alloc] initWithBridge:bridge delegate:self jsInvoker:callInvoker];
  [bridge setRCTTurboModuleRegistry:_turboModuleManager];

#if RCT_DEV
  /**
   * Eagerly initialize RCTDevMenu so CMD + d, CMD + i, and CMD + r work.
   * This is a stop gap until we have a system to eagerly init Turbo Modules.
   */
  [_turboModuleManager moduleForName:"RCTDevMenu"];
#endif

  __weak __typeof(self) weakSelf = self;

#if RCT_USE_HERMES
  return std::make_unique<facebook::react::HermesExecutorFactory>(
#else
  return std::make_unique<facebook::react::JSCExecutorFactory>(
#endif
      facebook::react::RCTJSIExecutorRuntimeInstaller([weakSelf, bridge](facebook::jsi::Runtime &runtime) {
        if (!bridge) {
          return;
        }
        __typeof(self) strongSelf = weakSelf;
#if RN_FABRIC_ENABLED
        if (strongSelf && strongSelf->_runtimeScheduler) {
          facebook::react::RuntimeSchedulerBinding::createAndInstallIfNeeded(runtime, strongSelf->_runtimeScheduler);
        }
#endif
        if (strongSelf) {
          facebook::react::RuntimeExecutor syncRuntimeExecutor =
              [&](std::function<void(facebook::jsi::Runtime & runtime_)> &&callback) { callback(runtime); };
          [strongSelf->_turboModuleManager installJSBindingWithRuntimeExecutor:syncRuntimeExecutor];
        }
      }));
}

#pragma mark RCTTurboModuleManagerDelegate

- (Class)getModuleClassFromName:(const char *)name
{
  return facebook::react::RNTesterTurboModuleClassProvider(name);
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const std::string &)name
                                                      jsInvoker:(std::shared_ptr<facebook::react::CallInvoker>)jsInvoker
{
  return facebook::react::RNTesterTurboModuleProvider(name, jsInvoker);
}

- (id<RCTTurboModule>)getModuleInstanceFromClass:(Class)moduleClass
{
  // Set up the default RCTImageLoader and RCTNetworking modules.
  if (moduleClass == RCTImageLoader.class) {
    return [[moduleClass alloc] initWithRedirectDelegate:nil
        loadersProvider:^NSArray<id<RCTImageURLLoader>> *(RCTModuleRegistry *) {
          return @[ [RCTLocalAssetImageLoader new] ];
        }
        decodersProvider:^NSArray<id<RCTImageDataDecoder>> *(RCTModuleRegistry *) {
          return @[ [RCTGIFImageDecoder new] ];
        }];
  } else if (moduleClass == RCTNetworking.class) {
    return [[moduleClass alloc] initWithHandlersProvider:^NSArray<id<RCTURLRequestHandler>> *(RCTModuleRegistry *) {
      return @[
        [RCTHTTPRequestHandler new],
        [RCTDataRequestHandler new],
        [RCTFileRequestHandler new],
      ];
    }];
  }
  // No custom initializer here.
  return [moduleClass new];
}

#pragma mark - Interop layer

- (void)registerPaperComponents:(NSArray<NSString *> *)components
{
#if RCT_NEW_ARCH_ENABLED
  for (NSString *component in components) {
    [RCTLegacyViewManagerInteropComponentView supportLegacyViewManagerWithName:component];
  }
#endif
}

#pragma mark - Push Notifications

#if !TARGET_OS_TV && !TARGET_OS_UIKITFORMAC

#if !TARGET_OS_OSX // [macOS]
// Required to register for notifications
- (void)application:(__unused UIApplication *)application
    didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings
{
  [RCTPushNotificationManager didRegisterUserNotificationSettings:notificationSettings];
}
#endif // [macOS]

// Required for the remoteNotificationsRegistered event.
- (void)application:(__unused RCTUIApplication *)application
    didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RCTPushNotificationManager didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the remoteNotificationRegistrationError event.
- (void)application:(__unused RCTUIApplication *)application
    didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RCTPushNotificationManager didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for the remoteNotificationReceived event.
- (void)application:(__unused RCTUIApplication *)application didReceiveRemoteNotification:(NSDictionary *)notification
{
  [RCTPushNotificationManager didReceiveRemoteNotification:notification];
}

#if !TARGET_OS_OSX // [macOS]
// Required for the localNotificationReceived event.
- (void)application:(__unused UIApplication *)application
    didReceiveLocalNotification:(UILocalNotification *)notification
{
  [RCTPushNotificationManager didReceiveLocalNotification:notification];
}
#endif // [macOS]
#if TARGET_OS_OSX // [macOS
- (void)userNotificationCenter:(NSUserNotificationCenter *)center
        didDeliverNotification:(NSUserNotification *)notification
{
}

- (void)userNotificationCenter:(NSUserNotificationCenter *)center
       didActivateNotification:(NSUserNotification *)notification
{
  [RCTPushNotificationManager didReceiveUserNotification:notification];
}

- (BOOL)userNotificationCenter:(NSUserNotificationCenter *)center
     shouldPresentNotification:(NSUserNotification *)notification
{
  return YES;
}
#endif // macOS]
#endif

@end
