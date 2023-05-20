import { StyleSheet, Text, View } from 'react-native'
import { useEffect } from 'react'
import OneSignal from 'react-native-onesignal';
import Constants from "expo-constants";

const HomeScreen = () => {
  
  useEffect(() => {
    OneSignal.setLogLevel(6, 0);
    OneSignal.setAppId(Constants.manifest.extra.oneSignalAppId);
  }, []);

  // ask user for permission to send push notifications
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log("Prompt response:", response);
  });

  // subscribe to push notifications
 
  return (
    <View>
      <Text>asd</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})