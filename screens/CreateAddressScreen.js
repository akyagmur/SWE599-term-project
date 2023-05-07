import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { TextInput } from 'react-native-paper'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { FIRESTORE_DB } from '../firebaseConfig'
import { getAuth } from 'firebase/auth'
import { useRoute } from '@react-navigation/native'

const CreateAddressScreen = (props) => {
  const route = useRoute();
  const [addressId, setAddressId] = React.useState('');
  const [addressName, setAddressName] = React.useState('');
  const [city, setCity] = React.useState('');
  const [district, setDistrict] = React.useState('');
  const [neighborhood, setNeighborhood] = React.useState('');
  const [street, setStreet] = React.useState('');
  const [buildingNo, setBuildingNo] = React.useState('');
  const [flatNo, setFlatNo] = React.useState('');
  const [editMode, setEditMode] = React.useState(false);
  const address = route.params?.address;

  React.useEffect(() => {
    if (address) {
      setEditMode(true);
      setAddressId(address.id);
      setAddressName(address.addressName);
      setCity(address.city);
      setDistrict(address.district);
      setNeighborhood(address.neighborhood);
      setStreet(address.street);
      setBuildingNo(address.buildingNo);
      setFlatNo(address.flatNo);
    }
  }, [address]);

  const saveAddress = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (editMode) {
      updateDoc(doc(FIRESTORE_DB, 'addresses', addressId), {
        addressName,
        city,
        district,
        neighborhood,
        street,
        buildingNo,
        flatNo,
      }).then(() => {
        alert('Address updated successfully');
      }).catch((error) => {
        alert('Error updating address');
      });
    } else {
      addDoc(collection(FIRESTORE_DB, 'addresses'), {
        uid: user.uid,
        addressName,
        city,
        district,
        neighborhood,
        street,
        buildingNo,
        flatNo,
      }).then(() => {
        alert('Address saved successfully');
      }).catch((error) => {
        alert('Error saving address');
      });
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
          {editMode ? 'Edit Address' : 'Create Address'}
        </Text>
      </View>
      <View style={{
        height: '90%',
        width: '90%',
      }}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Address Name"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={addressName}
            onChangeText={(text) => setAddressName(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="City"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={city}
            onChangeText={(text) => setCity(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="District"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={district}
            onChangeText={(text) => setDistrict(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Neighborhood"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={neighborhood}
            onChangeText={(text) => setNeighborhood(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Street"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={street}
            onChangeText={(text) => setStreet(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Building No"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={buildingNo}
            onChangeText={(text) => setBuildingNo(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Flat No"
            placeholderTextColor="#666666"
            style={[styles.input, {
              color: Colors.text
            }]}
            value={flatNo}
            onChangeText={(text) => setFlatNo(text)}
          />
        </View>
        <TouchableOpacity
          style={[styles.signIn, {
            borderColor: '#0782F9',
            borderWidth: 1,
            marginTop: 15
          }]}
          onPress={saveAddress}
        >
          <Text style={[styles.textSign, {
            color: '#0782F9'
          }]}>Save</Text>
        </TouchableOpacity>
      </View>


    </ScrollView>
  )
}

export default CreateAddressScreen

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
