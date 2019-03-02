/*  eslint-disable camelcase, no-constant-condition */
import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import * as Progress from 'react-native-progress'; 
import { View, Container, Text, Toolbar, ViewCenter } from '../components/commons';
import { IconButton } from '../components/commons/buttons';
import RowInfo from '../components/RowInfo';
import ButtonContainer from '../components/ButtonContainer';
import User from '../utils/User';
import Purchase from '../components/Purchase';
import { API, Colors } from '../constances';
import { Banner } from '../components/Ads';

export const clearList = () => {
  User.ListFollowers = [];
  User.ListFollowing = [];
  User.ListUnFollower = [];
  User.ListFans = [];
  User.ListGousts = [];
  User.ListActive = [];
  User.ListMedia = [];
};
class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.popupAnimation = new SlideAnimation({ slideFrom: 'bottom' });
    this.onReload = this.onReload.bind(this);
    this.state = {
      percent: 0,
      subscription: 'full'
    };
  }
  async componentDidMount() {
    this.getFollowerList();
    this.getItemList();
  }
 
  onReload() {
    clearList();
    this.popupDialog.show();
    this.setState({ percent: 0 }, () => {
      this.getFollowerList();
      this.getItemList();
    });
  }
  async getItemList() {
      const subscription = await Purchase.getCurrentSubscription();
      this.setState({subscription});
  }
  async getFollowerList() {
    let max_id = '';  
    let percent = 0;
    const { follower_count, following_count, pk } = User.LoginInfo;
    const total = (follower_count + following_count) - 1;
    try {      
      while (true) {
        const res = await axios.get(`${API.FOLLOWERS(pk)}?max_id=${max_id}`);
        User.ListFollowers.push(...res.data.users);
        percent = (User.ListFollowers.length / total) * 100;
        max_id = res.data.next_max_id;        
        this.setState({ percent: Math.floor(percent) });
        if (!res.data.next_max_id || follower_count > User.ListFollowers) {
          break;
        }
      }
      max_id = '';
      while (true) {
        const res = await axios.get(`${API.FOLLLOWING(pk)}?max_id=${max_id}`);
        User.ListFollowing.push(...res.data.users);
        percent = ((User.ListFollowers.length + User.ListFollowing.length) / total) * 100;
        this.setState({ percent: Math.floor(percent) });
        if (!res.data.next_max_id || following_count > User.ListFollowing) {
          break;
        }
        max_id = res.data.next_max_id;
      }
      this.setState({ percent: 100 });
      await this.perpareLists();
      this.popupDialog.dismiss();
    } catch (error) {
      alert(error.message);      
    }
  }

  perpareLists() {
    return new Promise((res) => {
      // get unfollowers 
      User.ListFollowing.forEach(user => {
        if (!(User.ListFollowers.findIndex((u) => u.pk === user.pk) > -1)) {
          User.ListUnFollower.push(user);
        }
      });

      // get fans 
      User.ListFollowers.forEach(user => {
        if (!(User.ListFollowing.findIndex((u) => u.pk === user.pk) > -1)) {
          User.ListFans.push(user);
        }
      });
      res();
    });  
  }

  gotoNextSteps = (route, choice) => {
    let {subscription} = this.state;
    if (subscription == 'none') {
      this.props.navigation.navigate('Purchase');
      return;
    }
    this.props.navigation.navigate(route, {TypeList: choice});
  }

  render() {
    const {subscription} = this.state;
    const renderProgress = (
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        width={0.9}
        height={0.35}
        show
        dialogAnimation={this.popupAnimation}
        dismissOnTouchOutside={false}
      >
        <ViewCenter style={{ flex: 1 }}>
          <Progress.Circle
            thickness={5}
            showsText
            formatText={() => `${this.state.percent}%`}
            size={120}
            progress={this.state.percent / 100}
            color={Colors.SecanderyColor}
            borderWidth={3}
            direction="counter-clockwise"
          />
          <Text style={{ fontWeight: 'bold', color: Colors.SecanderyColor, marginTop: 10 }} >
            Please Wait..
          </Text>
        </ViewCenter>
      </PopupDialog>
    );
    return (
      <Container>
        <Toolbar
          title='UnFollowers'
          back
          backComponent={<IconButton onPress={() => this.props.navigation.toggleDrawer()} name='md-menu' />}
        >
        <IconButton name='md-sync' onPress={this.onReload} />
        </Toolbar>
        <View style={this.state.subscription == 'none'?styles.banner:styles.bannerNone}>
          <Banner />        
        </View>
        <View style={styles.container}>
          <RowInfo />          
          <ScrollView style={{ marginTop: 30 }}>
            <ButtonContainer 
              onPress={() => this.props.navigation.navigate('Users', { TypeList: 'ListUnFollower', subscription })}
              title='Non-Followers'
              desc={'people who dont\' follow back'}
            />
            <ButtonContainer
              onPress={
                this.gotoNextSteps.bind(this, 'Ghosts', 'Ghosts')
              }            
              title='Ghosts'
              desc="followers who aren't left any comment or like under last 10 publications"
            />
            <ButtonContainer 
              onPress={
                this.gotoNextSteps.bind(this, 'Ghosts', 'Active')
              }                        
              title='Active Followers'
              desc='top followers who active with last 10 publications'
            />
            <ButtonContainer 
              onPress={this.gotoNextSteps.bind(this, 'Users', 'ListFans')}            
              title='Fans'
              desc='users who follow you but are not followed back by you'
            />
            <ButtonContainer
              onPress={this.gotoNextSteps.bind(this, 'Users', 'ListFollowing')}             
              title='Mutual Followers'
              desc='Everyone who you follow '
            />
            
            <ButtonContainer
              onPress={this.gotoNextSteps.bind(this, 'Tools')}             
              title='Tools ..'
              desc='More tools that help to management your account'
            />
          </ScrollView>
        </View>
        {renderProgress}

      </Container> 
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  banner: {
  },
  bannerNone: {
    display: 'none'
  }
});
export default HomeScreen;
