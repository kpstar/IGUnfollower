import React from 'react';
// import { Platform } from 'react-native';
import { createDrawerNavigator } from 'react-navigation';
import styled from 'styled-components/native';
import HomeScreen from '../screens/HomeScreen';
import { Icon, Text } from '../components/commons';
import CustomDrawer from './CustomDrawer';

const CTxt = styled(Text)`
  color:${props => props.color};
  padding:10px 0px;
`;
export default createDrawerNavigator({
  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ({ tintColor }) => <CTxt color={tintColor}>Home</CTxt>,
      drawerIcon: ({ tintColor }) =>
        (<Icon
          color={tintColor}
          size={24} 
          name="md-home"
        />),
    },
  },
  
  RateUs: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ({ tintColor }) => <CTxt color={tintColor}>Rate Us </CTxt>,
      drawerIcon: ({ tintColor }) =>
        (<Icon
          color={tintColor}
          size={24} 
          name="md-star"
        />),
    },
  },

  Logout: {
    screen: HomeScreen,
    navigationOptions: {
      drawerLabel: ({ tintColor }) => <CTxt color={tintColor}>Logout</CTxt>,
      drawerIcon: ({ tintColor }) =>
        (<Icon
          color={tintColor}
          size={24} 
          name="ios-log-out"
        />),
    },
  },
}, {
  activeTintColor: 'white',
  contentComponent: CustomDrawer,
  // drawerPosition: Platform.OS === 'android' ? 'right' : 'left',
});
