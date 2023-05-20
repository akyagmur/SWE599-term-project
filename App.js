import { KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginWithPhoneScreen from './screens/LoginWithPhoneScreen';
import OTPScreen from './screens/OTPScreen';
/*  */
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import 'react-native-gesture-handler';
import SplashScreen from './screens/SplashScreen';
import { useEffect, useMemo, useReducer, useState } from 'react';
import { AuthContext } from './components/context';
import MainTabScreen from './screens/MainTabScreen';
import ContactsScreen from './screens/ContactsScreen';
import { DrawerContent } from './screens/DrawerContent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, Button } from 'react-native-paper';
import SettingsScreen from './screens/SettingsScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import { getAuth, initializeAuth, onAuthStateChanged } from "firebase/auth";
import md5 from 'md5';
import { initializeApp } from 'firebase/app';
import { FIREBASE_APP, FIRESTORE_DB, firebaseConfig } from './firebaseConfig';
import { getReactNativePersistence } from "firebase/auth/react-native"
import OneSignal from 'react-native-onesignal';
// import CustomModal as SafetyStatusModal
import { default as SafetyStatusModal } from './components/CustomModal';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Drawer = createDrawerNavigator();
const UnauthenticatedStack = createStackNavigator();

const UnauthenticatedStackScreen = () => {
  return (
    <UnauthenticatedStack.Navigator screenOptions={{
      headerShown: false
    }}>
      <UnauthenticatedStack.Screen name="Splash" component={SplashScreen} />
      <UnauthenticatedStack.Screen name="Login" component={LoginScreen} />
      <UnauthenticatedStack.Screen name="Register" component={RegisterScreen} />
      <UnauthenticatedStack.Screen name="LoginWithPhone" component={LoginWithPhoneScreen} />
      <UnauthenticatedStack.Screen name="OTPScreen" component={OTPScreen} />
    </UnauthenticatedStack.Navigator>
  );
};

function App() {
  const initialLoginState = {
    isLoading: true,
    name: null,
    token: null,
    email: null,
    phone: null,
  };

  const [isSafetyRequestModalVisible, setSafetyRequestModalVisible] = useState(false);
  const [safetyRequestId, setSafetyRequestId] = useState('');
  const [safetyStatus, setSafetyStatus] = useState('safe');
  const [additionalData, setAdditionalData] = useState('');
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    OneSignal.setNotificationOpenedHandler((notification) => {
      const { additionalData } = notification.notification;
      if (additionalData?.type == 'safetyRequest') {
        setSafetyRequestId(additionalData.requestId);
        setSafetyRequestModalVisible(true);
        setNotificationData(additionalData);
      }
    });

    OneSignal.setNotificationWillShowInForegroundHandler((notificationReceivedEvent) => {
      const { additionalData } = notificationReceivedEvent.notification;
      console.log('notification from foreground event', additionalData);
      if (additionalData?.type == 'safetyRequest') {
        setSafetyRequestId(additionalData.requestId);
        setSafetyRequestModalVisible(true);
        setNotificationData(additionalData);
      }
    });
  }, []);

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          email: action.email,
          token: action.token,
          phone: action.phone,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          email: action.email,
          token: action.token,
          phone: action.phone,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          email: null,
          token: null,
          phone: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          email: action.email,
          token: action.token,
          phone: action.phone,
          isLoading: false,
        };
    }
  };

  const closeModal = () => {
    setSafetyRequestModalVisible(false);
  };

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    loginState,
    login: async (foundUser) => {
      foundUser = foundUser['_tokenResponse']
      const name = foundUser['displayName'] ?? null;
      const email = foundUser['email'];
      const token = foundUser['idToken'];
      const phone = foundUser['phoneNumber'] || null;
      let photoURL = foundUser['profilePicture'] || null;

      if (!photoURL) {
        photoURL = "https://www.gravatar.com/avatar/" + md5(email) + "?s=128";
      }

      try {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('phone', phone);
        await AsyncStorage.setItem('photoURL', photoURL);
      } catch (e) {
      }
      dispatch({ type: 'LOGIN', name, email, token, phone });
    },
    loginWithPhone: async (foundUser) => {
      let user = foundUser['user']
      const name = user['displayName'];
      const email = user['email'];
      const token = foundUser['_tokenResponse']['idToken'];
      const phone = user['phoneNumber'] || null;

      try {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('phone', phone);
      } catch (e) {
      }
      dispatch({ type: 'LOGIN', name, email, token, phone });
    },
    logout: async () => {
      try {
        await AsyncStorage.removeItem('name');
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('phone');
      } catch (e) {
      }
      dispatch({ type: 'LOGOUT' });
    }
  }), [loginState]);

  const handleFirstLogin = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      dispatch({ type: 'LOGOUT', token: null });
      return;
    }

    await AsyncStorage.getItem('token').then((value) => {
      dispatch({ type: 'RETRIEVE_TOKEN', token: value });
    });
  }

  const responseSafetyRequest = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const sender = notificationData.senderId;

    const db = FIRESTORE_DB;
    var newSafetyResponseId = md5(user.uid + Math.random().toString(36).substring(7) + new Date().getTime());
    const safetyResponseRef = doc(db, 'users', user.uid, 'safetyResponses', newSafetyResponseId);
    const safetyResponse = {
      status: safetyStatus,
      additionalData: additionalData,
      safetyResponseTime: new Date().getTime(),
    };
    await setDoc(safetyResponseRef, safetyResponse);

    // update user's collection
    const userDoc = doc(db, 'users', user.uid);
    updateDoc(userDoc, {
      latestSafetyStatus: safetyStatus,
      latestSafetyStatusTime: new Date().getTime(),
      latestSafetyResponseId: newSafetyResponseId,
    })
      .then(() => {
        console.log("Document successfully updated!");
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });

      setSafetyRequestModalVisible(false);
      alert('Response sent!');
  }

  useEffect(() => {
    handleFirstLogin();
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <SafetyStatusModal
          modalVisible={isSafetyRequestModalVisible} onDismiss={closeModal}
        >
          <KeyboardAvoidingView behavior="padding">
            <Text>
              Safety request received from {notificationData?.senderName}!
            </Text>
            {/* Buttons in a line, "Safe", "In danger", "Injured" */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                /* if clicked, change style as buttonSelected */
                style={safetyStatus == 'safe' ? [styles.button, styles.buttonSelected] : styles.button}
                onPress={() => {
                  setSafetyStatus('safe');
                }}
              >
                <Text
                  style={styles.buttonText}
                >Safe</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={safetyStatus == 'in-danger' ? [styles.button, styles.buttonSelected] : styles.button}
                onPress={() => {
                  setSafetyStatus('in-danger')
                }}
              >
                <Text
                  style={styles.buttonText}
                >Indanger</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={safetyStatus == 'injured' ? [styles.button, styles.buttonSelected] : styles.button}
                onPress={() => {
                  setSafetyStatus('injured')
                }}
              >
                <Text
                  style={styles.buttonText}
                >Injured</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.textInputContainer}>
              <Text style={styles.label}>Additional Data:</Text>
              <TextInput
                style={styles.input}
                value={additionalData}
                onChangeText={setAdditionalData}
                placeholder="Enter additional data"
                multiline
              />
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={responseSafetyRequest}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </SafetyStatusModal>
        <NavigationContainer>
          {loginState.token !== null ? (
            <Drawer.Navigator
              initialRouteName="Home"
              drawerContent={props => <DrawerContent {...props} />}
            >
              <Drawer.Screen options={{ headerShown: false }} name="HomeDrawer" component={MainTabScreen} />
              <Drawer.Screen options={{ headerShown: true }} name="ContactsScreen" component={ContactsScreen} />
              <Drawer.Screen options={{ headerShown: true }} name="SettingsScreen" component={SettingsScreen} />
            </Drawer.Navigator>
          )
            :
            <UnauthenticatedStackScreen />
          }
        </NavigationContainer>
      </KeyboardAvoidingView>
    </AuthContext.Provider>
  );
}

export default App;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  /* fill  */
  button: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0782F9',
    padding: 10,
    margin: 10,
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  buttonSelected: {
    backgroundColor: '#0756a3',
    justifyContent: 'center',
  },
  textInputContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  submitButton: {
    backgroundColor: '#0782F9',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

});