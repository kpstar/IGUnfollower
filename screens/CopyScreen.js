import React, { Component, Fragment } from 'react';
import { Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

import { Container, Toolbar, View, ViewCenter, Avatar, IconButton, Button } from '../components/commons';
import { Banner, InterShow } from '../components/Ads';
import { Input } from './LoginScreen';
import { Colors, API } from '../constances';
import UserComponent from '../components/UserComponent';
import { SignterData } from '../utils';
import User from '../utils/User';

const CountDownMin = 60 * 5;
const LIMIT = 50;

class CopyScreen extends Component {
    state = { username: '',
      loading: false,
      users: [], 
      count: CountDownMin,
      following: false,
      complete: false,
      user: { friendship_status: { is_private: false } } }
      
    componentDidMount() {
      this.cancelFollowing = this.cancelFollowing.bind(this);
      this.Follow50 = this.Follow50.bind(this);
      this.onFollow = this.onFollow.bind(this);
      this._onSearch = this._onSearch.bind(this);
      // this.setState({ username: 'saads' }, () => this._onSearch());
    }
    async componentWillUnmount() {
      if (this.state.complete) {
        clearInterval(this.interval);
      }
    }
     
    async onFollow(pk) {
      try {
        await axios.post(API.FOLLOW(pk), SignterData({ user_id: pk }));
        await this.FilterList(pk);
      } catch (error) {
        console.log(error.response);
      }
    }

    startCountDown() {
      this.interval = setInterval(() => {
        const d = new Date();
        if (!this.oldDate) {
          this.oldDate = d;
          return;
        }
        if (this.oldDate && this.oldDate.getTime() + (15 * 60 * 1000) < d.getTime()) {
          this.oldDate = d;
        } else {
          let count = Math.floor((d.getTime() - this.oldDate.getTime()) / 1000); 
          count = (count - CountDownMin) * -1;
          console.log(count);
          if (count < 1) {
            this.setState({ complete: false });
            clearInterval(this.interval);
          } else {
            console.log(count);
            this.setState({ count });
          } 
        }
      }, 1000);
    }
    async Follow50() {
      const { users } = this.state;
      this.setState({ following: true }, async () => {
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (!this.state.following || i === LIMIT) {
            if (i === LIMIT) {
              alert('Please wait 5 minutes to avoid Instagram blocking');
              this.setState({ complete: true });
              this.startCountDown();
            }
            break;
          }
          try {
            await this.onFollow(user.pk);
            console.log(user);
          } catch (error) {
            console.log(error);
          }
        }
        // InterShow();

        this.setState({ following: false });
      });
    }

    cancelFollowing() {
      this.setState({ following: false });
    }
    async FilterList(pk) {
      return new Promise((resolve) => {
        const ListUsers = this.state.users.filter((u) => u.pk !== pk);
        this.setState({ users: ListUsers }, () => {
          resolve();
        });
      });
    }
    async _onSearch() {
      const { username } = this.state;
      if (username.trim().length < 2) {
        return;
      } 
      this.setState({ loading: true });
      try {
        const { data } = await axios.get(API.ACCOUNTS_SEARCH(username.trim()));
        const res = await axios.get(API.FOLLOWERS(data.users[0].pk));
        // console.log(res.data.users);
        const users = [];
        res.data.users.forEach(element => {
          if (!(User.ListFollowing.findIndex((e) => element.pk === e.pk) > -1)) {
            users.push(element);
          }
        });
        // console.log(users);
        this.setState({ user: data.users[0], users });
      } catch (error) {
        console.log(error);
      }
      this.setState({ loading: false });
    }
    formatTime(count) {
      return `${Math.floor(count / 60)}:${Math.floor(count % 60)}`;
    }
    render() {
      const renderButtons = (
        !this.state.following ?
          (<Button
            disabled={this.state.complete}
            onPress={this.Follow50} title={!this.state.complete ? '50 Following' : 
              `${this.formatTime(this.state.count)}`} style={[{ borderRadius: 0 },
              this.state.complete && { backgroundColor: Colors.SecanderyColor }]}
          />) :
          <Button onPress={this.cancelFollowing} style={{ backgroundColor: '#888888', borderRadius: 0 }} title={'Cancel'} />
      );
      const renderList = (
        this.state.users.length ? 
          (
            <View> 
              <View
                flexDirection='row' style={styles.wrapp}
              >
                <Avatar style={styles.avatar} source={{ uri: this.state.user.profile_pic_url }} />
                <View flexDirection='row' style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 3, marginHorizontal: 20 }}>
                    <Text style={[styles.fullName]}>{this.state.user.full_name.toString().trim()}</Text>
                    <Text>{this.state.user.username}</Text>
                  </View>
                  <Text style={{ color: Colors.SecanderyColor, fontWeight: 'bold', flex: 1 }}>
                    {this.state.user.byline}
                  </Text>
                </View>
              </View>
              <FlatList
                data={this.state.users}
                keyExtractor={user => user.pk.toString()}
                renderItem={({ item }) => (
                  <UserComponent 
                    pk={item.pk}
                    fullName={item.full_name}
                    username={item.username}
                    avatar={item.profile_pic_url}
                    VisableUnFollow={false}
                    onFollow={this.onFollow}                    
                    countLove={false}
                  />
                )
                }
              />
            </View>)
          :
          (
            <ViewCenter flex={1}>
              <Text style={{ fontSize: 18 }}>{this.state.user.friendship_status.is_private ? 
                `${this.state.user.username} Account is Private` : 'Not Found User'}</Text>
            </ViewCenter>
          )
      );
      return (
        <Container >
          <Toolbar 
            back={() => this.props.navigation.goBack()}
            title={'Copy Followers'}
          />
          {/* <Banner /> */}
          
          <View style={{ margin: 16, flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}> 
              <Input
                style={{ flex: 1, fontSize: 18 }}  
                placeholder='Search Instagram Username'
                onChangeText={(t) => { this.setState({ username: t }); }}   
                returnKeyType='search' 
                onSubmitEditing={this._onSearch}
                value={this.state.username}
              />
              {this.state.username.trim().length > 2 &&
              <IconButton
                onPress={() => this.setState({ username: '' })}
                color='#000' style={{ position: 'absolute', right: 10 }} name='ios-close' size={40}
              />
              }
            </View> 
            {this.state.loading ?
              <ViewCenter flex={1}>
                <ActivityIndicator color={Colors.SecanderyColor} size='large' />
              </ViewCenter> 
              :
              <Fragment>
                { renderList }
              </Fragment>
            }
        
          </View>
          {this.state.users.length ? (
            renderButtons
          ) : <View />}
            
        </Container>
      );
    }
}

const styles = StyleSheet.create({
  wrapp: { 
    borderBottomColor: Colors.SecanderyColor,
    borderBottomWidth: 1,
    paddingBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  fullName: {
    fontWeight: 'bold', 
  },
});
export default CopyScreen;
