import { KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_APP, FIRESTORE_DB, firebaseAuth } from '../firebaseConfig'
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha'
import { firebaseConfig } from '../firebaseConfig'
import { TextInput, Button, Stack } from '@react-native-material/core'

const LoginWithPhoneScreen = ({ navigation }) => {
    const [phone, setPhone] = useState('+90 553 524 45 94')
    const [code, setCode] = useState('')
    const [verificationId, setVerificationId] = useState('')
    const recaptchaVerifier = useRef(null)
    const [loading, setLoading] = useState(false)

    const sendVerification = () => {
        console.log('phone', phone)

        const phoneProvider = new firebaseAuth.PhoneAuthProvider(FIREBASE_AUTH);
        phoneProvider
            .verifyPhoneNumber(phone, recaptchaVerifier.current)
            .then(
                (verificationId) => {
                    setVerificationId(verificationId)
                    // navigate to OTP screen with verificationId as prop
                    navigation.navigate('OTPScreen', { verificationId })
                    console.log('verificationId', verificationId)
                }
            )
            .catch((error) => {
                console.log(error)
            });

        //setPhone('')
    }

    /* const validatePhone = (text) => {
        // validate if phone number is valid or not
        var phoneRegex = /^\+[1-9]\d{1,14}$/;

        // Remove any whitespace or dashes from the phone number
        var phoneNumber = text.replace(/\s+/g, '').replace(/-/g, '');

        // Check if the phone number matches the regular expression
        if (phoneRegex.test(phoneNumber)) {
            return true;
        } else {
            return false;
        }
    } */

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
                        color='#3f51b5'
                        placeholder="Phone"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        autoCapitalize='none'
                        keyboardType='phone-pad'
                    />
                </View>
                <View style={styles.buttonContainer}>
                    <Button variant="contained" title="Send Verification Code" color="#3f51b5" onPress={() => sendVerification()} style={{ marginTop: 10 }} loading={loading} disabled={loading} />
                    <Button variant="contained" title="Register via E-mail" color="#3f51b5" onPress={() => navigation.navigate('Register')} style={{ marginTop: 10 }} loading={loading} disabled={loading} />
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
        width: '80%',
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