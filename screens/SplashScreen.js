import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"

                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}>
                <Text style={styles.title}>Stay connected with everyone!</Text>
                <Text style={styles.text}>Sign in with account</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <View style={[styles.button, { marginTop: 30 }]}>
                        <LinearGradient
                            colors={['#0782F9', '#0782F9']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Login</Text>

                        </LinearGradient>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <View style={styles.button}>
                        <LinearGradient
                            colors={['#0782F9', '#0782F9']}
                            style={styles.signIn}
                        >
                            <Text style={styles.textSign}>Register</Text>

                        </LinearGradient>
                    </View>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

export default SplashScreen

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0782F9'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 10
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});
