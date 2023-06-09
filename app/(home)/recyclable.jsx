// import React from 'react';
// import { Text, View, TouchableOpacity, FlatList} from 'react-native';
// // import * as Permissions from 'expo-permissions';
// import { Camera, Permissions } from 'expo-camera';

// export default class Recyclable extends React.Component {
//   state = {
//     hasCameraPermission: null,
//     type: Camera.Constants.Type.back,
//   };

//   async UNSAFE_componentWillMount() {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     this.setState({ hasCameraPermission: status === 'granted' });
//   }

//   render() {
//     const { hasCameraPermission } = this.state;
//     if (hasCameraPermission === null) {
//       return <View />;
//     } else if (hasCameraPermission === false) {
//       return <Text>No access to camera</Text>;
//     } else {
//       return (
//         <View style={{ flex: 1 }}>
//         <Camera
//           ref={ref => {
//             this.camera = ref;
//           }}
//           style={{ flex: 1 }}
//           type={this.state.type}
//         >
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: 'transparent',
//               flexDirection: 'column',
//               justifyContent: 'flex-end'
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 alignSelf: 'flex-start',
//                 alignItems: 'center',
//               }}
//             >
//             </View>
//             <TouchableOpacity
//                 style={{
//                   flex: 0.1,
//                   alignItems: 'center',
//                   backgroundColor: 'blue',
//                   height: '10%',
//                 }}
//                 onPress={this.objectDetection}
//               >
//                 <Text style={{ fontSize: 30, color: 'white', padding: 15 }}>
//                   {' '}
//                   Detect Objects{' '}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </Camera>
//         </View>
//       );
//     }
//   }
// }

// import React from 'react';
// import { Text, View, TouchableOpacity, Image } from 'react-native';
// import { Camera } from 'expo-camera';
// import axios from 'axios';

// export default class Recyclable extends React.Component {
//   state = {
//     hasCameraPermission: null,
//     type: Camera.Constants.Type.back,
//     imageUri: null,
//   };

//   async componentDidMount() {
//     const { status } = await Camera.requestCameraPermissionsAsync();
//     this.setState({ hasCameraPermission: status === 'granted' });
//   }

//   objectDetection = async () => {
//     if (this.camera) {
//       try {
//         const photo = await this.camera.takePictureAsync({ base64: true });

//         const response = await axios.post(
//           'https://api.clarifai.com/v2/models/aaa03c23b3724a16a56b629203edc62c/outputs',
//           {
//             inputs: [{ data: { image: { base64: photo.base64 } } }],
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//               Authorization: 'Key 4813e4475ff44445bac5c29a8be69e2a',
//             },
//           }
//         );

//         const predictions = response.data.outputs[0].data.concepts;
//         console.log(predictions);
//       } catch (error) {
//         console.log('Object detection error:', error);
//       }
//     }
//   };

//   renderCameraView = () => {
//     const { hasCameraPermission, imageUri } = this.state;

//     if (hasCameraPermission === null) {
//       return <View />;
//     } else if (hasCameraPermission === false) {
//       return <Text>No access to camera</Text>;
//     } else {
//       return (
//         <View style={{ flex: 1 }}>
//           <Camera
//             style={{ flex: 1 }}
//             type={this.state.type}
//             ref={(ref) => {
//               this.camera = ref;
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: 'transparent',
//                 flexDirection: 'column',
//                 justifyContent: 'flex-end',
//               }}
//             >
//               <TouchableOpacity
//                 style={{
//                   alignSelf: 'center',
//                   alignItems: 'center',
//                   backgroundColor: 'blue',
//                   padding: 15,
//                   marginBottom: 20,
//                 }}
//                 onPress={this.objectDetection}
//               >
//                 <Text style={{ fontSize: 18, color: 'white' }}>Detect Objects</Text>
//               </TouchableOpacity>
//             </View>
//           </Camera>
//         </View>
//       );
//     }
//   };

//   renderImageView = () => {
//     const { imageUri } = this.state;

//     return (
//       <View style={{ flex: 1 }}>
//         <Image source={{ uri: imageUri }} style={{ flex: 1 }} resizeMode="contain" />
//         <TouchableOpacity
//           style={{ alignItems: 'center', backgroundColor: 'blue', padding: 15 }}
//           onPress={() => this.setState({ imageUri: null })}
//         >
//           <Text style={{ fontSize: 18, color: 'white' }}>Retake Photo</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   render() {
//     const { imageUri } = this.state;

//     return imageUri ? this.renderImageView() : this.renderCameraView();
//   }
// }

import React from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Svg, Text as SvgText} from 'react-native-svg';

export default class ObjectDetection extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imageUri: null,
    detectedObjects: [],
  };

  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  detectObjects = async () => {

    if (this.camera) {
      const photo = await this.camera.takePictureAsync();

      this.setState({ imageUri: photo.uri });

      const apiKey = '4813e4475ff44445bac5c29a8be69e2a';
      const apiUrl = 'https://api.clarifai.com/v2/models/recyclable/versions/4101a1e7df844cab939be11728c27280/outputs';

      const base64 = await FileSystem.readAsStringAsync(photo.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Key ${apiKey}`,
        },
        body: JSON.stringify({
          inputs: [
            {
              data: {
                image: {
                  base64: base64,
                },
              },
            },
          ],
        }),
      });
      

      const result = await response.json();

      if (result.outputs && result.outputs.length > 0) {
        const predictions = result.outputs[0]?.data?.concepts?.map((concept) => {
          const box = concept?.region_info?.bounding_box;
          if (box) {
            return {
              name: concept.name,
              value: concept.value,
              box: box,
            };
          }
          return null;
        }).filter(Boolean);
        
        this.setState({ detectedObjects: predictions });
      }
    }
  };

  render() {
    const { hasCameraPermission, imageUri, detectedObjects } = this.state;
    console.log(this.state);

    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {imageUri ? (
            <View style={{ flex: 1 }}>
              <Image source={{ uri: imageUri }} style={{ flex: 1 }} resizeMode="contain" />
              <Svg style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                {detectedObjects.map((object, index) => (
                  <Svg.SvgText
                    key={index}
                    x={object.box.left_col * 100 + '%'}
                    y={object.box.top_row * 100 + '%'}
                    fill="red"
                    fontSize="16"
                    fontWeight="bold"
                  >
                    {object.name}
                  </Svg.SvgText>
                ))}
              </Svg>
              <TouchableOpacity
                style={{
                  backgroundColor: 'blue',
                  padding: 10,
                  alignItems: 'center',
                  marginTop: 10,
                }}
                onPress={() => this.setState({ imageUri: null, detectedObjects: [] })}
              >
                <Text style={{ color: 'white' }}>Back to Camera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Camera
              ref={(ref) => {
                this.camera = ref;
              }}
              style={{ flex: 1 }}
              type={this.state.type}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}
              >
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    marginBottom: 10,
                  }}
                  onPress={this.detectObjects}
                >
                  <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}>
                    Detect Objects
                  </Text>
                </TouchableOpacity>
              </View>
            </Camera>
          )}
        </View>
      );
    }
  }
}
