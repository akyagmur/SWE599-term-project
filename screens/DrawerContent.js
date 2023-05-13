import React from "react";
import { StyleSheet, Text, View } from "react-native";
import {
    DrawerContentScrollView,
    DrawerItem
} from "@react-navigation/drawer";
import { Avatar, Title, Caption, Paragraph, Drawer, TouchableRipple, Switch } from "react-native-paper";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { AuthContext } from "../components/context";
import md5 from 'md5';
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function DrawerContent(props) {

    const [isDarkTheme, setIsDarkTheme] = React.useState(false);
    const [user, setUser] = React.useState({});
    const [image, setImage] = React.useState(null);

    React.useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
        setUser(user);
        setImage(auth.currentUser.photoURL ? auth.currentUser.photoURL : "https://www.gravatar.com/avatar/" + md5(auth.currentUser.email) + "?s=128")
    }, []);

    const toggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    }

    const { logout, getProfileImage } = React.useContext(AuthContext);
    // get image from async storage


    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <View style={styles.userInfoSection}>
                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                            <Avatar.Image
                                /* gravatar via email address of user */
                                source={{
                                    uri: image
                                }}
                                size={50}
                            />
                            <View style={{ marginLeft: 15, flexDirection: "column" }}>
                                <Title style={styles.title}>
                                    {user.displayName}
                                </Title>
                                <Caption style={styles.caption}>
                                    {user.email}
                                </Caption>
                                <Caption style={styles.caption}>
                                    {user.phoneNumber}
                                </Caption>
                            </View>
                        </View>
                        <View style={styles.row}>
                            <View style={styles.section}>
                                <Paragraph style={[styles.paragraph, styles.caption]}>80</Paragraph>
                                <Caption style={styles.caption}>Contacts</Caption>
                            </View>
                        </View>
                    </View>
                    <Drawer.Section style={styles.drawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="home-outline" color={color} size={size} />
                            )}
                            label="Home"
                            onPress={() => props.navigation.navigate("Home")}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="account-check-outline" color={color} size={size} />
                            )}
                            label="Contacts"
                            onPress={() => props.navigation.navigate("Contacts")}
                        />
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="cog-outline" color={color} size={size} />
                            )}
                            label="Settings"
                            onPress={() => props.navigation.navigate("Settings")}
                        />
                    </Drawer.Section>
                    <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => { toggleTheme() }}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={isDarkTheme}
                                        color="#3f51b5"
                                    />
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>


                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem
                    label="Logout"
                    icon={({ color, size }) => (
                        <Icon name="exit-to-app" color={color} size={size} />
                    )}
                    onPress={() => { logout() }}
                />
            </Drawer.Section>
        </View>
    );
}


const styles = StyleSheet.create({
    drawerContent: {
        flex: 1
    },
    userInfoSection: {
        paddingLeft: 20
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: "bold"
    },

    caption: {
        fontSize: 14,
        lineHeight: 14
    },
    row: {
        marginTop: 20,
        flexDirection: "row",
        alignItems: "center"
    },
    section: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15
    },
    paragraph: {
        fontWeight: "bold",
        marginRight: 3
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: "#f4f4f4",
        borderTopWidth: 1,
    },
    preference: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: 16
    }
});