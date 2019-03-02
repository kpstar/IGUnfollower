import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '.';
import { Colors } from '../../constances';

export const IconButton = (props) => (
  <TouchableOpacity style={styles.buttonIcon} onPress={props.onPress}>
    <Icon
      name={props.name} color={props.color ? props.color : 'white'} size={props.size ? 
        props.size : 24}
    />
  </TouchableOpacity>
);

export const Button = (props) => {
  const color = props.border ? Colors.PrimaryColor : 'white';
  const notChildren = (
    props.icon ? (<Icon name={props.icon} size={15} color={color} />) :
      <Text style={{ color }}>{props.title}</Text>);
  return (
    <TouchableOpacity
      disabled={props.disabled}
      activeOpacity={0.8}
      style={[styles.button,
        props.border ? 
          { borderColor: Colors.PrimaryColor,
            borderWidth: 1,
          } :
          { backgroundColor: Colors.PrimaryColor }, props.style, 
      ]} onPress={props.onPress}
    >
    
      {!props.children ? notChildren : props.children}
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 20, 
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginHorizontal: 12,
  },
});
