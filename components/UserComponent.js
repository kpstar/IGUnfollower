/* eslint-disable camelcase */
import React, { Component } from 'react';
import { StyleSheet, ActivityIndicator, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';

import { View, Text, Button, Avatar, IconButton } from './commons';

class UserComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      love: false,
    };
    this.onLove = this.onLove.bind(this);
    this.onUnFollow = this.onUnFollow.bind(this);
    this.onFollow = this.onFollow.bind(this);
  }
  componentWillMount() {
    const { pk, onLove } = this.props;
    const isInHistroy = this.props.checkInFav(pk);
    this.setState({ love: isInHistroy });
    if (isInHistroy) {
      if (onLove) {
        onLove(pk);
      }
    }
  }
  onLove() {
    const { pk, fullName, username, avatar } = this.props;
    this.props.addToFavs({ pk, full_name: fullName, username, profile_pic_url: avatar });
    this.setState({ love: !this.state.love }, () => {
      this.props.onLove(pk);
    });
  }
  onUnFollow() {
    this.setState({ loading: true }, () => {
      this.props.onUnFollow(this.props.pk);
    });
  }
  onFollow() {
    this.setState({ loading: true }, () => {
      this.props.onFollow(this.props.pk);
    });
  }
  render() {
    const { love, loading } = this.state;
    const ButtonFollow = ( 
      !loading ?
        (<Button
          onPress={this.onUnFollow}
          icon='md-close' border
        />)
        :
        (<Button>
          <ActivityIndicator size='small' />
        </Button>)
    );
    const genrateFollow = (
      this.props.VisableUnFollow || this.state.loading) ? ButtonFollow :
      (<Button
        onPress={this.onFollow}
        title='Follow'
      />);
    return (
      <View style={styles.wrapp}>
        <View style={styles.flexRow}>
          {this.props.VisableUnFollow && <IconButton
            onPress={this.onLove} 
            name={love ? 'md-heart' : 'md-heart-outline'} 
            size={28} color='#C71C5E'
          />}
          <Avatar style={{ width: 50, height: 50, borderRadius: Platform.OS === 'ios' ? 25 : 100 }} source={{ uri: this.props.avatar }} />
          <View style={{ marginHorizontal: 20 }}>
            <Text style={[styles.fullName]}>{this.props.fullName.toString().trim()}</Text>
            <Text>{this.props.username}</Text>
          </View>
        </View>
        {
          !this.props.countLove ? genrateFollow :
            <View style={{ 
              position: 'relative',
            }}
            >
              <Icon
                name='md-heart' size={50} color={'#C71C5E'}
              />
              <Text style={styles.centerTxt}>{this.props.countLove}</Text>
            </View>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centerTxt: {
    color: 'white',
    height: '100%',
    width: '100%',
    lineHeight: 45,
    textAlign: 'center',
    position: 'absolute', 
  },
  flexRow: { 
    flex: 1,
    alignItems: 'center', 
    flexDirection: 'row',
  },
  fullName: {
    fontWeight: 'bold', 
  },
  wrapp: {
    backgroundColor: '#fafafa',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomColor: '#eee',
    borderBottomWidth: 2,
    elevation: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default connect(undefined, actions)(UserComponent);
