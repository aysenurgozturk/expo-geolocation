import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, Dimensions } from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const Welcome = ({ navigation }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const aspect = width / height;
  const [location, setlocation] = React.useState({ latitude: 0, longitude: 0 });

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState(
    "Wait, we are fetching you location..."
  );
  
  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  // create the handler method

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "İzin verilmedi",
        "Konumuzunu almak için izin vermeniz gerekmektedir.",
        [{ text: "Tamam" }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();
    console.log(coords);
    if (coords) {
      const { latitude, longitude } = coords;
      location.latitude = latitude;
      location.longitude = longitude;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        console.log(item);
        let address = `${item.name}, ${item.street}, ${item.postalCode}, ${item.city}`;

        setDisplayCurrentAddress(address);
      }
    }
  };
  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location Service not enabled",
        "Please enable your location services to continue",
        [{ text: "OK" }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  return (
    <View style={{flex:1,justifyContent:"flex-start"}}>
      <MapView
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922 * aspect,
        }}
        showsUserLocation={true}
         style={{width:"100%",height:350}}
      ></MapView>
      <View style={styles.locationTextContainer}>
           <Text style={styles.text}>{displayCurrentAddress}</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070707",
    alignItems: "center",
    paddingTop: 130,
  },

  locationTextContainer: {
    justifyContent:"center",
    alignItems:"center",
    padding:"5%"
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
    color: "black",
  },
});

export default Welcome;
