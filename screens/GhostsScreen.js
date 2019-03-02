import React, { Component } from 'react';
import { FlatList, View, Button } from 'react-native';
import axios from 'axios';
import * as Progress from 'react-native-progress';
import PopupDialog, { SlideAnimation } from 'react-native-popup-dialog';
import UserComponent from '../components/UserComponent';
import { ViewCenter, Toolbar, Text, Container } from '../components/commons';
import { Colors, API } from '../constances';
import User from '../utils/User';
import { SignterData } from '../utils';

class GhostsScreen extends Component {
  constructor(props) {
    super(props);
    this.popupAnimation = new SlideAnimation({ slideFrom: 'bottom' });
    this.Type = this.props.navigation.state.params.TypeList;
    this.subscription = this.props.navigation.state.params.subscription;
    this.onUnFollow = this.onUnFollow.bind(this);
    this.unFollowFromBottom = this.unFollowFromBottom.bind(this);
    this.unFollowFromTop = this.unFollowFromTop.bind(this);
    this.onLove = this.onLove.bind(this);
    this.state = {
      percent: 0,
      ListUsers: [],
      currentUser: null,
    };
  }

  componentDidMount() {
    if (!(User.ListGousts.length > 0) && !(User.ListActive.length > 0)) {
      this.fetchMedia();
      return;
    }
    // if alerdy fetching 
    this.setList();
  }
  async onUnFollow(pk) {
    try {
      console.log('====================================');
      console.log(pk);
      console.log('====================================');
      const data = await axios.post(API.UNFOLLOW(pk), SignterData({ user_id: pk }));
      await this.FilterList(pk);
      console.log('====================================');
      console.log(data);
      console.log('====================================');
    } catch (error) {
      console.log(error.response);
      alert(error.message);
    }
  }
  onLove(pk) {
    this.state.ListUsers[this.state.ListUsers.findIndex((u) => u.pk === pk)].love = true;
  }
  setList() {
    if (this.Type === 'Ghosts') {
      this.setState({ ListUsers: User.ListGousts });
    } else if (this.Type === 'Active') {
      this.setState({ ListUsers: User.ListActive });
    }
  }
  
  async FilterList(pk) {
    return new Promise((resolve) => {
      const ListUsers = User.ListGousts.filter((u) => u.pk !== pk);
      User.ListGousts = ListUsers;
      this.setState({ ListUsers }, () => {
        resolve();
      });
    });
  }
  async fetchMedia() {
    try {
      this.popupDialog.show();
      const mediaRes = await axios.get(API.GET_MEDIA(User.LoginInfo.pk));
      console.log(mediaRes);
      User.ListMedia = mediaRes.data.items;
      const lists = [];
      const items = mediaRes.data.items.slice(0, 10);
      for (let i = 0; i < items.length; i++) {
        const id = items[i].id;
        this.setState({ percent: (i / 10) * 100 });
        const res = await axios.get(API.GET_MEDIA_LIKER(id));
        res.data.users.forEach(user => {
          const index = lists.findIndex((u) => u.pk === user.pk);
          if (index > -1) {
            // if exsits
            lists[index].count++;
          } else {
            lists.push({ count: 1, ...user });
          }
        });
      }
      lists.sort((a, b) => parseFloat(a.count) - parseFloat(b.count)).reverse();
      User.ListFollowers.forEach((user) => {
        if (!(lists.findIndex((u) => u.pk === user.pk) > 1)) {
          // not exists 
          User.ListGousts.push(user);
        }
      });
      User.ListActive = lists.slice(0, 100);
      this.setList();
      console.log(lists);
    } catch (error) {
      console.log(error.response);
    }
    this.popupDialog.dismiss();
  }
  
  async unFollowFromTop() {
    let subscription = this.subscription;
    if (subscription == 'mini') {
      this.props.navigation.navigate('Purchase', {subscription});
      return;
    }
    this.popupDialog.show();
    const list = this.state.ListUsers.filter((u) => !u.love).splice(0, 15);
    console.log(list);
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
    this.openReviewIos();
  }
 
  async unFollowFromBottom() {
    let subscription = this.subscription;
    if (subscription == 'mini') {
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
            formatText={() => `${Math.floor(this.state.percent)}%`}
            size={120}
            progress={this.state.percent / 100}
            color={Colors.SecanderyColor}
            borderWidth={3}
            direction="counter-clockwise"
          />
          {this.state.currentUser && 
          <Text style={{ fontWeight: 'bold', color: Colors.SecanderyColor, marginTop: 10 }} >
            {this.state.currentUser}
          </Text>}
        </ViewCenter>
      </PopupDialog>
    );
    return (
      <Container>
        <Toolbar 
          back={() => this.props.navigation.goBack()}
          title={`${this.Type} ( ${this.state.ListUsers.length} )`}
        />
        { this.state.ListUsers.length > 0 ?
          <View style={{ flex: 1 }}>
            <FlatList
              data={this.state.ListUsers}
              keyExtractor={user => user.pk.toString()}
              renderItem={({ item }) => (
                <UserComponent 
                  pk={item.pk}
                  fullName={item.full_name}
                  username={item.username}
                  avatar={item.profile_pic_url}
                  VisableUnFollow={this.Type === 'Ghosts'}
                  onUnFollow={this.onUnFollow}            
                  onLove={this.onLove}
                  onFollow={this.onFollow}
                  countLove={this.Type === 'Active' && item.count}
                />
              )
              }
            />
            {this.Type === 'Ghosts' &&
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

export default GhostsScreen;
