import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import 'react-native-console-time-polyfill';
import { Button } from 'react-native-paper';

export default class Recyclable extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imageUri: null,
    predictions: [],
    errorMessage: '',
    isLoading: false,
  };
  async componentDidMount() {
    const { status } = await Camera.requestCameraPermissionsAsync();
    this.setState({ hasCameraPermission: status === 'granted' });
  }
  objectDetection = async () => {
    console.log(1);
    if (this.camera) {
      this.setState({ isLoading: true });
      try {
        const photo = await this.camera.takePictureAsync({ base64: true });
        console.log(2);
        const response = await axios.post(
          'https://api.clarifai.com/v2/models/recyclable/versions/491c2a43a205472e9c38d4caa7665815/outputs',
          {
            inputs: [{ data: { image: { base64: photo.base64 } } }],
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Key 4813e4475ff44445bac5c29a8be69e2a',
            },
          }
        );
        console.log(3);
        // use concepts to show prediction, but will have error for map
        const predictions = response.data.outputs[0]?.data?.concepts;
        console.log(predictions);
        this.setState({ imageUri: photo.uri, predictions: predictions });
      } catch (error) {
        console.log('Object detection error:', error);
        //this.setState({ errorMessage: 'Error occurred during object detection. Please try again.' });
      } finally {
        this.setState({ isLoading: false }); 
      }
    }
  };
  renderCameraView = () => {
    const { hasCameraPermission, imageUri, errorMessage, isLoading } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          {/*{errorMessage !== '' && <Text>{errorMessage}</Text>}*/}
          <Camera
            style={{ flex: 1 }}
            type={this.state.type}
            ref={(ref) => {
              this.camera = ref;
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'column',
                justifyContent: 'flex-end',
              }}
            >
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#D9D9D6',
                  padding: 15,
                  paddingVertical: 15,
                  marginBottom: 20,
                  borderRadius: 10,
                  width: 200,
                }}
                onPress={this.objectDetection}
              >
              {isLoading 
              ? (<Text style={{
                        //backgroundColor: "#c7dede", 
                        borderRadius: 10, 
                        fontSize: 18, 
                        color: 'black' 
                      }}>Loading...</Text>) 
              : (<Text style={{ 
                        //backgroundColor: "#D9D9D6",
                        borderRadius: 10, 
                        fontSize: 18, 
                        color: 'black' 
                      }}>Detect Objects</Text>
              )}

              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
  };
  renderImageView = () => {
    const { imageUri, predictions, errorMessage } = this.state;

    // if (errorMessage !== '') {
    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    //       {/*<Text>{errorMessage}</Text>*/}
    //     </View>
    //   );
    // }
      // Sort the predictions by probability in descending order
    const sortedPredictions = predictions.sort((a, b) => b.value - a.value);

    // Take only the top 3 predictions
    const top3Predictions = sortedPredictions.slice(0, 3);

    return (
      <View style={{ flex: 1 }}>
        <Image source={{ uri: imageUri }} style={{ flex: 1 }} resizeMode="contain" />
        {/* Display the name and probability of the top 3 predictions */}
      
      <View style={{ alignItems: 'center', backgroundColor: 'white', padding: 15 }}>
        {top3Predictions.map((prediction, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 18 }}>{prediction.name}</Text>
            <Text style={{ fontSize: 14, color: 'gray' }}>Probability: {prediction.value}</Text>
          </View>
        ))}
      </View>
        <Button
          style={{ 
                  alignSelf: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                  // paddingVertical: 15,
                  // marginBottom: 20,
                  //borderRadius: 10,
                  //width: 200,
                  //backgroundColor: '#d9d9d6',
                  padding: 15 }}
          onPress={() => this.setState({ imageUri: null })}
        >
          <Text style={{ 
                  fontSize: 18, 
                  color: 'black' }}>Retake Photo</Text>
        </Button>
      </View>
    );
  };
  render() {
    const { imageUri } = this.state;
    return imageUri ? this.renderImageView() : this.renderCameraView();
  }
}
