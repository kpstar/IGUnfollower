import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './commons';

export default (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.wrapp}>
    <Text style={styles.title}>{props.title}</Text>
    <Text>{props.desc}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', marginBottom: 3, color: '#141414' },
  desc: {},
  wrapp: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f1ef',
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderColor: '#b9b9b0',
    borderWidth: 2,
  },
});
