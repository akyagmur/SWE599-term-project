import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Platform,
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

const ProfileSettings = ({ navigation }) => {
    const { logout } = React.useContext(AuthContext);

    const [user, setUser] = React.useState(null);
    const [profileImage, setProfileImage] = React.useState(null);

    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;

        setName(user.displayName);
        setEmail(user.email);
        setPhone(user.phoneNumber);
        setUser(user);
        let image = user.email ? "https://www.gravatar.com/avatar/" + md5(user.email) + "?s=128" : "https://www.gravatar.com/avatar/00000000000000000000000000000000?s=128";
        setProfileImage(image);
    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');

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
            
            setProfileImage(uri);
        }
    };
    
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
            updatePhoneNumber(user, phone)
                .then(function () {
                    // Update successful.
                })
                .catch(function (error) {
                    // An error ocurred
                    // ...
                    alert(error.message)
                    return
                });
        }

        // Update the user's display name
        updateProfile(user, data)
            .then(() => {
                console.log(auth.currentUser)
                alert('Profile updated successfully')

                navigation.navigate('Home')
            })
            .catch(function (error) {
                alert(error.message)
            });

    }

    return (
        <View style={styles.container}>
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
