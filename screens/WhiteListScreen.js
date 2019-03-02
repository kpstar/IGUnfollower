import React, { Component } from 'react';
import { FlatList } from 'react-native';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { Container, Toolbar, View, ViewCenter, Text, IconButton } from '../components/commons';
import UserComponent from '../components/UserComponent';
import { Banner, InterShow } from '../components/Ads';
import { API } from '../constances';
import { SignterData } from '../utils';

class WhiteListScreen extends Component {
  constructor(props) {
    super(props); 
    this.onUnFollow = this.onUnFollow.bind(this);
  }
  async onUnFollow(pk) {
    try {
      await axios.post(API.UNFOLLOW(pk), SignterData({ user_id: pk }));
      await this.FilterList(pk);
      // InterShow();
    } catch (error) {
      alert(error.message);
    }
  }
  render() {
    return (
      <Container>
        <Toolbar
          back={() => this.props.navigation.goBack()}
          title={`WhiteList ( ${this.props.users.length} )`}
        >
          <IconButton name='md-trash' onPress={() => this.props.clearHistroy()} />
        </Toolbar>
        {/* <Banner /> */}
        { this.props.users.length > 0 ?
          <View style={[{ flex: 1 }, { marginBottom: 8 }]}>
            <FlatList
              style={{ marginBottom: 8 }}
              data={this.props.users}
              keyExtractor={user => user.pk.toString()}
              renderItem={({ item }) => (
                <UserComponent 
                  pk={item.pk}
                  fullName={item.full_name}
                  username={item.username}
                  avatar={item.profile_pic_url}
                  VisableUnFollow
                  onUnFollow={this.onUnFollow}
                />
              )
              }
            />
          </View>
          :
          <ViewCenter style={{ flex: 1 }}>
            <Text style={{ fontSize: 19 }}>No Users</Text>
          </ViewCenter> 
        }   
      </Container>
    );
  }
}

export default connect(({ history }) => ({ ...history }), actions)(WhiteListScreen);
