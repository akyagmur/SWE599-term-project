import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { RefreshControl, ScrollView } from 'react-native-gesture-handler'
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ListItem } from '@react-native-material/core';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import md5 from 'md5';

const ContactsScreen = ({ navigation }) => {
  const [friendRequests, setFriendRequests] = React.useState([]);

  React.useEffect(() => {
    getFriendRequests().then((data) => {
      console.log('thenhere', data);
      setFriendRequests(data);
    });
  }, []);

  const getFriendRequests = async () => {
    const user = getAuth().currentUser;
    // get current user collection's contacts collection
    const currentUserContactsRef = collection(FIRESTORE_DB, 'users', user.uid, 'contacts');
    // get all contacts
    const currentUserContactsQuerySnapshot = await getDocs(currentUserContactsRef);
    // set friend requests to current user's contacts
    let friendRequests = currentUserContactsQuerySnapshot.docs.map(doc => doc.data());

    // Fetch the latest safety status for each accepted friend request
    await Promise.all(
      friendRequests.map(async (friendRequest) => {
        if (friendRequest.status === 'accepted') {
          const friendUserId = friendRequest.uid;
          const friendUserDocRef = doc(FIRESTORE_DB, 'users', friendUserId);
          const friendUserDocSnapshot = await getDoc(friendUserDocRef);

          if (friendUserDocSnapshot.exists()) {
            const friendUserData = friendUserDocSnapshot.data();
            const latestSafetyStatus = friendUserData.latestSafetyStatus;
            // Update the friend request object with the latest safety status
            friendRequest.latestSafetyStatus = latestSafetyStatus;
          }
        }
      })
    );
    console.log('lookhere', friendRequests);
    return friendRequests;
  };


  async function acceptFriendRequest(requesterId) {
    const db = FIRESTORE_DB;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;
    // Get the friend request
    const friendRequestDocRef = doc(db, 'users', currentUserId, 'contacts', requesterId);
    const friendRequestDoc = await getDoc(friendRequestDocRef);

    if (!friendRequestDoc.exists()) {
      console.log("Friend request not found");
      return;
    }

    // Update the friend request status to accepted
    await setDoc(friendRequestDocRef, { status: "accepted" }, { merge: true });

    // Also update the status in the requester's contacts
    const requesterContactDocRef = doc(db, 'users', requesterId, 'contacts', currentUserId);
    await setDoc(requesterContactDocRef, { status: "accepted" }, { merge: true });
    alert("Friend request accepted");
    getFriendRequests();
  }

  async function declineFriendRequest(requesterId) {
    const db = FIRESTORE_DB;
    const auth = getAuth();
    const currentUser = auth.currentUser;
    const currentUserId = currentUser.uid;

    // Delete the friend request from the current user's contacts
    const friendRequestDocRef = doc(db, 'users', currentUserId, 'contacts', requesterId);
    await deleteDoc(friendRequestDocRef);

    // Also delete it from the requester's contacts
    const requesterContactDocRef = doc(db, 'users', requesterId, 'contacts', currentUserId);
    await deleteDoc(requesterContactDocRef);
    alert("Friend request declined");
    getFriendRequests();
  }

  const sendSafetyRequest = async (contactId) => {
    const db = FIRESTORE_DB;
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      const currentUserId = currentUser.uid;

      // Check if there is already a safety request from the current user to the contact
      const existingSafetyRequestRef = doc(db, 'users', contactId, 'safetyRequests', currentUserId);
      const existingSafetyRequest = await getDoc(existingSafetyRequestRef);

      if (existingSafetyRequest.exists()) {
        // If an existing safety request is found, handle it as desired
        alert('You have already sent a safety request to this contact');
        return;
      }

      // Create a new document in the "safetyRequests" subcollection of the contact with random id
      var newSafetyRequestId = md5(currentUserId + Math.random().toString(36).substring(7) + new Date().getTime());
      const safetyRequestsRef = doc(db, 'users', contactId, 'safetyRequests', newSafetyRequestId);
      await setDoc(safetyRequestsRef, {
        createdAt: new Date().getTime(),
        status: 'pending',
        type: 'sent',
        senderId: currentUserId,
        receiverId: contactId,
      });

      // Send a push notification to the contact
      // Call your function to send a push notification here

      // Show success message or perform any additional actions
      alert('Safety request sent successfully!');
    } catch (error) {
      console.error('Error sending safety request:', error);
      // Show error message or handle the error appropriately
    }
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await getFriendRequests().then((data) => {
      console.log('thenhere', data);
      setFriendRequests(data);
      setRefreshing(false);
    });
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: '#fff',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
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
        height: '93%',
        width: '100%',
        paddingRight: 10,

      }}>

        {/* FRIEND REQUESTS LIST */}
        {friendRequests.length > 0 ? (
          friendRequests.map((friendRequest) => (
            <ListItem
              key={friendRequest.uid}
              title={friendRequest.email}
              trailing={(props) => (
                <View style={{ flexDirection: 'row' }}>
                  {friendRequest.status === 'pending' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Icon name="account-check" size={20} color="#0782F9" />
                      {friendRequest.type === 'received' ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={async () => {
                              // Accept friend request
                              await acceptFriendRequest(friendRequest.uid);
                            }}
                          >
                            <Icon name="check" size={20} color="#0782F9" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={{ marginLeft: 10 }}
                            onPress={async () => {
                              // Decline friend request
                              await declineFriendRequest(friendRequest.uid);
                            }}
                          >
                            <Icon name="close" size={20} color="#0782F9" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{ marginLeft: 10 }}
                          onPress={async () => {
                            // Cancel friend request
                            await declineFriendRequest(friendRequest.uid);
                          }}
                        >
                          <Icon name="close" size={20} color="#0782F9" />
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {/* Green red or blue bullet */}
                      {friendRequest.latestSafetyStatus == 'safe' ? (
                        <View style={[styles.bullet, { marginRight: 10, backgroundColor: 'green' }]} />
                      ) : (
                        <View style={[styles.bullet, { marginRight: 10, backgroundColor: 'red' }]} />
                      )}
                      {/* Add safety request button */}
                      <TouchableOpacity
                        style={{ marginRight: 10 }}
                        onPress={async () => {
                          await sendSafetyRequest(friendRequest.uid);
                        }}
                      >
                        <Icon name="head-question-outline" size={25} color="#0782F9" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            />
          ))
        ) : (
          <Text>No friends or friend requests found</Text>
        )}
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 10,
          }}
        >
          <TouchableOpacity
            style={[styles.button, {
              borderColor: '#0782F9',
              borderWidth: 1,
              marginTop: 15,
              width: '80%',
              height: 50,
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
  },
  bullet: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})