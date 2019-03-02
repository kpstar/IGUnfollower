import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet, TouchableOpacity } from 'react-native';

class Checkbox extends Component {
  constructor(props) {
    super(props);
    this.onCheck = this.onCheck.bind(this);
  }

  onCheck() {
    this.props.onCheck(this.props.id);
  }
  render() {
    return (// check 
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={this.onCheck} style={[styles.container,
          { backgroundColor: this.props.check ? '#228AE6' : 'white' }]}
      >
        {this.props.check && <Icon 
          name='check' size={20} color='white'
        />}
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
    position: 'absolute',
    top: -5,
    right: -5,
    width: 25,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
});
export default Checkbox;
