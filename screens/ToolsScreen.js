import React, { Component } from 'react';
import { Toolbar, Container, View } from '../components/commons';
// import { Banner } from '../components/Ads';
import ButtonContainer from '../components/ButtonContainer';

class ToolsScreen extends Component {
    state = { }
    render() {
      return (
        <Container>
          <Toolbar
            back={() => this.props.navigation.goBack()}
            title='Tools'
          />
          {/* <Banner /> */}
          <View paddingHorizontal={16} justifyContent='center' flex={1}>
            <ButtonContainer
              onPress={() => this.props.navigation.navigate('WhiteList')}            
              title='WhiteList'
              desc="People you do'nt want to unfollow"
            />
            <ButtonContainer 
              onPress={() => this.props.navigation.navigate('Copy')}
              title='Copy Followers'
              desc='Follow followers of other users'
            />
            <ButtonContainer
              onPress={() => this.props.navigation.navigate('Posts')}             
              title='Delete Posts'
              desc='delete multiple posts in your profile'
            />
            <ButtonContainer
              onPress={() => this.props.navigation.navigate('FollowerNumber')}             
              title='Number Followers'
              desc='get real number followers or following for user '
            />
          </View>
        </Container>
      );
    }
}

export default ToolsScreen;
