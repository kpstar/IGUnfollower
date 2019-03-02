import React, { Component } from 'react';
import { FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import { Container, Toolbar, View, ViewCenter, Text } from '../components/commons';
import UserComponent from '../components/UserComponent';
import User from '../utils/User';
import { API, Colors } from '../constances';
import { SignterData } from '../utils';
import { Banner, InterShow } from '../components/Ads';

class UsersScreen extends Component {
  constructor(props) {
    super(props);

    this.popupAnimation = new SlideAnimation({ slideFrom: 'bottom' });    
    this.TypeList = this.props.navigation.state.params.TypeList;
    this.subscription = this.props.navigation.state.params.subscription;
    let DisableUnfollow = true;
    switch (this.TypeList) {
      case 'ListFollowing':
        this.Title = 'Following';
        DisableUnfollow = false;        
        break;
      case 'ListUnFollower':
        this.Title = 'UnFollowers';
        DisableUnfollow = false;
        break;
      case 'ListFans':
        this.Title = 'Fans';
        break;
      default:
        break;
    }
    
    this.onUnFollow = this.onUnFollow.bind(this);
    this.onFollow = this.onFollow.bind(this);
    this.unFollowFromTop = this.unFollowFromTop.bind(this);
    this.unFollowFromBottom = this.unFollowFromBottom.bind(this);
    this.onLove = this.onLove.bind(this);
    
    this.state = {
      ListUsers: User[this.TypeList],
      percent: 0,
      currentUser: '',
      DisableUnfollow,
    };
  }

  async onUnFollow(pk) {
    try {
      await axios.post(API.UNFOLLOW(pk), SignterData({ user_id: pk }));
      await this.FilterList(pk);
    } catch (error) {
      alert(error.message);
    }
  }

  async onFollow(pk) {
    try {
      await axios.post(API.FOLLOW(pk), SignterData({ user_id: pk }));
      await this.FilterList(pk);
      if (this.subscription == 'none') {
        InterShow();
      }
    } catch (error) {
      console.log(error.response);
      alert(error.message);
    }
  }
 
  onLove(pk) {
    this.state.ListUsers[this.state.ListUsers.findIndex((u) => u.pk === pk)].love = true;
    console.log('====================================');
    console.log('on love');
    console.log('====================================');
    console.log(this.state.ListUsers);
  }
  async FilterList(pk) {
    return new Promise((resolve) => {
      const ListUsers = User[this.TypeList].filter((u) => u.pk !== pk);
      User[this.TypeList] = ListUsers;
      this.setState({ ListUsers }, () => {
        resolve();
      });
    });
  }
  async unFollowFromTop() {
    let subscription = this.subscription;
    if (subscription == 'mini' || subscription == 'none') {
      subscription = 'mini';
      this.props.navigation.navigate('Purchase', {subscription});
      return;
    }
    this.popupDialog.show();
    const list = this.state.ListUsers.filter((u) => !u.love).splice(0, 15);
    for (let i = 0; i < list.length; i++) {
      const user = list[i];
      try {
        this.setState({ percent: (i + 1) / list.length, currentUser: user.username });
        await this.onUnFollow(user.pk);
      } catch (error) {
        console.log(error);        
      } 
    }
    this.popupDialog.dismiss();
    if (this.subscription == 'none') {
      InterShow();
    }
  }
 
  async unFollowFromBottom() {
    let subscription = this.subscription;
    if (subscription == 'mini' || subscription == 'none') {
      subscription = 'mini';
      this.props.navigation.navigate('Purchase', {subscription});
      return;
    }
    this.popupDialog.show();
    const list = this.state.ListUsers.reverse().filter((u) => !u.love).splice(0, 15);
    for (let i = 0; i < list.length; i++) {
      const user = list[i];
      try {
        this.setState({ percent: (i + 1) / list.length, currentUser: user.username });
        await this.onUnFollow(user.pk);
      } catch (error) {
        console.log(error);        
      } 
    }
    this.popupDialog.dismiss();
    if (this.state.subscription == 'none') {
      InterShow();
    }
  }
 
  render() {
    const renderProgress = (
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
        width={0.9}
        height={0.35}
        dismissOnTouchOutside={false}
        dialogAnimation={this.popupAnimation}
      >
        <ViewCenter style={{ flex: 1 }}>
          <Progress.Circle
            thickness={5}
            showsText
            formatText={() => `${Math.floor(this.state.percent * 100)}%`}
            size={120}
            progress={this.state.percent}
            color={Colors.SecanderyColor}
            borderWidth={3}
            direction="counter-clockwise"
          />
          <Text style={{ fontWeight: 'bold', color: Colors.SecanderyColor, marginTop: 10 }} >
            {this.state.currentUser}
          </Text>
        </ViewCenter>
      </PopupDialog>
    );
    return (
      <Container>
        <Toolbar
          back={() => this.props.navigation.goBack()}
          title={`${this.Title} ( ${this.state.ListUsers.length} )`}
        />
        <View style={this.subscription == 'none'?styles.banner:styles.bannerNone}>
          <Banner />        
        </View>
        { this.state.ListUsers.length > 0 ?
          <View style={[{ flex: 1 }, !this.state.DisableUnfollow && { marginBottom: 8 }]}>
            <FlatList
              style={!this.state.DisableUnfollow && { marginBottom: 8 }}
              data={this.state.ListUsers}
              keyExtractor={user => user.pk.toString()}
              renderItem={({ item }) => (
                <UserComponent 
                  pk={item.pk}
                  fullName={item.full_name}
                  username={item.username}
                  avatar={item.profile_pic_url}
                  onUnFollow={this.onUnFollow}
                  onFollow={this.onFollow}
                  VisableUnFollow={!this.state.DisableUnfollow}
                  onLove={this.onLove}
                />
              )
              }
            />
            {!this.state.DisableUnfollow && 
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <Button onPress={this.unFollowFromTop} title='Unfollow 15 from Top List' />
            </View>
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Button onPress={this.unFollowFromBottom} title='Unfollow 15 from Bottom' />
            </View>
          </View>
            }
          </View>
          :
          <ViewCenter style={{ flex: 1 }}>
            <Text style={{ fontSize: 19 }}>No Users</Text>
          </ViewCenter> 
        }   
        {renderProgress}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  banner: {
  },
  bannerNone: {
    display: 'none'
  }
});

export default UsersScreen;
