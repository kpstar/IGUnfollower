import React, { Component, Fragment } from 'react';
import { Image, ScrollView, Dimensions, StyleSheet,
  TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Toolbar, View, ViewCenter } from '../components/commons';
import { API, Colors } from '../constances';
import User from '../utils/User';
import Checkbox from '../components/Checkbox';
import { SignterData } from '../utils';

const WidthPoster = (Dimensions.get('window').width / 2) - 13; 

class PostsScreen extends Component {
  state={
    loading: true,
    items: [],
    selected: [],
  }  
  async componentWillMount() {
    this.onCheck = this.onCheck.bind(this);
    this.deletePosts = this.deletePosts.bind(this);
    try {
      let maxId = '';        
      while (true) {
        const mediaRes = await axios.get(API.GET_MEDIA(User.LoginInfo.pk, maxId));
        User.ListMedia.push(...mediaRes.data.items); 
        console.log(mediaRes);                   
        if (!mediaRes.data.more_available) {
          break;
        } else {
          maxId = mediaRes.data.next_max_id;
        }
      }
    } catch (error) {
      console.log(error.response);          
    }
    
    this.setState({ loading: false, items: User.ListMedia });
  }
  onCheck(id) {
    const { selected } = this.state;
    const exsist = selected.includes(id);
    console.log(selected);
    if (exsist) {
      // if exstis (true) then remove it 
      this.setState({ selected: selected.filter((d) => d !== id) });
    } else {
      // if not exsits then add to array 
      this.setState({ selected: selected.concat(id) });
    }
  }
  async deletePosts() {
    for (const mediaId of this.state.selected) {
      try {
        await axios.post(API.MEDIA_DELETE(mediaId), SignterData({ media_id: mediaId }));
        User.ListMedia = User.ListMedia.filter((m) => m.id !== mediaId);
        this.setState({   
          items: User.ListMedia, 
          selected: this.state.selected.filter((d) => d !== mediaId) });
      } catch (error) {
        console.log(error.response);
      }
    }
  }
  render() {
    return (
      <Fragment>
        <Toolbar 
          back={() => this.props.navigation.goBack()}
          title={`Posts ( ${this.state.items.length} )`}
        />
        {!this.state.loading ?
          <Fragment>
            <ScrollView>
              <View style={styles.box}>
                {
                  this.state.items.map((media) => (
                    <TouchableOpacity
                      key={media.id}
                      activeOpacity={0.8} 
                      onPress={() => this.onCheck(media.id)}
                      style={styles.margin}
                    >
                      <Checkbox
                        onCheck={this.onCheck} id={media.id} 
                        check={this.state.selected.includes(media.id)}
                      />
                      <Image
                        style={styles.image}
                        source={{ uri: media.image_versions2.candidates[0].url }}
                      />
                    </TouchableOpacity>))
                }
              </View>
            </ScrollView>
            <View style={{ marginTop: 10, marginHorizontal: 3 }}>
              <Button
                color='#d9534f'
                disabled={this.state.selected.length <= 0}
                onPress={this.deletePosts} 
                title={`Delete ${this.state.selected.length}`}
              />
            </View>
        
          </Fragment>
          :
          <ViewCenter style={{ flex: 1, backgroundColor: 'white' }} >
            <ActivityIndicator color={Colors.SecanderyColor} size='large' />
          </ViewCenter>
        }
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  margin: { margin: 5 },
  box: { 
    margin: 3,
    backgroundColor: 'white',
    flexDirection: 'row',
    flexWrap: 'wrap', 
  },
  image: { 
    width: WidthPoster,
    height: 200,
    borderTopRightRadius: 13,
  },
});
export default PostsScreen;
