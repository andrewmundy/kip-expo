import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Style from './Style';

export default class ClearInputButton extends Component {
    
    render() {
        return (
            <TouchableHighlight
                style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
                underlayColor="#999"
                onPress={this.props.onPress}>                
                <Text style={Style.numOp}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }
}