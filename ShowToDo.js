import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput, ScrollView, Alert } from 'react-native';
import {theme} from './colors';

export default function ShowToDo(props) {


    return (
        <Text style={props.completed ? styles.completedText : styles.toDoText}>{props.text}</Text>
    );
}

const styles = StyleSheet.create({
    toDoText:{
      color:"white",
      fontSize:24,
      fontWeight:"500"
    },
    completedText: {
        color:"white",
        fontSize:24,
        fontWeight:"500",
        textDecorationLine: "line-through",
    }
  });