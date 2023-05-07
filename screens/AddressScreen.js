import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { getAuth } from 'firebase/auth';

const AddressScreen = ({ navigation }) => {
    const [addresses, setAddresses] = React.useState([]);

    /* const getAddressesFromFirebase = async () => {
        const addressesRef = collection(FIRESTORE_DB, 'addresses')
        const querySnapshot = await getDocs(addressesRef);
        let addresses = [];
        querySnapshot.forEach((doc) => {
            addresses.push(doc.data());
        })

        setAddresses(addresses);
    }
 */
    const getAddressesByUserId = async (userId) => {
        const addressesRef = collection(FIRESTORE_DB, 'addresses');
        const q = query(addressesRef, where('uid', '==', userId));

        try {
            const querySnapshot = await getDocs(q);
            const addresses = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            console.log('Addresses:', addresses);
            setAddresses(addresses);
            return addresses;
        } catch (e) {
            console.error(e);
        }
    };


    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        getAddressesByUserId(user.uid);
    }, []);

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
                >My Addresses</Text>
            </View>
            <View style={{
                height: '90%',
                width: '100%',
            }}>
                {addresses.length > 0 ? (
                    addresses.map((address, index) => (
                        <ListItem
                            onPress={() => navigation.navigate('CreateAddress', { address: address })}
                            trailing={<Icon name="chevron-right" />}
                            title={address.addressName} />
                    )
                    )) :
                    <View
                        style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                            }}
                        >No addresses found</Text>



                    </View>
                }

                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={[styles.button, {
                            borderColor: '#0782F9',
                            borderWidth: 1,
                            marginTop: 15,
                            width: '80%',
                            flexDirection: 'row',
                        }]}
                        onPress={() => {
                            navigation.navigate('CreateAddress')
                        }}
                    >
                        <Text style={[styles.buttonText, {
                            color: '#0782F9'
                        }]}>Add new address</Text>
                        <Icon name="plus" size={20} color="#0782F9" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView >
    )
}

export default AddressScreen

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold'
    }

})