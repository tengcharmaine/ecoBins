import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default class App extends React.Component {
    render() {
        return (
            <MapView
                style={styles.container}
                provider={PROVIDER_GOOGLE}
                showsUserLocation
                showsMyLocationButton={true}
                initialRegion={{
                    latitude: 1.2949,
                    longitude: 103.7737,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
            <Marker
                draggable
                coordinate={{
                    latitude: 1.2949,
                    longitude: 103.7737,
                }}
                onDragEnd={
                    (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
                }
                title={'Test Marker'}
                description={'This is a description of the marker'}
            />
            </MapView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 10,
        bottom: 350,
        left: 20,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});