import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Style from './Style';

export default class InputButtonFat extends Component {
    
    render() {
        return (
            <TouchableHighlight 
                style={[Style.keypadFat, this.props.highlight ? Style.inputButtonHighlighted : null]}
                underlayColor="#193441"
                onPress={this.props.onPress}>                
                <Text style={Style.numOp}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }
}