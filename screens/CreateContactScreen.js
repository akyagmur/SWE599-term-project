import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-paper'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { ScrollView } from 'react-native-gesture-handler'
import PhoneInput from '@sesamsolutions/phone-input'
import { getAuth } from 'firebase/auth'
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig'

const CreateContactScreen = () => {
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');

    React.useEffect(() => {
    }, []);

    const addContact = async () => {
        const contactEmail = email;
        const contactPhone = phone;
        var value, field;

        if (contactEmail !== '') {
            value = contactEmail;
            field = 'email';
        } else if (contactPhone !== '') {
            value = contactPhone;
            field = 'phone';
        } else {
            return;
        }

        const db = FIRESTORE_DB;
        const auth = getAuth();
        const currentUser = auth.currentUser;
        const currentUserId = currentUser.uid;
        
        // Find the user who is being added as a contact
        const contactQuery = query(collection(db, 'users'), where(field, '==', email));
        const contactQuerySnapshot = await getDocs(contactQuery);

        if (contactQuerySnapshot.empty) {
            console.log("No user found with the provided contact email");
            return;
        }

        // Get the first document from the query result (there should only be one)
        const contactDoc = contactQuerySnapshot.docs[0];
        const contactId = contactDoc.id;
        const contactData = contactDoc.data();

        // Check if the contact already exists in the current user's contacts
        const currentUserContactsQuery = query(collection(db, 'users', currentUserId, 'contacts'), where('uid', '==', contactId));
        const currentUserContactsQuerySnapshot = await getDocs(currentUserContactsQuery);

        if (!currentUserContactsQuerySnapshot.empty) {
            alert("This contact already exists in your contacts");
            return;
        }

        // Add the contact to the current user's contacts
        const currentUserContactDocRef = doc(db, 'users', currentUserId, 'contacts', contactId);
        const currentUserContactData = {
            uid: contactId,
            name: contactData.name,
            email: contactData.email,
            type: "sent",
            createdAt: new Date(),
            status: "pending"
        };
        await setDoc(currentUserContactDocRef, currentUserContactData);

        // Add the current user to the contact's contacts
        const contactContactDocRef = doc(db, 'users', contactId, 'contacts', currentUserId);
        const contactContactData = {
            uid: currentUserId,
            name: currentUser.displayName, // Replace with the current user's name
            email: currentUser.email,
            type: "received",
            createdAt: new Date(),
            status: "pending"
        };
        await setDoc(contactContactDocRef, contactContactData);
        // show an alert and navigate to the contacts screen after the alert is closed
        alert("Contact added successfully");
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
