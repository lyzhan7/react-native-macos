/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @flow strict-local
 */

'use strict';

const React = require('react');

const {
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Platform,
} = require('react-native');

class ViewBorderStyleExample extends React.Component<
  $ReadOnly<{||}>,
  {|showBorder: boolean|},
> {
  state: {showBorder: boolean} = {
    showBorder: true,
  };

  render(): React.Node {
    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View>
          <View
            style={[
              {
                borderWidth: 1,
                padding: 5,
              },
              this.state.showBorder
                ? {
                    borderStyle: 'dashed',
                  }
                : null,
            ]}>
            <Text style={{fontSize: 11}}>Dashed border style</Text>
          </View>
          <View
            style={[
              {
                marginTop: 5,
                borderWidth: 1,
                borderRadius: 5,
                padding: 5,
              },
              this.state.showBorder
                ? {
                    borderStyle: 'dotted',
                  }
                : null,
            ]}>
            <Text style={{fontSize: 11}}>Dotted border style</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _handlePress = () => {
    this.setState({showBorder: !this.state.showBorder});
  };
}

const offscreenAlphaCompositingStyles = StyleSheet.create({
  alphaCompositing: {
    justifyContent: 'space-around',
    width: 100,
    height: 50,
    borderRadius: 100,
  },
});

class OffscreenAlphaCompositing extends React.Component<
  $ReadOnly<{||}>,
  {|
    active: boolean,
  |},
> {
  state: {active: boolean} = {
    active: false,
  };

  render(): React.Node {
    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View>
          <Text style={{paddingBottom: 10}}>Blobs</Text>
          <View
            style={{opacity: 1.0, paddingBottom: 30}}
            needsOffscreenAlphaCompositing={this.state.active}>
            <View
              style={[
                offscreenAlphaCompositingStyles.alphaCompositing,
                {marginTop: 0, marginLeft: 0, backgroundColor: '#FF6F59'},
              ]}
            />
            <View
              style={[
                offscreenAlphaCompositingStyles.alphaCompositing,
                {
                  marginTop: -50,
                  marginLeft: 50,
                  backgroundColor: '#F7CB15',
                },
              ]}
            />
          </View>
          <Text style={{paddingBottom: 10}}>
            Same blobs, but their shared container have 0.5 opacity
          </Text>
          <Text style={{paddingBottom: 10}}>
            Tap to {this.state.active ? 'activate' : 'deactivate'}{' '}
            needsOffscreenAlphaCompositing
          </Text>
          <View
            style={{opacity: 0.8}}
            needsOffscreenAlphaCompositing={this.state.active}>
            <View
              style={[
                offscreenAlphaCompositingStyles.alphaCompositing,
                {marginTop: 0, marginLeft: 0, backgroundColor: '#FF6F59'},
              ]}
            />
            <View
              style={[
                offscreenAlphaCompositingStyles.alphaCompositing,
                {
                  marginTop: -50,
                  marginLeft: 50,
                  backgroundColor: '#F7CB15',
                },
              ]}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _handlePress = () => {
    this.setState({active: !this.state.active});
  };
}

const ZIndexExampleStyles = StyleSheet.create({
  zIndex: {
    justifyContent: 'space-around',
    width: 100,
    height: 50,
    marginTop: -10,
    position: 'relative',
  },
});

class ZIndexExample extends React.Component<
  $ReadOnly<{||}>,
  {|
    flipped: boolean,
  |},
> {
  state: {flipped: boolean} = {
    flipped: false,
  };

  render(): React.Node {
    const indices = this.state.flipped ? [-1, 0, 1, 2] : [2, 1, 0, -1];
    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View>
          <Text style={{paddingBottom: 10}}>Tap to flip sorting order</Text>
          <View
            style={[
              ZIndexExampleStyles.zIndex,
              {
                marginTop: 0,
                backgroundColor: '#E57373',
                zIndex: indices[0],
              },
            ]}>
            <Text>ZIndex {indices[0]}</Text>
          </View>
          <View
            style={[
              ZIndexExampleStyles.zIndex,
              {
                marginLeft: 50,
                backgroundColor: '#FFF176',
                zIndex: indices[1],
              },
            ]}>
            <Text>ZIndex {indices[1]}</Text>
          </View>
          <View
            style={[
              ZIndexExampleStyles.zIndex,
              {
                marginLeft: 100,
                backgroundColor: '#81C784',
                zIndex: indices[2],
              },
            ]}>
            <Text>ZIndex {indices[2]}</Text>
          </View>
          <View
            style={[
              ZIndexExampleStyles.zIndex,
              {
                marginLeft: 150,
                backgroundColor: '#64B5F6',
                zIndex: indices[3],
              },
            ]}>
            <Text>ZIndex {indices[3]}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _handlePress = () => {
    this.setState({flipped: !this.state.flipped});
  };
}

class DisplayNoneStyle extends React.Component<
  $ReadOnly<{||}>,
  {|
    index: number,
  |},
> {
  state: {index: number} = {
    index: 0,
  };

  render(): React.Node {
    return (
      <TouchableWithoutFeedback onPress={this._handlePress}>
        <View>
          <Text style={{paddingBottom: 10}}>
            Press to toggle `display: none`
          </Text>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'red',
              display: this.state.index % 2 === 0 ? 'none' : 'flex',
            }}
          />
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'blue',
              display: this.state.index % 3 === 0 ? 'none' : 'flex',
            }}
          />
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'yellow',
              display: this.state.index % 5 === 0 ? 'none' : 'flex',
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                backgroundColor: 'salmon',
                display: this.state.index % 11 === 0 ? 'none' : 'flex',
              }}
            />
          </View>
          <View
            style={{
              height: 50,
              width: 50,
              backgroundColor: 'magenta',
              display: this.state.index % 7 === 0 ? 'none' : 'flex',
            }}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  _handlePress = () => {
    this.setState({index: this.state.index + 1});
  };
}

class FlexGapExample extends React.Component<$ReadOnly<{||}>> {
  render(): React.Node {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          borderWidth: 1,
          rowGap: 20,
          columnGap: 30,
        }}>
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View
          style={{
            backgroundColor: 'pink',
            height: 30,
            flexBasis: 30,
          }}
        />
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View style={{backgroundColor: 'black', height: 30, width: 30}} />
        <View style={{backgroundColor: 'pink', height: 30, width: 30}} />
        <View style={{backgroundColor: 'pink', height: 30, width: 30}} />
        <View style={{backgroundColor: 'pink', height: 30, width: 30}} />
        <View style={{backgroundColor: 'pink', height: 30, width: 30}} />
      </View>
    );
  }
}

exports.title = 'View';
exports.documentationURL = 'https://reactnative.dev/docs/view';
exports.category = 'Basic';
exports.description = ('Basic building block of all UI, examples that ' +
  'demonstrate some of the many styles available.': string);

exports.displayName = 'ViewExample';
exports.examples = [
  {
    title: 'Background Color',
    render(): React.Node {
      return (
        <View style={{backgroundColor: '#527FE4', padding: 5}}>
          <Text style={{fontSize: 11}}>Blue background</Text>
        </View>
      );
    },
  },
  {
    title: 'Border',
    render(): React.Node {
      return (
        <View style={{borderColor: '#527FE4', borderWidth: 5, padding: 10}}>
          <Text style={{fontSize: 11}}>5px blue border</Text>
        </View>
      );
    },
  },
  {
    title: 'Cursor',
    render(): React.Node {
      return (
        <>
          <View style={{cursor: 'auto', padding: 10}}>
            <Text style={{fontSize: 11}}>auto</Text>
          </View>
          <View style={{cursor: 'default', padding: 10}}>
            <Text style={{fontSize: 11}}>default</Text>
          </View>
          <View style={{cursor: 'context-menu', padding: 10}}>
            <Text style={{fontSize: 11}}>context-menu</Text>
          </View>
          <View style={{cursor: 'pointer', padding: 10}}>
            <Text style={{fontSize: 11}}>pointer</Text>
          </View>
          <View style={{cursor: 'text', padding: 10}}>
            <Text style={{fontSize: 11}}>text</Text>
          </View>
          <View style={{cursor: 'vertical-text', padding: 10}}>
            <Text style={{fontSize: 11}}>vertical-text</Text>
          </View>
          <View style={{cursor: 'alias', padding: 10}}>
            <Text style={{fontSize: 11}}>alias</Text>
          </View>
          <View style={{cursor: 'copy', padding: 10}}>
            <Text style={{fontSize: 11}}>copy</Text>
          </View>
          <View style={{cursor: 'not-allowed', padding: 10}}>
            <Text style={{fontSize: 11}}>not-allowed</Text>
          </View>
          <View style={{cursor: 'grab', padding: 10}}>
            <Text style={{fontSize: 11}}>grab</Text>
          </View>
          <View style={{cursor: 'grabbing', padding: 10}}>
            <Text style={{fontSize: 11}}>grabbing</Text>
          </View>
          <View style={{cursor: 'col-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>col-resize</Text>
          </View>
          <View style={{cursor: 'row-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>row-resize</Text>
          </View>
          <View style={{cursor: 'n-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>n-resize</Text>
          </View>
          <View style={{cursor: 'e-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>e-resize</Text>
          </View>
          <View style={{cursor: 's-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>s-resize</Text>
          </View>
          <View style={{cursor: 'w-resize', padding: 10}}>
            <Text style={{fontSize: 11}}>w-resize</Text>
          </View>
        </>
      );
    },
  },
  {
    title: 'Padding/Margin',
    render(): React.Node {
      const styles = StyleSheet.create({
        box: {
          backgroundColor: '#527FE4',
          borderColor: '#000033',
          borderWidth: 1,
        },
      });
      return (
        <View style={{borderColor: '#bb0000', borderWidth: 0.5}}>
          <View style={[styles.box, {padding: 5}]}>
            <Text style={{fontSize: 11}}>5px padding</Text>
          </View>
          <View style={[styles.box, {margin: 5}]}>
            <Text style={{fontSize: 11}}>5px margin</Text>
          </View>
          <View
            style={[
              styles.box,
              {margin: 5, padding: 5, alignSelf: 'flex-start'},
            ]}>
            <Text style={{fontSize: 11}}>5px margin and padding,</Text>
            <Text style={{fontSize: 11}}>widthAutonomous=true</Text>
          </View>
        </View>
      );
    },
  },
  {
    title: 'Border Radius',
    render(): React.Node {
      return (
        <>
          <View style={{borderWidth: 0.5, borderRadius: 5, padding: 5}}>
            <Text style={{fontSize: 11}}>
              Too much use of `borderRadius` (especially large radii) on
              anything which is scrolling may result in dropped frames. Use
              sparingly.
            </Text>
          </View>
          {Platform.OS === 'ios' && (
            <View
              style={{
                borderRadius: 20,
                padding: 8,
                marginTop: 12,
                backgroundColor: '#527FE4',
                borderCurve: 'continuous',
              }}>
              <Text style={{fontSize: 16, color: 'white'}}>
                View with continuous border curve
              </Text>
            </View>
          )}
        </>
      );
    },
  },
  {
    title: 'Border Style',
    render(): React.Node {
      return <ViewBorderStyleExample />;
    },
  },
  {
    title: 'Rounded Borders',
    render(): React.Node {
      return (
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 1,
              marginRight: 10,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 10,
              marginRight: 10,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 25,
              borderBottomLeftRadius: 50,
              borderWidth: 1,
              marginRight: 10,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 25,
              borderBottomLeftRadius: 50,
              borderWidth: 10,
              marginRight: 10,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderLeftWidth: 6,
              borderTopWidth: 6,
              borderTopLeftRadius: 20,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderRightWidth: 6,
              borderTopWidth: 6,
              borderTopRightRadius: 20,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderBottomWidth: 6,
              borderLeftWidth: 6,
              borderBottomLeftRadius: 20,
            }}
          />
          <View
            style={{
              width: 50,
              height: 50,
              borderBottomWidth: 6,
              borderRightWidth: 6,
              borderBottomRightRadius: 20,
            }}
          />
        </View>
      );
    },
  },
  {
    title: 'Overflow',
    render(): React.Node {
      const styles = StyleSheet.create({
        container: {
          borderWidth: StyleSheet.hairlineWidth,
          height: 12,
          marginBottom: 8,
          marginEnd: 16,
          width: 95,
        },
        content: {
          height: 20,
          width: 200,
        },
      });

      // NOTE: The <View> that sets `overflow` should only have other layout
      // styles so that we can accurately test view flattening optimizations.
      return (
        <View style={{flexDirection: 'row'}}>
          <View style={styles.container}>
            <View style={[StyleSheet.absoluteFill]}>
              <Text style={styles.content}>undefined</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={[StyleSheet.absoluteFill, {overflow: 'hidden'}]}>
              <Text style={styles.content}>hidden</Text>
            </View>
          </View>
          <View style={styles.container}>
            <View style={[StyleSheet.absoluteFill, {overflow: 'visible'}]}>
              <Text style={styles.content}>visible</Text>
            </View>
          </View>
        </View>
      );
    },
  },
  {
    title: 'Opacity',
    render(): React.Node {
      return (
        <View>
          <View style={{opacity: 0}}>
            <Text>Opacity 0</Text>
          </View>
          <View style={{opacity: 0.1}}>
            <Text>Opacity 0.1</Text>
          </View>
          <View style={{opacity: 0.3}}>
            <Text>Opacity 0.3</Text>
          </View>
          <View style={{opacity: 0.5}}>
            <Text>Opacity 0.5</Text>
          </View>
          <View style={{opacity: 0.7}}>
            <Text>Opacity 0.7</Text>
          </View>
          <View style={{opacity: 0.9}}>
            <Text>Opacity 0.9</Text>
          </View>
          <View style={{opacity: 1}}>
            <Text>Opacity 1</Text>
          </View>
        </View>
      );
    },
  },
  {
    title: 'Offscreen Alpha Compositing',
    render(): React.Node {
      return <OffscreenAlphaCompositing />;
    },
  },
  {
    title: 'ZIndex',
    render(): React.Node {
      return <ZIndexExample />;
    },
  },
  {
    title: '`display: none` style',
    render(): React.Node {
      return <DisplayNoneStyle />;
    },
  },
  {
    title: 'BackfaceVisibility',
    render: function (): React.Node {
      return (
        <>
          <Text style={{paddingBottom: 10}}>
            View #1, front is visible, back is hidden.
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                height: 200,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'blue',
                backfaceVisibility: 'hidden',
              }}>
              <Text>Front</Text>
            </View>
            <View
              style={{
                height: 200,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
                backfaceVisibility: 'hidden',
                transform: [{rotateY: '180deg'}],
                position: 'absolute',
                top: 0,
              }}>
              <Text>Back (You should not see this)</Text>
            </View>
          </View>
          <Text style={{paddingVertical: 10}}>
            View #2, front is hidden, back is visible.
          </Text>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                height: 200,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'blue',
                backfaceVisibility: 'hidden',
              }}>
              <Text>Front (You should not see this)</Text>
            </View>
            <View
              style={{
                height: 200,
                width: 200,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'red',
                backfaceVisibility: 'hidden',
                position: 'absolute',
                top: 0,
              }}>
              <Text>Back</Text>
            </View>
          </View>
        </>
      );
    },
  },
  {
    title: 'View with aria-label="label"',
    render(): React.Node {
      return (
        <View
          aria-label="Blue background View with Text"
          style={{backgroundColor: '#527FE4', padding: 5}}>
          <Text style={{fontSize: 11}}>Blue background</Text>
        </View>
      );
    },
  },
  {
    title: 'FlexGap',
    render(): React.Node {
      return <FlexGapExample />;
    },
  },
  {
    title: 'Insets',
    render(): React.Node {
      return (
        <View style={{rowGap: 10}}>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                inset: 10,
              }}>
              <Text style={{fontSize: 11}}>inset 10</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetBlock: 5,
              }}>
              <Text style={{fontSize: 11}}>insetBlock 5</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetBlockEnd: 5,
              }}>
              <Text style={{fontSize: 11}}>insetBlockEnd 5</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetBlockStart: 5,
              }}>
              <Text style={{fontSize: 11}}>insetBlockStart 5</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetInline: 5,
              }}>
              <Text style={{fontSize: 11}}>insetInline 5</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetInlineEnd: 5,
              }}>
              <Text style={{fontSize: 11}}>insetInlineEnd 5</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                backgroundColor: '#527FE4',
                padding: 5,
                position: 'absolute',
                insetInlineStart: 5,
              }}>
              <Text style={{fontSize: 11}}>insetInlineStart 5</Text>
            </View>
          </View>
        </View>
      );
    },
  },
  {
    title: 'Logical Border Color',
    render(): React.Node {
      return (
        <View style={{rowGap: 10}}>
          <View style={{position: 'relative', height: 50, borderWidth: 1}}>
            <View
              style={{
                borderBlockColor: 'orange',
                borderWidth: 5,
                position: 'absolute',
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}>
              <Text style={{fontSize: 11}}>borderBlockColor orange</Text>
            </View>
          </View>
          <View style={{position: 'relative', height: 65, borderWidth: 1}}>
            <View
              style={{
                borderBlockEndColor: 'green',
                borderBlockStartColor: 'purple',
                borderWidth: 5,
                position: 'absolute',
                top: 10,
                bottom: 10,
                left: 10,
                right: 10,
              }}>
              <Text style={{fontSize: 11}}>borderBlockStartColor purple</Text>
              <Text style={{fontSize: 11}}>borderBlockEndColor green</Text>
            </View>
          </View>
        </View>
      );
    },
  },
];
