import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Button } from 'react-native'
import { FIREBASE_AUTH, FIREBASE_APP, FIRESTORE_DB, firebaseAuth } from '../firebaseConfig'


const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigateToRegisterPage = () => {
        console.log('navigateToRegisterPage')

        navigation.navigate('Register')
    }

    const handleLogin = () => {
        firebaseAuth.signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                // Signed in
                console.log('userCredential', userCredential)
                // ...
            })
            .catch((error) => {
                console.log('error', error)
                // ..
            });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <SafeAreaView style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style={styles.input}
                        autoCapitalize='none'
                    />
                    <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => handleLogin()}
                        style={[styles.button]}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('LoginWithPhone')}
                        style={[styles.button, { marginTop: 5 }]}
                    >
                        <Text style={styles.buttonText}>Login using Phone</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        /* onPress navigate to register page */
                        onPress={() => navigateToRegisterPage()}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white'
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: '#f2f2f2',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonOutline: {
        backgroundColor: 'white',
        marginTop: 5,
        borderColor: '#0782F9',
        borderWidth: 2
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    buttonOutlineText: {
        color: '#0782F9',
        fontWeight: '700',
        fontSize: 16
    }
})