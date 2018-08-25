import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Style from './Style';

export default class InputButton extends Component {
    
    render() {
        return (
            <TouchableHighlight 
                style={[Style.keypad, this.props.highlight ? Style.inputButtonHighlighted : null]}
                underlayColor="#fff9"
                onPress={this.props.onPress}>                
                <Text style={Style.num}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }
}