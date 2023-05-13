import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../components/context'
import * as Animatable from 'react-native-animatable';

const HomeScreen = () => {

  const { loginState } = useContext(AuthContext);
  return (
    <Animatable.View
      animation="fadeInUpBig"
    >
      <Text>
        {loginState.email}
      </Text>
      <Text>
        {loginState.name}
      </Text>
    </Animatable.View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})