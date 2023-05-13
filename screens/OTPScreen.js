import { KeyboardAvoidingView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH, firebaseAuth } from '../firebaseConfig'
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { AuthContext } from '../components/context';

const OTPScreen = ({ route }) => {
    // prop verificationId is passed from LoginWithPhoneScreen
    const verificationId = route.params.verificationId
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: 6 });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const { loginWithPhone } = React.useContext(AuthContext);
    const confirmCode = () => {
        if (value.length < 6) {
            alert('Please enter a valid code')
            return
        }
        const credential = firebaseAuth.PhoneAuthProvider.credential(verificationId, value)
        firebaseAuth.signInWithCredential(FIREBASE_AUTH, credential)
            .then((result) => {
                loginWithPhone(result);
                setCode('')
            })
            .catch((error) => {
            });
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding"
        >
            <SafeAreaView style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <CodeField
                    ref={ref}
                    {...props}
                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                    value={value}
                    onChangeText={setValue}
                    cellCount={6}
                    rootStyle={styles.codeFieldRoot}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    renderCell={({ index, symbol, isFocused }) => (
                        <View
                            key={index}
                            onLayout={getCellOnLayoutHandler(index)}
                            style={[styles.cellWrapper, isFocused && styles.focusCell]}
                        >
                            <Text
                                style={styles.cell}
                            >
                                {symbol || (isFocused ? <Cursor /> : null)}
                            </Text>
                        </View>
                    )}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => confirmCode()}
                        style={[styles.button]}
                    >
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default OTPScreen

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
    },
    root: { flex: 1, padding: 20 },
    title: { textAlign: 'center', fontSize: 30 },
    codeFieldRoot: { marginTop: 20 },
    cellWrapper: {
        borderBottomWidth: 4,
        borderBottomColor: '#00000030',
        marginHorizontal: 5,
    },
    cell: {
        width: 50,
        height: 50,
        lineHeight: 38,
        fontSize: 24,
        textAlign: 'center',
        color: '#00000030',
    },
    focusCell: {
        borderColor: '#000',
    },
})