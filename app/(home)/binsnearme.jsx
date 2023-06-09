// import React, {Component} from 'react';
// import {Platform, StyleSheet, Text, View} from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

// export default class App extends React.Component {
//     render() {
//         return (
//             <MapView
//                 style={styles.container}
//                 provider={PROVIDER_GOOGLE}
//                 showsUserLocation
//                 showsMyLocationButton={true}
//                 initialRegion={{
//                     latitude: 1.2949,
//                     longitude: 103.7737,
//                     latitudeDelta: 0.0922,
//                     longitudeDelta: 0.0421,
//                 }}
//             >
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.294533,
//                     longitude: 103.774034,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Com 3'}
//                 description={'Beside Terrace canteen'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2966,
//                     longitude: 103.7732,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Near Central Library'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2955,
//                     longitude: 103.7734,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Near LT15'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2944,
//                     longitude: 103.7726,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'The Deck canteen'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2948,
//                     longitude: 103.7729,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Com 1'}
//                 description={'Near Level 2 study area'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.29251,
//                     longitude: 103.77571,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'I3 building'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2942,
//                     longitude: 103.7719,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'AS5'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2946,
//                     longitude: 103.7718,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'AS4'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.29506,
//                     longitude: 103.7714,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'AS3'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.297337,
//                     longitude: 103.780733,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'S17'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.297148,
//                     longitude: 103.7787,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'University Hall busstop'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2945,
//                     longitude: 103.7841,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'NUH'}
//                 description={'Near taxi pick up'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2963,
//                     longitude: 103.7801,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Frontier canteen'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.29971,
//                     longitude: 103.77546,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'University Sports Center'}
//                 description={'Near Tea Party'}
//             />
//             <Marker
//                 draggable
//                 coordinate={{
//                     latitude: 1.2967,
//                     longitude: 103.78710,
//                 }}
//                 onDragEnd={
//                     (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                 }
//                 title={'Faculty of Science'}
//                 description={'Near staircase leading up to Frontier canteen; Near OCBC ATM'}
//             />
//             </MapView>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         top: 10,
//         bottom: 350,
//         left: 20,
//         right: 20,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
// });

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      nearestMarker: null,
    };
  }

  componentDidMount() {
    this.getLocation();
  }
  
  getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }
  
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      this.setState({ currentLocation: { latitude, longitude } });
      this.findNearestMarker({ latitude, longitude });
    } catch (error) {
      console.error('Error getting location:', error);
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

  render() {
    const { currentLocation, nearestMarker } = this.state;
  
    return (
      <View style={styles.container}>
        {currentLocation ? (
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            showsUserLocation
            showsMyLocationButton={true}
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
  },
  nearestMarkerDescription: {
    marginTop: 5,
  },
});