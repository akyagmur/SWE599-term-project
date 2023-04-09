import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { Button } from 'react-native'
import { FIREBASE_AUTH, FIREBASE_APP, FIRESTORE_DB, firebaseAuth } from '../firebaseConfig'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../firebaseConfig'

const LoginWithPhoneScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('')
    const [code, setCode] = useState('')
    const [verificationId, setVerificationId] = useState('')
    const recaptchaVerifier = useRef(null)

    const sendVerification = () => {
        alert(phone)
        const phoneProvider = new firebaseAuth.PhoneAuthProvider(FIREBASE_AUTH);
        phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current)
            .then(setVerificationId)

        setPhone('')
    }

    const confirmCode = () => {
        const credential = firebaseAuth.PhoneAuthProvider.credential(verificationId, code)
        firebaseAuth.signInWithCredential(FIREBASE_AUTH, credential)
            .then((result) => {
                setCode('')
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const handleLogin = () => {

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <SafeAreaView style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Phone"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        style={styles.input}
                        autoCapitalize='none'
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => sendVerification()}
                        style={[styles.button]}
                    >
                        <Text style={styles.buttonText}>Login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        /* onPress navigate to register page */
                        onPress={() => navigation.navigate('Register')}
                        style={[styles.button, styles.buttonOutline]}
                    >
                        <Text style={styles.buttonOutlineText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default LoginWithPhoneScreen

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