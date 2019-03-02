import React, { Component } from 'react';
import { ScrollView, Image, TouchableOpacity, AsyncStorage, Platform, Linking, StyleSheet } from 'react-native';
import { SafeAreaView, StackActions, NavigationActions } from 'react-navigation';
import * as StoreReview from 'react-native-store-review';
import Axios from 'axios';
import { ViewCenter, Text, View, Icon } from '../components/commons';
import { Colors, API } from '../constances';
import { clearList } from '../screens/HomeScreen';
import { SignterData } from '.';

class CustomDrawer extends Component {
  componentWillMount() {
    this.rateUs = this.rateUs.bind(this);
    this.LogOut = this.LogOut.bind(this);
    this.followUs = this.followUs.bind(this);
  }
  async LogOut() {
    clearList();
    await AsyncStorage.removeItem('acc');
    this.props.navigation.dispatch(StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Login' }),
      ],
    }));
  }
  rateUs() {
    Linking.openURL("https://itunes.apple.com/US/app/id1372903274");
  }
  followUs() {
    Linking.openURL("https://www.instagram.com/s4app/");
  }
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
          <ViewCenter marginVertical={10}>
            <Image
              style={{ width: 100, height: 100 }}
              source={require('../assets/images/logo.png')}
            />
            <Text style={{ fontSize: 20 }}>
                     UnFollowers
            </Text>
          </ViewCenter>
          <View>
            <TouchableOpacity style={[styles.item, { backgroundColor: Colors.SecanderyColor }]}>
              <Icon size={24} name='md-home' />
              <Text style={{ marginLeft: 10, color: 'white' }}>Home</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={this.rateUs} style={styles.item}>
              <Icon size={24} color={'black'} name='md-star' />
              <Text style={{ marginLeft: 10 }}>Rate Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.followUs} style={styles.item}>
              <Icon size={24} color={'black'} name='logo-instagram' />
              <Text style={{ marginLeft: 10 }}>Follow Us</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.LogOut} style={styles.item}>
              <Icon size={24} color={'black'} name='ios-log-out' />
              <Text style={{ marginLeft: 10 }}>Logout</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView> 
    );
  }
}

export default CustomDrawer;

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', padding: 10, marginBottom: 10 },
});
