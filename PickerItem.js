import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import Style from './Style';

export default class PickerItem extends Component {
    
    render() {
        return (
            <Picker.Item label="United States 🇺🇸" value="US">
            </Picker.Item>
        )
    }
}