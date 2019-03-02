import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { View, Text } from '.';
import { Colors } from '../../constances';
import { IconButton } from './buttons';

export const Toolbar = (props) => (
  <View style={styles.toolbar}>
    {
      props.back ?
        <TouchableOpacity onPress={!props.backComponent && props.back} style={styles.row}>
          {props.backComponent || <IconButton onPress={props.back} name='ios-arrow-back' />}
          <Text style={styles.title}>{props.title}</Text>
        </TouchableOpacity>
        : <View style={styles.row}>
          <Text style={styles.title}>{props.title}</Text>
        </View>
    }
    
    <View style={styles.row}>
      {props.children}
    </View>
  </View> 
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  toolbar: {
    paddingTop: 30,
    height: 70,
    backgroundColor: Colors.PrimaryColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5, 
    flexDirection: 'row',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
  },
});

