import React from 'react';
import { Text, View, TouchableOpacity, FlatList} from 'react-native';
// import * as Permissions from 'expo-permissions';
import { Camera, Permissions } from 'expo-camera';

export default class Recyclable extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
  };

  async UNSAFE_componentWillMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={{ flex: 1 }}
          type={this.state.type}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
          >
            <View
              style={{
                flex: 1,
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}
            >
            </View>
            <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignItems: 'center',
                  backgroundColor: 'blue',
                  height: '10%',
                }}
                onPress={this.objectDetection}
              >
                <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
                  {' '}
                  Detect Objects{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  }
}