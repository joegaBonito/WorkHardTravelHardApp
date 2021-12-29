import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity,TextInput, ScrollView, Alert } from 'react-native';
import {theme} from './colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo,AntDesign,Feather } from '@expo/vector-icons';
import ShowToDo from './ShowToDo';
import EditToDo from './EditToDo';

const STORAGE_KEY = "@toDos";
const STORAGE_KEY_WORKING = "@working";


export default function App() {
const [working,setWorking] = useState();
const [text,setText] = useState("");
const [edittext,setEdittext] = useState("");
const [completed,setCompleted] = useState(false);
const [editing,setEditing] = useState(false);
const [toDos,setToDos] = useState({});

useEffect(()=>{
  loadWorking();
  loadToDos();
},[]);

const travel = async() => {await saveWorking(false); setWorking(false); };
const work = async() => {await saveWorking(true); setWorking(true); };
const onChangeText = (payload) => setText(payload);
const onChangeEditText = (payload) => setEdittext(payload);

const saveWorking = async (boolval) => {
  await AsyncStorage.removeItem(STORAGE_KEY_WORKING);
  await AsyncStorage.setItem(STORAGE_KEY_WORKING,JSON.stringify(boolval));
  console.log('AsyncStorage?.getItem(STORAGE_KEY_WORKING): ' + await AsyncStorage?.getItem(STORAGE_KEY_WORKING));
}

const loadWorking = async () => { 
  try{
    const s = await AsyncStorage?.getItem(STORAGE_KEY_WORKING);
    console.log('AsyncStorage?.getItem(STORAGE_KEY_WORKING): ' + JSON.parse(s));
    setWorking(JSON.parse(s?.toLowerCase()));
  } catch(e) {
    console.log(e);
  }
}

const saveToDos = async (toSave) => {
 await AsyncStorage.setItem(STORAGE_KEY,JSON.stringify(toSave));
}

const loadToDos = async () => {
  try{
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  } catch(e) {
    console.log(e);
  }
}

const editToDos = async (key) => {
  // Change Edit todo state to true.
  const newToDos = {
    ...toDos,
  };
  if(newToDos[key].editing === false) {
    newToDos[key].editing = true;
  } else {
    newToDos[key].editing = false;
    newToDos[key].text = edittext;
    console.log('edittext: ' + newToDos[key].text);
  }
  //Save todo
  setToDos(newToDos);
  await saveToDos(newToDos);
};

const completedToDos = async (key) => {
      const newToDos = {
        ...toDos,
      };
      if(newToDos[key].completed === true) {
        newToDos[key].completed = false;
        console.log('newToDos after completed checked: ' + newToDos[key].completed);
      } else {
        newToDos[key].completed = true;
        console.log('newToDos after completed checked: ' + newToDos[key].completed);
      }
      //Save todo
      setToDos(newToDos);
      await saveToDos(newToDos);
};

const deleteToDos = async (key) => {
  Alert.alert("Delete To DO","Are you sure?",[
    {text:"Cancel",style:"destructive"},
    {text:"I'm Sure", onPress: async () => {
      console.log(key);
      const newToDos = {
        ...toDos
      };
      delete newToDos[key];
      //Save todo
      setToDos(newToDos);
      await saveToDos(newToDos);
    }}
  ]);
};

const addToDo = async ()=> {
  if(text ==="") {
    return;
  }
  // const newToDos = Object.assign({},toDos,{
  //   [Date.now()]:{text,work:working}
  // });

  const newToDos = {
    ...toDos,
    [Date.now()]:{text,working,completed,editing},
  };

  //Save todo
  setToDos(newToDos);
  // console.log(toDos);
  await saveToDos(newToDos);
  setText("");
}

  return (
    <View style={styles.container}>
      <StatusBar style="auto"/>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}><Text style={{...styles.btnText, color: working ? "white" : theme.grey }}>Work</Text></TouchableOpacity>
        <TouchableOpacity onPress={travel}><Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text></TouchableOpacity>
      </View>
      <TextInput onSubmitEditing={addToDo} returnKeyType="done" style={styles.input} placeholder={working ? "Add a To Do" : "Where do you want to go?"} placeholderTextColor={"grey"} value={text} onChangeText={onChangeText}></TextInput>
      <ScrollView>
        {Object.keys(toDos).map((key)=> {
          console.log('toDos[key]: ' + toDos[key].text);
          return toDos[key].working === working ? 
          (
          <View style={styles.toDo} key={key}>
            {toDos[key].editing ? <EditToDo onChangeEditText={onChangeEditText} edittext={edittext} placeholdertext={toDos[key].text}></EditToDo> : <ShowToDo text={toDos[key].text} completed={toDos[key].completed}></ShowToDo>}
            <View style={styles.touchableToDo}>
              <TouchableOpacity onPress={()=>editToDos(key)} style={styles.touchableOp}><Feather name="edit" size={24} color={ theme.grey}/></TouchableOpacity>
              <TouchableOpacity onPress={()=>completedToDos(key)} style={styles.touchableOp}><AntDesign name="checksquare" size={24} color={ toDos[key].completed ? theme.white : theme.grey}/></TouchableOpacity>
              <TouchableOpacity onPress={()=>deleteToDos(key)}><Entypo name="trash" size={24} color={theme.grey} /></TouchableOpacity>
            </View>
          </View>) : null
          })
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header: {justifyContent:"space-between",
    flexDirection:"row",
    marginTop:100,
  },
  btnText:{
    fontSize:38,
    fontWeight:"600"
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:20,
    fontSize:18,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingLeft:40,
    paddingRight:20,
    borderRadius:15,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
  },
  toDoText:{
    color:"white",
    fontSize:24,
    fontWeight:"500"
  },
  touchableToDo: {
    backgroundColor:theme.toDoBg,
    flexDirection:"row",
    alignItems:"stretch",
    justifyContent:"space-between",
  },
  touchableOp:{
    paddingRight:10
  }
});
