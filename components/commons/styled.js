import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

export const Text = styled.Text`
    font-family: ${() => (Platform.OS === 'ios' ? 'OpenSans-Regular' : 'OpenSans')};
    color:#808080;
    font-size:16;
`;

export const Container = styled.View`
    flex:1;
    background-color:white;
`;

export const ViewCenter = styled.View`
   justify-content: center;
   align-items:center;
`;

export const Avatar = styled.Image.attrs(
  { borderRadius: Platform.OS === 'ios' ? 40 : 100 }
)`
    width:80px;
    height:80px;
`;

export const Icon = (props) => <Ionicons color={props.color || 'white'} {...props} />;
