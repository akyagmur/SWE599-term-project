import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Avatar } from 'react-native-paper'
import md5 from 'md5';
import { AuthContext } from '../components/context';
import { ListItem } from '@react-native-material/core';
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import { set } from 'react-native-reanimated';
const SettingsScreen = ({ navigation }) => {
    const { logout } = React.useContext(AuthContext);

    const [user, setUser] = React.useState({});
    const [image, setImage] = React.useState(null);
    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        setUser(user);
        setImage(auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://www.gravatar.com/avatar/" + md5(auth.currentUser.email) + "?s=128")
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
                    justifyContent: 'center'
                }}>
                {/* profile pic */}
                <Avatar.Image
                    /* gravatar via email address of user */
                    source={{
                        uri: image
                    }}
                    size={140}
                />
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: 'bold',
                            marginTop: 10,
                            marginBottom: 10
                        }}
                    >{user.displayName || "User"}</Text>
                    <Text>
                        {user.email || "email"}
                    </Text>
                    <Text>
                        {user.phone || ""}
                    </Text>
                </View>
            </View>
            <View style={{
                height: '60%',
                width: '100%',
            }}>
                {/* List of; profile settings, emergency contacts, devices, notifications, apperance,language, privacy&security, storage */}
                <ListItem
                    onPress={() => navigation.navigate('ProfileSettings')}
                    trailing={<Icon name="chevron-right" />}
                    title="Profile Settings" />
                <ListItem
                    onPress={() => navigation.navigate('Address')}
                    trailing={<Icon name="chevron-right" />}
                    title="My Addresses" />
                <ListItem
                    onPress={() => navigation.navigate('Contacts')}
                    trailing={<Icon name="chevron-right" />}
                    title="Emergency Contacts" />
            </View>
        </ScrollView>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({

})