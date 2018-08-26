import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

class TitleText extends React.Component {
    render() {
      return (
        <Text style={{ fontSize: 48, color: 'white' }}>
          {this.props.label}
        </Text>
      )
    }
  }
  