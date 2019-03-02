import React, { Fragment, Component } from 'react';
import { TextInput, View, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Toolbar, Button, Avatar, Text } from '../components/commons';
import { Colors, API } from '../constances';
import { WrapText } from '../components/RowInfo';

class FollowersNumber extends Component {
    state = { t: '', user: null, loading: false }
    componentWillMount() {
      this.search = this.search.bind(this);
    }
    async search() {
      const username = this.state.t;
      console.log(username);
      if (username) {
        this.setState({ loading: true });
        const { data } = await axios.get(API.ACCOUNTS_SEARCH(username.trim()));
        console.log(data);
        if (data.users.length) {
          const resInfo = await axios.post(API.USER_INFO(data.users[0].pk));
          console.log(resInfo);
          this.setState({ loading: false, user: resInfo.data.user });
        } else {
          alert('not user found with this username ');
          this.setState({ loading: false, user: null });
        }
      }
    }
    render() {
      const { user } = this.state;
      return (
        <Fragment>
          <Toolbar
            back={() => this.props.navigation.goBack()}
            title={'Number followers'}
          />
          <View >
            <TextInput
              autoFocus
              underlineColorAndroid='transparent'
              style={{ backgroundColor: 'white', padding: 10, borderWidth: 1, borderColor: '#f1f1f1' }}
              onSubmitEditing={this.search}
              placeholder='type username here ..'
              onChangeText={(t) => this.setState({ t: t.trim() })}
            />
            <Button
              onPress={this.search}
              title='Search' disabled={!this.state.t} 
              color={Colors.SecanderyColor}
            />
          </View>
          {!this.state.loading ? 
            user && 
           <View marginHorizontal={10} marginTop={20} style={styles.row}>
             <View>
               <Avatar source={{ uri: user.profile_pic_url }} />
               <Text style={styles.name}>{user.username}</Text>
             </View>
             <View style={{ flex: 1 }}>
               <View style={styles.container}>
                 <WrapText name='Following' number={user.following_count} />
                 <WrapText name='Followers' number={user.follower_count} />
                 <WrapText name='Posts' number={user.media_count} />
               </View>
             </View>
           </View>
            :
            <View flex={1} alignItems='center' justifyContent='center'>
              <ActivityIndicator size='large' />
            </View>
          }
        </Fragment>
      );
    }
}

const styles = StyleSheet.create({
  line: { 
    height: 1,
    marginHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,.93)', 
  },
  name: {
    alignSelf: 'center',
    marginTop: 8,
  },
  container: {
    // flexDirection: 'row',
    marginLeft: 20,
    flex: 1,
    justifyContent: 'space-evenly', 
    // alignItems: 'space-around',
  },
  txtBold: {
    fontWeight: 'bold',
  },
  center: {
    marginLeft: 5,
    textAlign: 'center',
  },
  row: { flexDirection: 'row' },
});

export default FollowersNumber;
