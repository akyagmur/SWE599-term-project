import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ListItem } from '@react-native-material/core';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';

const ContactsScreen = ({ navigation }) => {
  const [friendRequests, setFriendRequests] = React.useState([]);

  React.useEffect(() => {
    getFriendRequests();
  }, []);

  const getFriendRequests = async () => {
    const user = getAuth().currentUser;

    // Create a Firestore reference
    // Create a document reference using the user's uid
    const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);

    getDoc(userDocRef).then((userDoc) => {
      const userData = userDoc.data();

      const contacts = userData.contacts ?? [];

      setFriendRequests(contacts);
    });
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
        >My Contacts</Text>

      </View>
      <View style={{
        height: '90%',
        width: '100%',
      }}>

        {/* FRIEND REQUESTS LIST */}
        {friendRequests.length > 0 ? (
          friendRequests.map((friendRequest) => (
            <ListItem
              key={friendRequest.id}
              title={friendRequest.email}
              trailing={(props) =>
                friendRequest.status === 'pending' ?
                  (
                    <View
                      style={{
                        flexDirection: 'row',
                        width: 100
                      }}
                    >
                      <Icon name="clock" size={20} color="#0782F9" />
                      {friendRequest.type === 'received' ? (
                        <TouchableOpacity
                          style={{
                            marginLeft: 10
                          }}
                          onPress={() => {
                            // Accept friend request
                          }}
                        >
                          <Icon name="check" size={20} color="#0782F9" />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            marginLeft: 10
                          }}
                          onPress={() => {
                            // Cancel friend request
                          }}
                        >
                          <Icon name="close" size={20} color="#0782F9" />
                        </TouchableOpacity>
                      )
                      }
                    </View>
                  ) : (
                    <Icon name="check" size={20} color="#0782F9" />
                  )
              }
            />
          ))
        ) :
          <Text>No friend requests</Text>
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
              navigation.navigate('CreateContact')
            }}
          >
            <Text style={[styles.buttonText, {
              color: '#0782F9'
            }]}>Add new contact</Text>
            <Icon name="plus" size={20} color="#0782F9" />
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  )
}

export default ContactsScreen

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