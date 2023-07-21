import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Linking, Platform, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default class BinsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      nearestMarker: null,
      locationPermissionGranted: null,
    };
  }

  componentDidMount() {
    this.getLocation();
  }
  
  getLocation = async () => {
    try {
      this.setState({ locationPermissionGranted: null });
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        //console.error('Permission to access location was denied');
        this.showLocationPermissionDeniedAlert();
        this.setState({ locationPermissionGranted: false });
        return;
        
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.setState({ currentLocation: { latitude, longitude }, locationPermissionGranted: true, });
      this.findNearestMarker({ latitude, longitude });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };  

  showLocationPermissionDeniedAlert = () => {
    Alert.alert(
      'Location Permission Required',
      'You have denied location permission for the app. To enable this feature, please go to the app settings and allow location access.',
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

  findNearestMarker = (currentLocation) => {
    const { latitude, longitude } = currentLocation;
    let minDistance = Infinity;
    let nearestMarker = null;

    markers.forEach((marker) => {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        marker.latitude,
        marker.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestMarker = marker;
      }
    });

    this.setState({ nearestMarker });
  };

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    const radLat1 = (Math.PI * lat1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const theta = lon1 - lon2;
    const radTheta = (Math.PI * theta) / 180;
    let dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344; // convert to kilometers

    return dist;
  };

  // handleMyLocationPress = () => {
  //   const { currentLocation } = this.state;
  
  //   if (currentLocation) {
  //     this.mapRef.animateToRegion({
  //       latitude: currentLocation.latitude,
  //       longitude: currentLocation.longitude,
  //       latitudeDelta: 0.0922,
  //       longitudeDelta: 0.0421,
  //     });
  //   }
  // };

  render() {
    const { currentLocation, nearestMarker, locationPermissionGranted } = this.state;
  
    if (locationPermissionGranted === null) {
      // Show a loading indicator or any other content while the permission is being checked
      return (
        <View style={styles.container}>
          <Image source={{uri: "https://media.giphy.com/media/vbeNMLuswd7RR25lah/giphy.gif" }}
                   style={{height: '30%', width: '60%', borderRadius: 60}}></Image>
        </View>
      );
    }

    if (!locationPermissionGranted) {
      // If permission is denied, show the permission request button
      return (
        <View style={styles.container}>
          <Image source={require('./../../images/map.png')}
                   style={{height: '40%', width: '50%', resizeMode: 'contain'}}></Image>
          <Text style={styles.text2}>This feature requires location permissions {'\n'} to provide real-time updates for finding {'\n'} the nearest recycling bin near you.</Text>
          <Text style={styles.text2}>Thank you for your kind understanding!</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.getLocation}
          >
            <Text style={styles.text1}>I have already granted {'\n'} my location permission.</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {currentLocation ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            ref={(ref) => (this.mapRef = ref)}
            showsMyLocationButton={true}
            mapPadding={{right: 10, bottom: 100, left: 10}}
            initialRegion={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                title={marker.title}
                description={marker.description}
              />
            ))}
             {/* <TouchableOpacity
              style={styles.myLocationButton}
              onPress={this.handleMyLocationPress}
            >
              <Text style={styles.myLocationButtonText}>My Location</Text>
            </TouchableOpacity> */}
          </MapView>
        ) : (
          <Text>Loading...</Text>
        )}
  
        {nearestMarker && (
          <View style={styles.nearestMarkerContainer}>
            <Text style={styles.nearestMarkerText}>
              Nearest Marker: {nearestMarker.title}
            </Text>
            {nearestMarker.description && (
              <Text style={styles.nearestMarkerDescription}>
                {nearestMarker.description}
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }
}
  
const markers = [
  {
    id: 1,
    latitude: 1.294533,
    longitude: 103.774034,
    title: 'Com 3',
    description: 'Beside Terrace canteen',
  },
  {
    id: 2,
    latitude: 1.2966,
    longitude: 103.7732,
    title: 'Near Central Library',
  },
  {
    id: 3,
    latitude: 1.2955,
    longitude: 103.7734,
    title: 'Near LT15',
  },
  {
    id: 4,
    latitude: 1.2944,
    longitude: 103.7726,
    title: 'The Deck canteen',
  },
  {
    id: 5,
    latitude: 1.2948,
    longitude: 103.7729,
    title: 'Com 1',
    description: 'Near Level 2 study area',
  },
  {
    id: 6,
    latitude: 1.29251,
    longitude: 103.77571,
    title: 'I3 building',
  },
  {
    id: 7,
    latitude: 1.2942,
    longitude: 103.7719,
    title: 'AS5',
  },
  {
    id: 8,
    latitude: 1.2946,
    longitude: 103.7718,
    title: 'AS4',
  },
  {
    id: 9,
    latitude: 1.29506,
    longitude: 103.7714,
    title: 'AS3',
  }, 
  {
    id: 10,
    latitude: 1.297337,
    longitude: 103.780733,
    title: 'S17',
  },
  {
    id: 11,
    latitude: 1.297148,
    longitude: 103.7787,
    title: 'University Hall busstop',
  },
  {
    id: 12,
    latitude: 1.2945,
    longitude: 103.7841,
    title: 'NUH',
    description: 'Near taxi pick up',
  },
  {
    id: 13,
    latitude: 1.2963,
    longitude: 103.7801,
    title: 'Frontier canteen',
  },
  {
    id: 14,
    latitude: 1.29971,
    longitude: 103.77546,
    title: 'University Sports Center',
    description: 'Near Tea Party',
  },
  {
    id: 15,
    latitude: 1.2967,
    longitude: 103.78710,
    title: 'Faculty of Science',
    description: 'Near staircase leading up to Frontier canteen; Near OCBC ATM',
  }
];

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
    backgroundColor: "#c7dede",
    width: '85%',
    height: 60,
    marginTop: 40,
    marginBottom: 10,
    borderRadius: 20,
    },
text1: {
  color: "black",
  fontWeight: 'bold',
  fontSize: 19,
  textAlign: 'center',
  },
  text2: {
    color: "black",
    textAlign: "center",
    fontSize: 16,
    marginTop: 10,
},
});