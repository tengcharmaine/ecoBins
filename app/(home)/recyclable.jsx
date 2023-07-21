import React from 'react';
import { Text, View, TouchableOpacity, Image} from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import 'react-native-console-time-polyfill';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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
          'https://api.clarifai.com/v2/models/recyclable/versions/084a2de044de4129abc2ef67a0cb009e/outputs',
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
        const predictions = response.data.outputs[0]?.data?.concepts;
        console.log(predictions);
        this.setState({ imageUri: photo.uri, predictions: predictions });
      } catch (error) {
        console.log('Object detection error:', error);
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
                        borderRadius: 10, 
                        fontSize: 18, 
                        color: 'black' 
                      }}>Loading...</Text>) 
              : (<Text style={{ 
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
  
    const colorMap = {
      recyclable: 'green',
      'non-recyclable': 'red',
    };
  
    // Sort the predictions by probability in descending order
    const sortedPredictions = predictions.sort((a, b) => b.value - a.value);
  
    // Check if the top prediction is non-recyclable
    const isNonRecyclableTopPrediction =
      sortedPredictions.length > 0 && sortedPredictions[0].name.toLowerCase() === 'non-recyclable';
  
    // Prepare the predictions to be displayed
    let displayPredictions;
    if (isNonRecyclableTopPrediction) {
      // If non-recyclable is the top prediction, show only that prediction
      displayPredictions = [sortedPredictions[0]];
    } else {
      // If any other prediction is the top, show the top 2 predictions
      displayPredictions = sortedPredictions.slice(0, 2);
    }
  
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity onPress={() => this.setState({imageUri: null})} 
                          style={{position: 'absolute', top: 50, left: 16, zIndex: 1, padding: 10,
                          borderRadius: 10,}}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Image source={{ uri: imageUri }} style={{ marginTop: 90, flex: 1 }} resizeMode="contain" />
        {/* Display the name and probability of the predictions */}
        <View style={{ alignItems: 'center', padding: 15 }}>
          {displayPredictions.map((prediction, index) => (
            <View
              key={index}
              style={{
                marginBottom: 10,
                justifyContent: 'center',
                backgroundColor: colorMap[prediction.name.toLowerCase()] || 'gray',
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontSize: 18, color: 'white' }}>{prediction.name}</Text>
              <Text style={{ fontSize: 14, color: 'white' }}>Probability: {prediction.value}</Text>
            </View>
          ))}
        </View>
        {/* <Button
          style={{ alignSelf: 'center', borderColor: 'black', borderWidth: 3, marginBottom: 10 }}
          onPress={() => this.setState({ imageUri: null })}
        >
          <Text style={{ fontSize: 18, color: 'black' }}>Retake Photo</Text>
        </Button> */}
      </View>
    );
  };
  
  
  render() {
    const { imageUri } = this.state;
    return imageUri ? this.renderImageView() : this.renderCameraView();
  }
}