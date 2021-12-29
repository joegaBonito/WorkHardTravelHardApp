import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput, ScrollView, Alert } from 'react-native';
import {theme} from './colors';

export default function EditToDo(props) {
    return (
        <TextInput
        style={styles.input}
        onChangeText={props.onChangeEditText}
        value={props.edittext}
        placeholder={props.placeholdertext}
      />
    );
}

const styles = StyleSheet.create({
    input:{
        flex:1,
        backgroundColor:"white",
        borderRadius:30,
        paddingVertical:5,
        marginRight:5,
        marginVertical:20,
        fontSize:18,
      },
    toDoText:{
      color:"white",
      fontSize:24,
      fontWeight:"500"
    },
  });