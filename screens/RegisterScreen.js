import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { FIREBASE_AUTH, FIRESTORE_DB, firebaseAuth } from '../firebaseConfig'
import { AuthContext } from '../components/context';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import authErrors from '../components/firebase_auth_messages';
import { getAuth, updateCurrentUser, updatePhoneNumber, updateProfile } from 'firebase/auth';
import { updateMetadata } from 'firebase/storage';

const RegisterScreen = ({ navigation }) => {
    const { login } = React.useContext(AuthContext);
    const [data, setData] = React.useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        confirm_secureTextEntry: true,
    });

    const textInputChange = (val) => {
        const emailRegex = /\S+@\S+\.\S+/;

        if (val.length !== 0 && emailRegex.test(val)) {
            setData({
                ...data,
                email: val,
                check_textInputChange: true
            });
        } else {
            setData({
                ...data,
                email: val,
                check_textInputChange: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        setData({
            ...data,
            password: val
        });
    }

    const handleConfirmPasswordChange = (val) => {
        setData({
            ...data,
            confirm_password: val
        });
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const updateConfirmSecureTextEntry = () => {
        setData({
            ...data,
            confirm_secureTextEntry: !data.confirm_secureTextEntry
        });
    }

    const handleLogin = (email, password) => {
        firebaseAuth.signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                

                updateProfile(userCredential.user, {
                    displayName: data.name,
                })
                    .then(() => {
                        
                        login(userCredential)
                    });
            })
            .catch((error) => {
                
            })
            .finally(() => {
            })
    }

    const handleSaveUserInfo = (userCredential) => {
        const user = getAuth().currentUser;
        
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);

        setDoc(userDocRef, {
            name: userCredential.user.displayName || 'null',
            email: userCredential.user.email || 'null',
            displayName: userCredential.user.displayName || 'null',
            photoURL: userCredential.user.photoURL || 'null',
            uid: userCredential.user.uid || 'null',
            createdAt: new Date(),
        })
       /*  const usersRef = collection(FIRESTORE_DB, 'users')
        addDoc(usersRef, {
            name: userCredential.user.displayName || 'null',
            email: userCredential.user.email || 'null',
            displayName: userCredential.user.displayName || 'null',
            photoURL: userCredential.user.photoURL || 'null',
            uid: userCredential.user.uid || 'null',
            createdAt: new Date(),
        }) */
    }

    const handleSignUp = () => {
        let { email, password, confirm_password, name, check_textInputChange } = data

        if (name.length < 2) {
            alert('Please enter a valid name')
            return
        }

        if (password !== confirm_password) {
            alert('Password and confirm password are not matched')
            return
        }

        /* if (check_textInputChange) {
            alert('Please enter a valid email')
            return
        } */

        firebaseAuth
            .createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
            .then((userCredential) => {
                // Signed in
                
                handleLogin(email, password)
                handleSaveUserInfo(userCredential)
            })
            .catch((error) => {
                
                // get error message
                let errorMessage = '';
                var errorCode = error.code;
                errorCode = errorCode.replace('auth/', '');
                authErrors[errorCode] ? errorMessage = authErrors[errorCode] : errorMessage = error.message
                alert(errorMessage)
            });
    }

    // in this method, save user info to firestore


    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#0782F9' barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.text_header}>Register Now!</Text>
            </View>
            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>
                    {/* Display Name */}
                    <Text style={styles.text_footer}>Full name</Text>
                    <View style={styles.action}>

                        <TextInput
                            placeholder="Your full name"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => setData({
                                ...data,
                                name: val
                            })
                            }
                        />
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 25
                    }]}>E-mail</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your e-mail"
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => textInputChange(val)}
                        />
                        {data.check_textInputChange ?
                            <Animatable.View
                                animation="bounceIn"
                            >
                                <Feather
                                    name="check-circle"
                                    color="green"
                                    size={20}
                                />
                            </Animatable.View>
                            : null}
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 25
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={data.secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handlePasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.text_footer, {
                        marginTop: 25
                    }]}>Confirm Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Confirm Your Password"
                            secureTextEntry={data.confirm_secureTextEntry ? true : false}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val) => handleConfirmPasswordChange(val)}
                        />
                        <TouchableOpacity
                            onPress={updateConfirmSecureTextEntry}
                        >
                            {data.secureTextEntry ?
                                <Feather
                                    name="eye-off"
                                    color="grey"
                                    size={20}
                                />
                                :
                                <Feather
                                    name="eye"
                                    color="grey"
                                    size={20}
                                />
                            }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.textPrivate}>
                        <Text style={styles.color_textPrivate}>
                            By signing up you agree to our
                        </Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Terms of service</Text>
                        <Text style={styles.color_textPrivate}>{" "}and</Text>
                        <Text style={[styles.color_textPrivate, { fontWeight: 'bold' }]}>{" "}Privacy policy</Text>
                    </View>
                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { handleSignUp() }}
                        >
                            <LinearGradient
                                colors={['#0782F9', '#0782F9']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Register</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={[styles.signIn, {
                                borderColor: '#0782F9',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#0782F9'
                            }]}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0782F9'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});
