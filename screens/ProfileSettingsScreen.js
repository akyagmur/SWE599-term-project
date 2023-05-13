import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
    Button,
    KeyboardAvoidingView
} from 'react-native';
import { Avatar, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from '../components/context';
import md5 from 'md5';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { getAuth, updatePassword, updatePhoneNumber, updateProfile } from 'firebase/auth';
import PhoneInput from '@sesamsolutions/phone-input';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL, uploadString, uploadBytesResumable } from 'firebase/storage';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha'
import { FIREBASE_AUTH, firebaseAuth } from '../firebaseConfig';
import {
    Provider,
    Stack,
    Dialog,
    DialogHeader,
    DialogContent,
    DialogActions
} from '@react-native-material/core';
import { firebaseConfig } from '../firebaseConfig'
import CustomModal from '../components/CustomModal';

const ProfileSettings = ({ navigation }) => {
    const { logout } = React.useContext(AuthContext);

    const [user, setUser] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState(null);
    const [image, setImage] = React.useState(null);
    const [verificationId, setVerificationId] = React.useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [otpModalVisible, setOtpModalVisible] = React.useState(false);
    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };
    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        setName(user.displayName);
        setEmail(user.email);
        setPhone(user.phoneNumber);
        setUser(user);
        setImage(auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://www.gravatar.com/avatar/" + md5(auth.currentUser.email) + "?s=128")
        setProfileImage(image);
    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const storage = getStorage();


    const getBlobFroUri = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        return blob;
    };

    const chooseImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All
        });

        if (!result.canceled) {
            const { assets } = result;
            const { uri } = assets[0];
            //upload to firebase storage

            const blob = await getBlobFroUri(uri);
            const storageRef = ref(storage, 'profileImages/' + user.uid + '.jpg');
            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on('state_changed',
                (snapshot) => {
                    //progress
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    //error

                },
                () => {
                    //complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);

                        const auth = getAuth();
                        const user = auth.currentUser;

                        updateProfile(user, {
                            photoURL: downloadURL
                        }).then(() => {

                        }).catch(function (error) {
                            alert(error.message)
                        });

                        setProfileImage(downloadURL);
                    });
                }
            );

            setProfileImage(uri);
        }
    };
    const recaptchaVerifier = React.useRef(null)

    const saveProfileInfo = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        let data = {
            displayName: name,
            name: name,
        }

        if (password) {
            updatePassword(user, password)
                .then(function () {
                    // Update successful.
                }).catch(function (error) {
                    // An error ocurred
                    // ...
                    alert(error.message)
                    return
                });
        }
        if (phone) {
            const phoneProvider = new firebaseAuth.PhoneAuthProvider(FIREBASE_AUTH);
            phoneProvider
                .verifyPhoneNumber(phone.input, recaptchaVerifier.current)
                .then(
                    (verificationId) => {
                        setVerificationId(verificationId)
                        setModalVisible(true)
                    }
                )
                .catch((error) => {

                });
        }

        updateProfile(user, data)
            .then(() => {
                alert('Profile updated successfully')
            })
            .catch(function (error) {
                alert(error.message)
            });

    }

    const confirmCode = () => {
        if (otpCode.length < 6) {
            alert('Please enter a valid code')
            return
        }
        const credential = firebaseAuth.PhoneAuthProvider.credential(verificationId, otpCode)
        updatePhoneNumber(user, credential).then(() => {
            alert('Phone number updated successfully')
            setModalVisible(false)
            setOtpCode('')
        }).catch((error) => {
            alert(error.message)
        });
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <CustomModal modalVisible={modalVisible} onDismiss={closeModal}>
                    <View style={{ flex: 1 }}>

                        <Text>Enter the OTP code sent to your phone</Text>
                        <TextInput value={otpCode} onChangeText={(text) => setOtpCode(text)} label="OTP Code" variant="standard" />
                        <TouchableOpacity
                            style={[styles.signIn, {
                                borderColor: '#0782F9',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                            onPress={() => {
                                confirmCode()
                            }}
                        >
                            <Text style={[styles.textSign, {
                                color: '#0782F9'
                            }]}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </CustomModal>
                <TouchableOpacity style={styles.profileImageContainer} onPress={chooseImage}>
                    <Avatar.Image
                        /* gravatar via email address of user */
                        source={{
                            uri: profileImage
                        }}
                        size={150}
                    />
                    <View style={styles.cameraIconContainer}>
                        <Icon name="camera" size={24} color="#fff"
                            style={{
                                opacity: 0.7,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                zIndex: 100,
                            }}
                        />
                    </View>
                </TouchableOpacity>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Full Name"
                        value={name}
                        onChangeText={(text) => setName(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Your E-mail"
                        placeholderTextColor="#666666"
                        style={[styles.input, {
                            color: Colors.text
                        }]}
                        autoCapitalize="none"
                        value={email}
                        disabled
                    />
                </View>
                <View style={styles.inputContainer}>
                    <FirebaseRecaptchaVerifierModal
                        ref={recaptchaVerifier}
                        firebaseConfig={firebaseConfig}
                    />
                    <PhoneInput
                        initialCountry="TR"
                        onChange={(val) => setPhone(val)}
                        value={phone}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        style={styles.input}
                        secureTextEntry
                    />
                </View>
                <TouchableOpacity
                    style={[styles.signIn, {
                        borderColor: '#0782F9',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                    onPress={() => {
                        saveProfileInfo()
                    }}
                >
                    <Text style={[styles.textSign, {
                        color: '#0782F9'
                    }]}>Save</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 80,
        width: 160,
        height: 160,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    cameraIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        padding: 5,
        borderRadius: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    inputContainer: {
        marginBottom: 10,
    },
    input: {
        backgroundColor: '#fff',
    },
    buttonContainer: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
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
    }
});

export default ProfileSettings;
