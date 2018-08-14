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
                underlayColor="#193441"
                onPress={this.props.onPress}>                
                <Text style={Style.num}>{this.props.value}</Text>
            </TouchableHighlight>
        )
    }
}

    // case '←':
    // string = this.state.inputValue.toString().slice(0,-1)
    // console.log( this.state.selectedSymbol + " " + this.state.previousInputValue + " " + this.state.inputValue);
    //   this.setState({
    //     selectedSymbol: str,
    //     inputValue: string
    //   })
    //   break;