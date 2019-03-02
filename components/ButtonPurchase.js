import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from './commons';

export default (props) => (
  <TouchableOpacity onPress={props.onPress} style={styles.wrapp}>
    <Text style={styles.title}>{props.title}</Text>
    <Text style={styles.desc}>{props.desc}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  title: { fontWeight: 'bold', marginBottom: 3, color: '#0000FF', textAlign: 'center' },
  desc: { textAlign: 'center', fontWeight: 'bold', color:'#0000FF', marginBottom: 3 },
  wrapp: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2f1ef',
    borderRadius: 10,
    borderColor: '#b9b9b0',
    borderWidth: 2,
  },
});
