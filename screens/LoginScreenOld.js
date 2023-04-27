import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
//import { Button } from 'react-native'
import { FIREBASE_AUTH, FIREBASE_APP, FIRESTORE_DB, firebaseAuth } from '../firebaseConfig'
import { TextInput, Button, Stack } from '@react-native-material/core'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loginDisabled, setLoginDisabled] = useState(true)
    const [loading, setLoading] = useState(false)

    const navigateToRegisterPage = () => {
        console.log('navigateToRegisterPage')

        navigation.navigate('Register')
    }

    const handleLogin = () => {
        setLoading(true)
        firebaseAuth.signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                // Signed in
                console.log('userCredential', userCredential)
                navigation.navigate('Home')
            })
            .catch((error) => {
                console.log('error', error)
                // ..
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/
        let isValid = re.test(email)

        setEmail(email)

        if (isValid) {
            setLoginDisabled(false)
        }
        else {
            setLoginDisabled(true)
        }

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <SafeAreaView style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        color='#3f51b5'
                        placeholder="Email"
                        value={email}
                        onChangeText={text => validateEmail(text)}
                        //style={styles.input}
                        label="Email"
                        autoCapitalize='none'
                        variant='outlined'
                    />
                    <TextInput
                        color='#3f51b5'
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        //style={styles.input}
                        label="Password"
                        secureTextEntry
                        autoCapitalize='none'
                        variant='outlined'
                        style={{ marginTop: 10 }}
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button variant="contained" title="Login" color="#3f51b5" onPress={() => handleLogin()} style={{ marginTop: 10 }} loading={loading} disabled={loading} />
                    <Button variant="outlined" title="Login with Phone" color="#3f51b5" onPress={() => navigation.navigate('LoginWithPhone')} style={{ marginTop: 10 }} />
                    <Button variant="outlined" title="Register" color="#3f51b5" onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }} />
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