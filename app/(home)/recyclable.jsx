import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet, Alert, Linking, Platform, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';
import axios from 'axios';
import 'react-native-console-time-polyfill';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

export default class Recyclable extends React.Component {
  BinsScreenWrapper = () => {
    const [loaded] = useFonts({
      Poppins: require('../../assets/fonts/Poppins-Regular.ttf'),
      Poppins_Bold: require('../../assets/fonts/Poppins-Bold.ttf'),
      Poppins_SemiBold: require('../../assets/fonts/Poppins-SemiBold.ttf'),
    });
  
    if (!loaded) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="black" />
        </View>
      );
    }
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imageUri: null,
    predictions: [],
    errorMessage: '',
    isLoading: false,
  };

  componentDidMount = async () => {
    this.setState({ hasCameraPermission: null });
    this.checkPermissions();
  }

  checkPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      //console.error('Permission to access location was denied');
      this.showLocationPermissionDeniedAlert();
      this.setState({ hasCameraPermission: false });
      return;
      
    }
    this.setState({ hasCameraPermission: status === 'granted' });
    this.renderCameraView();
  }

  showLocationPermissionDeniedAlert = () => {
    Alert.alert(
      'Camera Permission Required',
      'You have denied camera permission for the app. To enable this feature, please go to the app settings and allow camera access.',
      [
        {
          text: 'OK',
          onPress: () => {
            this.openAppSettings();
          },
        },
      ]
    );
  };

  openAppSettings = () => {
    if (Platform.OS === 'android') {
      Linking.openSettings();
    } else {
      Linking.openURL('app-settings:');
    }
  };
  
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
      return (
        <View style={styles.container}>
          <Image source={{uri: "https://media.giphy.com/media/vbeNMLuswd7RR25lah/giphy.gif" }}
                   style={{height: '30%', width: '60%', borderRadius: 60}}></Image>
        </View>
      );
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.container}>
          <Image source={require('./../../images/camera.png')}
                   style={{height: '40%', width: '50%', resizeMode: 'contain'}}></Image>
          <Text style={styles.text2}>This feature requires camera permissions {'\n'} to provide insights on {'\n'} whether the item is recyclable.</Text>
          <Text style={styles.text2}>Thank you for your kind understanding!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.checkPermissions}
          >
            <Text style={styles.text1}>I have already granted {'\n'} my camera permission.</Text>
          </TouchableOpacity>
        </View>
      );
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
                style={styles.button}
                onPress={this.objectDetection}
              >
              {isLoading 
              ? (<Text style={styles.text1}>Loading...</Text>) 
              : (<Text style={styles.text1}>Detect Objects</Text>
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
              <Text style={{ fontSize: 18, color: 'white', fontFamily: "Poppins_SemiBold" }}>{prediction.name}</Text>
              <Text style={{ fontSize: 14, color: 'white', fontFamily: "Poppins"}}>Probability: {prediction.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  
  render() {
    const { imageUri } = this.state;
    return imageUri ? this.renderImageView() : this.renderCameraView();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  nearestMarkerContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  nearestMarkerText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nearestMarkerDescription: {
    marginTop: 5,
    textAlign: 'center'
  },
  myLocationButton: {
    position: 'absolute',
    bottom: 90,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  myLocationButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    borderColor: "black",
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: "#c7dede",
    width: '85%',
    height: 60,
    marginTop: 40,
    marginBottom: 20,
    borderRadius: 20,
    alignSelf: 'center',
      //   justifyContent: 'center',
      //   alignItems: 'center',
    backgroundColor: '#D9D9D6',
      //   padding: 15,
      //   paddingVertical: 15,
      //   width: 200,
    },
text1: {
  color: "black",
  fontWeight: 'bold',
  fontSize: 19,
  textAlign: 'center',
  fontFamily: "Poppins_SemiBold"
  },
  text2: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
    fontFamily: "Poppins"
},
});