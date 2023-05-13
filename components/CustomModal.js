import { View, Text, Modal, TouchableOpacity, TextInput } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const CustomModal = ({ modalVisible, onDismiss, children }) => {
    return (

        <Modal
            animationType="slide"
            transparent={true}
            style={{ flex: 1 }}
            visible={modalVisible} onRequestClose={() => onDismiss()}
        >
            <TouchableOpacity
                onPress={() => onDismiss()}
                style={{ backgroundColor: '#00000030', flex: 1 }}
            />
            <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: '#00000030' }}>
                    <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 24, paddingVertical: 24 }}>
                        {children}
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </Modal>
    );
};

export default CustomModal;