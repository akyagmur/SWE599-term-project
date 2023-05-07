import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./HomeScreen";
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import ContactsScreen from './ContactsScreen';
import SettingsScreen from './SettingsScreen';
import ProfileSettingsScreen from './ProfileSettingsScreen';
import AddressScreen from './AddressScreen';
import CreateAddressScreen from './CreateAddressScreen';

const HomeStack = createStackNavigator();
const ContactsStack = createStackNavigator();
const SettingsStack = createStackNavigator();
const BottomTabNavigator = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
    return (
        <BottomTabNavigator.Navigator
            activeColor='#3f51b5'
        >
            <BottomTabNavigator.Screen name="HomeDrawer" component={HomeStackScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarColor: 'red',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-home" color={color} size={26} />
                    ),
                }}
            />
            <BottomTabNavigator.Screen name="Contacts" component={ContactsStackScreen}
                options={{
                    tabBarLabel: 'Contacts',
                    tabBarColor: 'red',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-person" color={color} size={26} />
                    ),
                }}
            />
            <BottomTabNavigator.Screen name="Settings" component={SettingsStackScreen}
                options={{
                    tabBarLabel: 'Settings',
                    tabBarColor: 'red',
                    tabBarIcon: ({ color }) => (
                        <Icon name="ios-settings" color={color} size={26} />
                    ),
                }}
            />
        </BottomTabNavigator.Navigator>
    )
}

export default MainTabScreen;

const HomeStackScreen = ({ navigation }) => {

    const isUserLoggedIn = false;

    return (
        <HomeStack.Navigator
            /* blue */
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#3f51b5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <HomeStack.Screen name="Home" component={HomeScreen} options={{
                title: 'Home',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
        </HomeStack.Navigator>
    )
}

const ContactsStackScreen = ({ navigation }) => {
    return (
        <ContactsStack.Navigator
            /* blue */
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#3f51b5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <ContactsStack.Screen name="Contacts" component={ContactsScreen} options={{
                title: 'Contacts',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
        </ContactsStack.Navigator>
    )
}

const SettingsStackScreen = ({ navigation }) => {
    return (
        <SettingsStack.Navigator
            /* blue */
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#3f51b5',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <SettingsStack.Screen name="Settings" component={SettingsScreen} options={{
                title: 'Settings',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
            <SettingsStack.Screen name="ProfileSettings" component={ProfileSettingsScreen} options={{
                title: 'Profile Settings',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
            <SettingsStack.Screen name="Address" component={AddressScreen} options={{
                title: 'Address Settings',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
            <SettingsStack.Screen name="CreateAddress" component={CreateAddressScreen} options={{
                title: 'Address Settings',
                headerLeft: () => (
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#3f51b5" onPress={() => navigation.openDrawer()}></Icon.Button>
                )
            }} />
        </SettingsStack.Navigator>
    )
}