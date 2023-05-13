import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { ScrollView } from 'react-native-gesture-handler'
import PhoneInput from '@sesamsolutions/phone-input'
import { getAuth } from 'firebase/auth'
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig'

const CreateContactScreen = () => {
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');

    React.useEffect(() => {
    }, []);

    const addContactToCurrentUser = async (contact) => {
        const auth = getAuth();

        const userDocRef = doc(FIRESTORE_DB, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const user = userDoc.data();

        const contacts = user.contacts ?? [];

        let data = {
            uid: contact.id ?? '',
            email: contact.email ?? '',
            phone: contact.phone ?? '',
            displayName: contact.displayName ?? '',
            status: 'pending',
            type: 'sent',
            createdAt: new Date().getTime()
        };
        updateDoc(userDocRef, {
            contacts: [
                ...contacts,
                data
            ]
        });
    }

    const addContact = async () => {
        const auth = getAuth();

        let field, value;
        if (email !== '') {
            field = 'email';
            value = email;
        } else if (phone !== '') {
            field = 'phone';
            value = phone;
        }
        // Update user who receives the request
        const usersRef = collection(FIRESTORE_DB, 'users');
        const q = query(usersRef, where(field, '==', value));

        try {
            const querySnapshot = await getDocs(q);
            const users = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const user = users[0];
            const contacts = user.contacts ?? [];

            let isAlreadyInContacts = contacts.find((contact) => contact.uid === auth.currentUser.uid);
            if (isAlreadyInContacts) {
                alert('Contact already exists!');
                return;
            } else {

                addContactToCurrentUser(user);
            }

            const userDocRef = doc(FIRESTORE_DB, 'users', user.id);
            updateDoc(userDocRef, {
                contacts: [...contacts, {
                    uid: auth.currentUser.uid,
                    email: auth.currentUser.email,
                    phone: auth.currentUser.phoneNumber,
                    displayName: auth.currentUser.displayName,
                    status: 'pending',
                    type: 'received',
                    createdAt: new Date().getTime()
                }]
            });

            alert('Contact request sent!');
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                backgroundColor: '#fff',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                }}>

                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 10,
                        marginBottom: 10
                    }}
                >
                    Add Contact
                </Text>
                <Text>
                    Add contact by email or phone number
                </Text>
            </View>
            <View style={{
                height: '90%',
                width: '90%',
            }}>
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#666666"
                        autoCapitalize="none"
                        style={[styles.input, {
                            color: Colors.text
                        }]}
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <PhoneInput
                        initialCountry="TR"
                        onChange={(val) => setPhone(val)}
                        value={phone}
                    />
                </View>
                <TouchableOpacity
                    style={[styles.button, {
                        borderColor: '#0782F9',
                        borderWidth: 1,
                        marginTop: 15
                    }]}
                    onPress={() => {
                        addContact()
                    }}
                >
                    <Text style={[styles.buttonText, {
                        color: '#0782F9'
                    }]}>Add Contact</Text>
                </TouchableOpacity>
            </View>


        </ScrollView >
    )
}

export default CreateContactScreen

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
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    }
});
