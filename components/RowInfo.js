import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Avatar, Text } from './commons';
import User from '../utils/User';

export const WrapText = (props) => (
  <View flexDirection='row'>
    <Text style={styles.txtBold}>
      {`${props.name} : `}
    </Text>
    <Text style={styles.center}>
      {props.number}
    </Text>
  </View>
);
export default () => (
  <View style={styles.row}>
    <View>
      <Avatar source={{ uri: User.LoginInfo.profile_pic_url }} />
      <Text style={styles.name}>{User.LoginInfo.username}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <WrapText name='Following' number={User.LoginInfo.following_count} />
        <WrapText name='Followers' number={User.LoginInfo.follower_count} />
        <WrapText name='Posts' number={User.LoginInfo.media_count} />
      </View>
      <View style={styles.line} />
    </View>
  </View>
);

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
