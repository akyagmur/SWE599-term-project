import React, { useEffect, useRef, useState } from 'react';
import MapView, { Callout, Marker, Polygon } from 'react-native-maps';
import { StyleSheet, View, Button, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Text } from 'react-native-elements';
import OneSignal from 'react-native-onesignal';
import Constants from 'expo-constants';
import saveUserLocationTask from '../tasks/SaveUserLocationTask'; // Import the task function, don't delete this line
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

export default function HomeScreen() {
  const LOCATION_TASK_NAME = 'background-location-task';
  const [currentLocation, setCurrentLocation] = useState(null);
  const [friends, setFriends] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const mapViewRef = useRef(null); // Create a ref for the MapView
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);

  useEffect(() => {
    requestPermissions();
    showCurrentLocation();
    getFriends();
  }, []);

  const requestPermissions = async () => {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus === 'granted') {
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Balanced,
        });
      }
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        console.log('Location permission not granted');
      }
    } catch (error) {
      console.log('Error while retrieving current location:', error);
    }
  };

  const showCurrentLocation = async () => {
    setLocationLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        mapViewRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
        setLocationLoading(false);
      } else {
        console.log('Location permission not granted');
      }
    } catch (error) {
      console.log('Error while retrieving current location:', error);
      setLocationLoading(false);
    }
  };

  const getFriends = async () => {
    // get status is accepted friends
    try {
      const auth = getAuth();
      const currentUserId = auth.currentUser.uid;
      const friendRequestDocRef = collection(FIRESTORE_DB, 'users', currentUserId, 'contacts');
      const q = query(
        friendRequestDocRef,
        where('status', '==', 'accepted'),
      );
      const querySnapshot = await getDocs(q);
      const friends = [];
      querySnapshot.forEach((doc) => {
        friends.push(doc.data().uid);
      });
      //get friends from users collection
      const friendsDocRef = collection(FIRESTORE_DB, 'users');
      const friendsQuery = query(
        friendsDocRef,
        where('uid', 'in', friends),
      );
      const friendsQuerySnapshot = await getDocs(friendsQuery);
      const friendsData = [];
      friendsQuerySnapshot.forEach((doc) => {
        friendsData.push(doc.data());
      });
      setFriends(friendsData);
      return friendsData;
    } catch (error) {
      console.log('Error while retrieving friends:', error);
    }
  };

  const polygonCoordinates = [
    {
      "latitude": 40.98960858872415,
      "longitude": 29.03347782876732,
    },
    {
      "latitude": 41.00757916607504,
      "longitude": 29.025168479439056,
    },
    {
      "latitude": 41.02532545880672,
      "longitude": 29.04059098699743,
    },
    {
      "latitude": 41.01986420012309,
      "longitude": 29.066068763261978,
    },
    {
      "latitude": 41.01742746310171,
      "longitude": 29.089033961522787,
    },
    {
      "latitude": 40.993617822346835,
      "longitude": 29.11596011364506,
    },
    {
      "latitude": 40.97139883833948,
      "longitude": 29.116638067825107,
    },
    {
      "latitude": 40.96131998243878,
      "longitude": 29.091226792793595,
    },
    {
      "latitude": 40.973154271429785,
      "longitude": 29.054335226935212,
    }
  ];
  const savePolygonData = async () => {
    try {
      const data = {
        name: 'Flood in Istanbul Anatolian Side',
        coordinates: polygonCoordinates,
      };

      const docRef = await addDoc(collection(FIRESTORE_DB, 'disaster'), data);
      console.log('Polygon data saved with ID: ', docRef.id);
    } catch (error) {
      console.log('Error while saving polygon data: ', error);
    }
  };
  const calculatePolygonCentroid = (coordinates) => {
    const numPoints = coordinates.length;

    let x = 0;
    let y = 0;

    coordinates.forEach((point) => {
      x += point.latitude;
      y += point.longitude;
    });

    return {
      latitude: x / numPoints,
      longitude: y / numPoints,
    };
  };

  const polygonCentroid = calculatePolygonCentroid(polygonCoordinates);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;

    console.log('Clicked coordinates:', coordinate);
  };

  const refreshFriends = async () => {
    setLocationLoading(true);
    const friends = await getFriends().then((friends) => {
      setLocationLoading(false);
      setFriends(friends);
    });
  };


  return (
    <View style={styles.container}>
      <MapView
        ref={mapViewRef}
        style={styles.map}
        region={currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        } : undefined}
        onPress={handleMapPress}
      >
        <Polygon
          coordinates={polygonCoordinates}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.2)"
        />
        <Marker.Animated
          coordinate={polygonCentroid}
          title="Flood in Istanbul Anatolian Side"
          description="Started 2 hours ago"
          image={require('../assets/polygon-marker.png')}
          style={{ width: 10, height: 10 }}

        />
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
          />
        )}

        {friends.map((friend) => (
          <Marker
            coordinate={{
              latitude: friend.lastLocation.latitude,
              longitude: friend.lastLocation.longitude,
            }}
          >
            <Callout>
              <View
                style={{
                  backgroundColor: 'white',
                  paddingLeft: 10,
                  paddingTop: 10,
                  borderRadius: 10,
                }}
              >
                {/* Customize the tooltip content here */}
                <Text
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  {friend.name}
                  {friend.latestSafetyStatus == 'safe' ? (
                    <View style={[styles.bullet, { marginLeft: 10, backgroundColor: 'green' }]} />
                  ) : (
                    <View style={[styles.bullet, { marginLeft: 10, backgroundColor: 'red' }]} />
                  )}
                </Text>
                <Text>
                  {friend.latestSafetyStatus}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                  }}
                >
                </TouchableOpacity>
              </View>
            </Callout>

          </Marker>
        ))}
      </MapView>
      {/* <View style={styles.buttonContainer}>
        <Button title="Show Current Location" onPress={showCurrentLocation} />
      </View> */}
      {/* Show location Icon */}
      <View style={styles.refreshButton}>
        <Icon name="refresh" size={30} onPress={refreshFriends} />
      </View>
  
      <View style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
      }}>
        <Icon
          style={{
            borderRadius: 50,
          }}
          name="crosshairs-gps" size={30} onPress={showCurrentLocation}
        />
      </View>
      {/* Loading indicator */}
      {locationLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      )}
      {/* Friends box */}
      <View style={styles.friendsBox}>
        <View>
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Friends on map</Text>
          <View style={{ marginTop: 10 }}>
            {friends.map((friend) => (
              <View key={friend.uid} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.bullet, { backgroundColor: friend.latestSafetyStatus == 'safe' ? 'green' : 'red' }]} />
                <TouchableOpacity style={{ flex: 1 }}
                  onPress={() => {
                    mapViewRef.current.animateToRegion({
                      latitude: friend.lastLocation.latitude,
                      longitude: friend.lastLocation.longitude,
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }, 1000);
                  }}
                >
                  <Text style={{ marginLeft: 10 }}>{friend.displayName}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  friendsBox: {
    backgroundColor: 'white',
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    borderRadius: 10,
  },
  refreshButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
  },
});
