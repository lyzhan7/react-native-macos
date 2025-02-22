/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow
 */

'use strict';

import type {RNTesterModuleInfo} from '../types/RNTesterTypes';

import ReactNativeFeatureFlags from 'react-native/Libraries/ReactNative/ReactNativeFeatureFlags';

const Components: Array<RNTesterModuleInfo> = [
  {
    key: 'ActivityIndicatorExample',
    category: 'UI',
    module: require('../examples/ActivityIndicator/ActivityIndicatorExample'),
  },
  {
    key: 'ButtonExample',
    module: require('../examples/Button/ButtonExample'),
    category: 'UI',
  },
  {
    key: 'FlatListExampleIndex',
    module: require('../examples/FlatList/FlatListExampleIndex').default,
    category: 'ListView',
  },
  // [macOS
  {
    key: 'FocusEvents',
    module: require('../examples/FocusEventsExample/FocusEventsExample'),
  },
  // [macOS Github#1412
  {
    key: 'FocusOnMount',
    module: require('../examples/FocusOnMount/FocusOnMount'),
  },
  // macOS]
  // [macOS
  {
    key: 'GhostText',
    module: require('../examples/GhostText/GhostText'),
  },
  // macOS]
  {
    key: 'KeyboardEvents',
    module: require('../examples/KeyboardEventsExample/KeyboardEventsExample'),
  },
  {
    key: 'AccessibilityShowMenu',
    module: require('../examples/AccessibilityShowMenu/AccessibilityShowMenu'),
  }, // macOS]
  {
    key: 'ImageExample',
    module: require('../examples/Image/ImageExample'),
    skipTest: {
      // [macOS
      ios: 'Reason: -[NSURLResponse allHeaderFields]: unrecognized selector exception. Occurs upstream also.',
    }, // macOS]
    category: 'Basic',
  },
  {
    key: 'JSResponderHandlerExample',
    module: require('../examples/JSResponderHandlerExample/JSResponderHandlerExample'),
  },
  {
    key: 'InputAccessoryViewExample',
    module: require('../examples/InputAccessoryView/InputAccessoryViewExample'),
  },
  {
    key: 'KeyboardAvoidingViewExample',
    module: require('../examples/KeyboardAvoidingView/KeyboardAvoidingViewExample'),
  },
  {
    key: 'LayoutEventsExample',
    module: require('../examples/Layout/LayoutEventsExample'),
  },
  {
    key: 'ModalExample',
    module: require('../examples/Modal/ModalExample'),
  },
  {
    key: 'NewAppScreenExample',
    module: require('../examples/NewAppScreen/NewAppScreenExample'),
  },
  {
    key: 'PressableExample',
    module: require('../examples/Pressable/PressableExample'),
  },
  {
    key: 'RefreshControlExample',
    module: require('../examples/RefreshControl/RefreshControlExample'),
  },
  {
    key: 'ScrollViewSimpleExample',
    module: require('../examples/ScrollView/ScrollViewSimpleExample'),
    category: 'Basic',
  },
  {
    key: 'SafeAreaViewExample',
    module: require('../examples/SafeAreaView/SafeAreaViewExample'),
  },
  {
    key: 'ScrollViewExample',
    module: require('../examples/ScrollView/ScrollViewExample'),
    category: 'Basic',
  },
  {
    key: 'ScrollViewAnimatedExample',
    module: require('../examples/ScrollView/ScrollViewAnimatedExample'),
  },
  {
    key: 'ScrollViewIndicatorInsetsExample',
    module: require('../examples/ScrollView/ScrollViewIndicatorInsetsExample'),
  },
  {
    key: 'SectionListIndex',
    module: require('../examples/SectionList/SectionListIndex'),
    category: 'ListView',
  },
  {
    key: 'StatusBarExample',
    module: require('../examples/StatusBar/StatusBarExample'),
  },
  {
    key: 'SwipeableCardExample',
    module: require('../examples/SwipeableCardExample/SwipeableCardExample'),
    category: 'UI',
  },
  {
    key: 'SwitchExample',
    module: require('../examples/Switch/SwitchExample'),
    category: 'UI',
  },
  {
    key: 'TextExample',
    module: require('../examples/Text/TextExample.ios'),
    category: 'Basic',
  },
  {
    key: 'TextInputExample',
    module: require('../examples/TextInput/TextInputExample.ios'),
    category: 'Basic',
  },
  {
    key: 'TooltipExample',
    module: require('../examples/Tooltip/TooltipExample'),
  },
  {
    key: 'TouchableExample',
    module: require('../examples/Touchable/TouchableExample'),
  },
  {
    key: 'TransparentHitTestExample',
    module: require('../examples/TransparentHitTest/TransparentHitTestExample'),
  },
  {
    key: 'ViewExample',
    module: require('../examples/View/ViewExample'),
    category: 'Basic',
  },
  {
    key: 'NewArchitectureExample',
    category: 'UI',
    module: require('../examples/NewArchitecture/NewArchitectureExample'),
    // [macOS
    skipTest: {
      default:
        'Reason: requires RCT_NEW_ARCH_ENABLED flag to be set during build',
    },
    // macOS]
  },
];

const APIs: Array<RNTesterModuleInfo> = [
  {
    key: 'AccessibilityExample',
    module: require('../examples/Accessibility/AccessibilityExample'),
  },
  {
    key: 'AccessibilityIOSExample',
    module: require('../examples/Accessibility/AccessibilityIOSExample'),
    category: 'iOS',
  },
  {
    key: 'ActionSheetIOSExample',
    module: require('../examples/ActionSheetIOS/ActionSheetIOSExample'),
    category: 'iOS',
  },
  {
    key: 'AlertExample',
    module: require('../examples/Alert/AlertExample').default,
    category: 'UI',
  },
  {
    key: 'AnimatedIndex',
    module: require('../examples/Animated/AnimatedIndex').default,
  },
  {
    key: 'AnExApp',
    module: require('../examples/AnimatedGratuitousApp/AnExApp'),
  },
  {
    key: 'AppearanceExample',
    module: require('../examples/Appearance/AppearanceExample'),
  },
  {
    key: 'AppStateExample',
    module: require('../examples/AppState/AppStateExample'),
  },
  {
    key: 'BorderExample',
    module: require('../examples/Border/BorderExample'),
  },
  {
    key: 'BoxShadowExample',
    module: require('../examples/BoxShadow/BoxShadowExample'),
  },
  {
    key: 'CrashExample',
    module: require('../examples/Crash/CrashExample'),
  },

  {
    key: 'DevSettings',
    module: require('../examples/DevSettings/DevSettingsExample'),
  },
  {
    key: 'Dimensions',
    module: require('../examples/Dimensions/DimensionsExample'),
  },
  // [macOS
  {
    key: 'ASANCrashExample',
    module: require('../examples/ASAN/ASANCrashExample'),
  },
  {
    key: 'Focus Ring',
    module: require('../examples/FocusRing/FocusRingExample'),
  },
  // macOS]
  {
    key: 'InvalidPropsExample',
    module: require('../examples/InvalidProps/InvalidPropsExample'),
  },
  {
    key: 'Keyboard',
    module: require('../examples/Keyboard/KeyboardExample').default,
  },
  {
    key: 'LayoutAnimationExample',
    module: require('../examples/Layout/LayoutAnimationExample'),
  },
  {
    key: 'LayoutExample',
    module: require('../examples/Layout/LayoutExample'),
  },
  {
    key: 'LinkingExample',
    module: require('../examples/Linking/LinkingExample'),
  },
  {
    key: 'NativeAnimationsExample',
    module: require('../examples/NativeAnimation/NativeAnimationsExample'),
  },
  {
    key: 'OrientationChangeExample',
    module: require('../examples/OrientationChange/OrientationChangeExample'),
  },
  {
    key: 'PanResponderExample',
    module: require('../examples/PanResponder/PanResponderExample'),
  },
  {
    key: 'PlatformColorExample',
    module: require('../examples/PlatformColor/PlatformColorExample'),
  },
  {
    key: 'PointerEventsExample',
    module: require('../examples/PointerEvents/PointerEventsExample'),
  },
  {
    key: 'RCTRootViewIOSExample',
    module: require('../examples/RCTRootView/RCTRootViewIOSExample'),
    // [macOS
    skipTest: {
      default:
        'Reason: requires native components and is convered by RCTRootViewIntegrationTests',
    }, // macOS]
  },
  {
    key: 'RTLExample',
    module: require('../examples/RTL/RTLExample'),
  },
  {
    key: 'ShareExample',
    module: require('../examples/Share/ShareExample'),
  },
  {
    key: 'SnapshotExample',
    module: require('../examples/Snapshot/SnapshotExample'),
  },
  {
    key: 'TimerExample',
    module: require('../examples/Timer/TimerExample'),
  },
  {
    key: 'TransformExample',
    module: require('../examples/Transform/TransformExample'),
    // [macOS
    skipTest: {
      default: 'Reason: Stack overflow in jsi, upstream issue.',
    }, // macOS]
  },
  {
    key: 'TurboModuleExample',
    module: require('../examples/TurboModule/TurboModuleExample'),
    // [macOS
    skipTest: {
      default: 'Reason: requires TurboModule to be configured in host app.',
    }, // macOS]
  },
  {
    key: 'TurboCxxModuleExample',
    module: require('../examples/TurboModule/TurboCxxModuleExample'),
  },
  {
    key: 'VibrationExample',
    module: require('../examples/Vibration/VibrationExample'),
  },
  {
    key: 'WebSocketExample',
    module: require('../examples/WebSocket/WebSocketExample'),
  },
  {
    key: 'XHRExample',
    module: require('../examples/XHR/XHRExample'),
  },
  {
    key: 'PerformanceApiExample',
    category: 'Basic',
    module: require('../examples/Performance/PerformanceApiExample'),
  },
];

if (ReactNativeFeatureFlags.shouldEmitW3CPointerEvents()) {
  APIs.push({
    key: 'W3C PointerEvents',
    category: 'Experimental',
    module: require('../examples/Experimental/W3CPointerEventsExample').default,
  });
}

const Modules: {...} = {};

APIs.concat(Components).forEach(Example => {
  // $FlowFixMe[prop-missing]
  Modules[Example.key] = Example.module;
});

const RNTesterList = {
  APIs,
  Components,
  Modules,
};

module.exports = RNTesterList;
