import { StyleSheet, Text, View } from 'react-native';
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
import { ActivityIndicator } from 'react-native-paper';
import SettingsScreen from './screens/SettingsScreen';
import ProfileSettingsScreen from './screens/ProfileSettingsScreen';
import { getAuth } from "firebase/auth";

const Drawer = createDrawerNavigator();
const UnauthenticatedStack = createStackNavigator();

const UnauthenticatedStackScreen = () => {
  return (
    <UnauthenticatedStack.Navigator headerMode='none'>
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

  const [loginState, dispatch] = useReducer(loginReducer, initialLoginState);

  const authContext = useMemo(() => ({
    loginState,
    login: async (foundUser) => {
      foundUser = foundUser['_tokenResponse']
      const name = foundUser['displayName'] ?? null;
      const email = foundUser['email'];
      const token = foundUser['idToken'];
      const phone = foundUser['phoneNumber'] || null;

      try {
        await AsyncStorage.setItem('name', name);
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('phone', phone);
      } catch (e) {
        console.log(e);
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
        console.log(token)
      } catch (e) {
        console.log(e);
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
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    }
  }), [loginState]);

  const handleFirstLogin = async () => {

    const auth = getAuth();
    const user = auth.currentUser;

    if(!user){
      dispatch({ type: 'LOGOUT', token: null });
      return;
    }
    

    await AsyncStorage.getItem('token').then((value) => {
      dispatch({ type: 'RETRIEVE_TOKEN', token: value });
    });
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
    </AuthContext.Provider>
  );
}

export default App;