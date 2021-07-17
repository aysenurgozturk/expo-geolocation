import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  Dimensions,
  TouchableOpacity,
  _ScrollView,
} from "react-native";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { ScrollView } from "react-native-gesture-handler";

const Welcome = ({ navigation }) => {
  const width = Dimensions.get("screen").width;
  const height = Dimensions.get("screen").height;
  const aspect = width / height;
  const [location, setlocation] = React.useState({
    latitude: 0,
    longitude: 0,
    altitudeAccuracy: 0,
    accuracy: 0,
    heading: 0,
    speed: 0,
  });
  const [adress, setAdress] = React.useState("Konumunuz belirleniyor...");

  const [locationServiceEnabled, setLocationServiceEnabled] = useState(false);
  const [updateLocation, setUpdateLocation] = React.useState(false);

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

    if (coords) {
      const {
        latitude,
        longitude,
        altitudeAccuracy,
        accuracy,
        heading,
        speed,
      } = coords;
      // console.log(latitude, longitude);
      setlocation({
        latitude: latitude,
        longitude: longitude,
        altitudeAccuracy: altitudeAccuracy,
        accuracy: accuracy,
        heading: heading,
        speed: speed,
      });
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `Adress :${item.subregion}, ${item.district}, ${item.name}, ${item.postalCode},${item.subregion}/${item.region},\n${item.country}`;

        setAdress(address);
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
  React.useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const upLoc = async () => {
    await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 100,
      },
      async (pos) => {
        if (pos.coords) {
          setlocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            altitudeAccuracy: pos.coords.altitudeAccuracy,
            accuracy: pos.coords.accuracy,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
          });
          // latitude ve longtitude değerlerini vererek kullanıcının konumunun 
          let response = await Location.reverseGeocodeAsync({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          for (let item of response) {
            console.log(item);
            let address = `Adress :${item.subregion}, ${item.district}, ${item.name}, ${item.postalCode},${item.subregion}/${item.region},\n${item.country}`;

            setAdress(address);
          }
        }
      }
    );
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <MapView
          provider={PROVIDER_GOOGLE}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0922 * aspect,
          }}
          showsUserLocation={true}
          zoomControlEnabled={true}
          style={{ width: "100%", height: 350, marginTop: "10%" }}
        ></MapView>
        <View style={styles.locationTextContainer}>
          <Text style={styles.text}>{adress}</Text>
        </View>
        <TouchableOpacity
          style={styles.updateLocationButtonContainer}
          onPress={() => {
            upLoc();
          }}
        >
          <Text style={styles.updateLocationButtonText}>Konumumu Güncelle</Text>
        </TouchableOpacity>
        <View style={{ borderBottomWidth: 0.5 }}></View>
        <View style={{ width: "95%", padding: "3%" }}>
          <Text style={{ color: "black", textAlign: "center" }}>
            Medline'a iletilen adres şuan bulundugunuz adres değilse{" "}
            <Text style={{ color: "orange" }}> 444 12 12 </Text>Medline Alarm
            merkezi tarafından arandığınızda öncelikli olarak bu durumu
            belirtin.Eğer bu ekran göründükten 2-3 dakika sonra Medline
            tarafından aranmadıysanız ve acil bir durum yaşıyorsanız derhal{" "}
            <Text style={{ color: "orange" }}> 444 12 12 </Text> Medline Alarm
            Merkezini arayınız.
          </Text>
        </View>
      </View>
    </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",
  },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
  },
  updateLocationButtonContainer: {
    backgroundColor: "green",
    justifyContent: "center",
    width: "90%",
    padding: "3%",
    margin: "5%",
    borderRadius: 15,
  },
  updateLocationButtonText: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
  },
});

export default Welcome;
