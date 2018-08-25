import React from 'react';
import { 
  Accelerometer,
  Modal,
  Vibration,
  TextInput,
  Animated,
  StyleSheet, 
  Text, 
  View,
  AsyncStorage,
  Image,
  Picker,
  Button,
  TouchableWithoutFeedback,
  Dimensions,
  Keyboard,
  TouchableOpacity
} from 'react-native';

import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
  LinearGradient
} from 'expo';

import Style from './Style';
import InputButton from './InputButton';
import InputButtonFat from './InputButtonFat';
import ClearInputButton from './ClearInputButton';
import ratesPacket from './rates';
import currencyPacket from './currency';
import swapImg from './swap.png';

const { width: WindowWidth } = Dimensions.get('window');

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.inputRefs = {};
    
    this.state = {
      modalAnimatedValue: new Animated.Value(0),
      modalIsVisible: false,
      previousInputValue: 0,
      selectedSymbol: " ",
      language:'',
      base:'hello',
      map: 'placeholder',
      latitude: "0",
      longitude: "0",
      rate: "0",
      initializing: "true",
      fromCountryCurrencyName:'Thai Baht',
      fromCountryName: 'Thailand',
      fromCountryCurrency: 'THB',
      fromCountryCode: 'TH', 
      fromValue: "",
      fromSymbol: '',
      toCountryCurrencyName: 'United States dollar',
      toCountryName: 'United States',
      toCountryCode: 'US',
      toCountryCurrency: 'USD',
      toSymbol:"$",
      toValue: "1",
      located: "false",
      display: 'hi',
      ratePackage:"",
      offlineMode:false,
      allCountryCodes:"",
      backup:'',
      currencyPacket:currencyPacket,
      currentLocation:'',
      selected:'from',
      bitcoin:0,
      countryPacket:{},
      list:'🏡'
    };
  }


  getCurrentPosition = (options = {}) => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  loadPosition = async () => {
    try {
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      this.setState({
        latitude: latitude,
        longitude: longitude
      });
       this.createMap()
       this.coordToCountry()
    } catch (error) {

    }
  };

  componentDidMount(){

  };

  componentWillMount(){
    this.bitCoin();
    this.updateCurrencyPacket();

    if (!AsyncStorage.getItem('toCountry')) {
      this.toCountryCurrency = 'USD'
    } else {
      this.toCountryCurrency = AsyncStorage.getItem('toCountry')
    }
  };

  async createMap() {
    let that = this
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + that.state.latitude + "," + that.state.longitude + "&result_type=country&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"
    // let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=37.4224764,-122.0842499&result_type=country&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"
    await fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      that.setState({
        fromCountryName: data.results[0].address_components[0].long_name,
        fromCountryCode: data.results[0].address_components[0].short_name,
        currentLocation: data.results[0].address_components[0].short_name
      })
    }).catch(function(){
    })
  };

  pickRandomProperty(obj) {
    var result;
    var count = 0;
    for (var prop in obj)
      if (Math.random() < 1 / ++count)
        result = prop;
    return result;
  }

  offlineMode(){
    let that = this
    that.setState({
      offlineMode: true
    })
  };

  async updateCurrencyPacket() {
    let that = this
    let rates = "https://openexchangerates.org/api/latest.json?app_id=9c7cb94c795045bcbd7acd369010b544"

    await fetch(rates)
      .then((resp) => resp.json())
      .then(function (data) {
        that.setState({
        currencyPacket: data,
        })
      }).catch(function () {
        that.offlineMode()
      })
      await this.loadPosition()
  }

  async countryFromCountryCode(country) {
    let that = this
    let countries = "https://maps.googleapis.com/maps/api/geocode/json?latlng=37.4224764,-122.0842499&result_type=country&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"

    await fetch(countries)
    .then((resp) => resp.json())
    .then(function (data) {
        if(that.state.toCountryCode === 'BTN'){
        }
      that.setState({ 
        toCountryEmoji: ratesPacket.results[that.state.toCountryCode].emoji,
        toCountryCurrency: ratesPacket.results[that.state.toCountryCode].currencyId,
        toCountryCurrencyName: ratesPacket.results[that.state.toCountryCode].currencyName,
        toSymbol: ratesPacket.results[that.state.toCountryCode].currencySymbol,
        fromCountryCurrency: ratesPacket.results[that.state.fromCountryCode].currencyId,
        fromCountryEmoji: ratesPacket.results[that.state.fromCountryCode].emoji,
        fromCountryCurrencyName: ratesPacket.results[that.state.fromCountryCode].currencyName,
        fromSymbol: ratesPacket.results[that.state.fromCountryCode].currencySymbol,
        offlineMode:false
      })
        that.countryToRate()
      })
  };

  coordToCountry() {
    this.setState({
      map: "https://maps.googleapis.com/maps/api/staticmap?center=" + this.state.latitude + "," + this.state.longitude + "&zoom=10&size=350x800&sensor=false&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:administrative.country%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0x64779e&style=feature:administrative.province%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0x334e87&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0x023e58&style=feature:poi%7Celement:geometry%7Ccolor:0x283d6a&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x6f9ba5&style=feature:poi%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0x023e58&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x3C7680&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:road%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:road.highway%7Celement:geometry%7Ccolor:0x2c6675&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x255763&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xb0d5ce&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0x023e58&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:transit%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:transit.line%7Celement:geometry.fill%7Ccolor:0x283d6a&style=feature:transit.station%7Celement:geometry%7Ccolor:0x3a4762&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x4e6d70&size=480x360"
    })
    this.countryFromCountryCode()
  };

  countryToRate(...args) {
    let that = this
    let from = that.state.fromCountryCurrency
    let to = that.state.toCountryCurrency
    let convert = this.state.currencyPacket
    let d = new Date(convert.timestamp * 1000)

    function hour(i){
      if(i < 13){
        return i + " AM"
      }else{
        return i-12 + " PM"
      }
      
    }
    let stamp = hour(d.getHours()) + " " + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear() + " " + "PST"

    that.setState({
      rate: convert.rates[that.state.fromCountryCurrency] / convert.rates[that.state.toCountryCurrency],
      backup: stamp
    })
    that.popFromValue()
  };

  changePosition(country){
    let whichMode = this.state.whichModal
    if(country === 'CRL'){
      this.setState({
        [whichMode]:this.state.currentLocation
      })
    this.countryFromCountryCode()

    } else if(country === 'BTN'){
      // this.bitCoin()
      this.setState({
        [whichMode]:100
      })
      this.countryFromCountryCode(country)
    } 
    else {
      this.countryFromCountryCode(country)
    }
  };

  async bitCoin(){
    let that = this
    let url = 'https://api.coindesk.com/v1/bpi/currentprice/USD.json'

    fetch(url)
      .then((resp) => resp.json())
      .then(function (data) {
        let rate = data.bpi["USD"].rate_float
        that.setState({
          bitCoin: rate
        })
      })
  }

  swapCountry = () => {
    let that = this
    let placeholder = this.state.toCountryCode
    this.setState({
      toCountryCode: this.state.fromCountryCode,
      fromCountryCode: placeholder,
      toValue: 1
    })
    this.countryFromCountryCode()
  }

  popFromValue() {
    let toValue = 1
    let newValue = this.state.toValue * this.state.rate
    this.setState({
      fromValue:newValue.toFixed(2),
      toValue: toValue.toFixed(2)
    })
  };
  toMath(x) {
    let newValue =  this.state.rate * x
    let toValue = x.toFixed(2)
    this.setState({
      toValue:  toValue,
      fromValue: newValue.toFixed(2),
    })
  };
  fromMath(x) {
    let newValue = x / this.state.rate
    this.setState({
      toValue: newValue.toFixed(2),
      fromValue: x.toFixed(2)
    })
  };

  countryEmoji(x){
    if (!this.state[x]) {
      return " "
    } else {
      return this.state[x]
    }
  };

  // HANDLEPRESS /\
  ////////////////\
  _handlePressDone = (x) => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        modalIsVisible: false
      });
    });
    if(x === 'CRL'){
      this.changePosition('CRL')
    }else{
      this.changePosition(this.state[this.state.whichModal])
    }
    // this.from.focus();
  };

  _handlePressOpenTo = () => {
    if (this.state.modalIsVisible) {
      return;
    }
    this.setState({
      modalIsVisible: true,
      whichModal:'toCountryCode'
    }, () => {
      Animated.timing(this.state.modalAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  _handlePressOpenFrom = () => {
    if (this.state.modalIsVisible) {
      return;
    }
    this.setState({
      modalIsVisible: true,
      whichModal: 'fromCountryCode'
    }, () => {
      Animated.timing(this.state.modalAnimatedValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };
  expand = () => {
    if(this.state.list === '🏡'){
      this.setState({
        list:'🌍'
      })
    }else{
      this.setState({
        list:'🏡'
      })
    }
  };
  list = () => {
    let whichMode = this.state.whichModal
    this.setState({
      [whichMode]:'CRL'
    })
    // this.changePosition(this.state[this.state.whichModal])
    this._handlePressDone('CRL')
  };

  calculator(x){
    let calculation = x
    alert(calculation)
  }

  touchFrom = () => {
    this.setState({
      selected:'from'
    })
  }

  touchTo = () => {
    this.setState({
      selected:'to'
    })
  }

  render() {

    return (
      <View style={Style.container} >
        <Image
          id="map"
          style={{ 
            backgroundColor: '#ccc',
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: 800,
            justifyContent: 'center',
          }}
          source={{ uri: this.state.map }}
          blurRadius={1.4}
        />

        <LinearGradient 
          start = {[0.1, 0.1]}
          colors = {['rgba(11, 131, 254, .5)', '#3713AE']}
          style={Style.sentence}
        >

          { /* FROM CURRENCY */ }
          <View style={Style.inputs}>
            <TouchableOpacity
              style={{justifyContent:'space-around', alignItems:'center',flexDirection:'row', width:'90%'}}
            >
              <Text
              adjustsFontSizeToFit={true}
              numberOfLines={1}
              minimumFontScale={0.01}
                style={[this.state.selected === 'from'? Style.from : Style.to, Style.adjust]}
                onPress={this.touchFrom}
              >
              {this.state.fromSymbol ? this.state.fromSymbol:'$'}{" " + this.state.fromValue }
              </Text>
              <Text style={{fontSize:48,fontWeight:'bold',color:'white'}}>{this.state.selectedSymbol}</Text>
            </TouchableOpacity>
            <Text style={Style.bold}>
              <Text>
              <TouchableOpacity style={Style.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenFrom}>
              <View style={Style.location}>
                <Text style={Style.subtext}>
                  {this.countryEmoji('fromCountryEmoji') + " " + this.state.fromCountryCurrencyName}
                </Text>
              </View>
              </TouchableOpacity>
              </Text>
            </Text>
          </View>  
          
        { /* TO CURRENCY */ }
          <View style={Style.inputs}>
          <TouchableOpacity>
          <Text
            adjustsFontSizeToFit={true}
            numberOfLines={1}
            minimumFontScale={0.01}
            style={this.state.selected === 'to'? Style.from : Style.to}
            onPress={this.touchTo}
          >
            {this.state.toSymbol ? this.state.toSymbol:'$'}{" " + this.state.toValue}
          </Text>
        </TouchableOpacity>
            <Text style={Style.bold}>
              <Text>
              <TouchableOpacity style={Style.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenTo}>
              <View style={Style.location}>
                <Text style={Style.subtext}>
                  {this.countryEmoji('toCountryEmoji')? this.countryEmoji('toCountryEmoji') : null}{" " + this.state.toCountryCurrencyName}
                </Text>
              </View>
              </TouchableOpacity>
              </Text>
            </Text>
          </View>
          {/* UPDATE */}
          <Text style={{color:'#fff5',textAlign:'center',alignSelf:'center'}}>{this.state.backup}</Text>

            <View style={Style.calculatorPanel}>
              <View >
              {this._renderInputButtons()}
              </View>
            </View>

        </LinearGradient>

      {this._maybeRenderModal()}
      </View>
    );
  }

  _renderInputButtons() {
    let views = [];
    let inputButtons = [
      [1, 2, 3, '/'],
      [4, 5, 6, '*'],
      [7, 8, 9, '-'],
      ['←', 0, '=', '+']
    ]

    for (var r = 0; r < inputButtons.length; r++) {
      let row = inputButtons[r];

      let inputRow = [];
      for (var i = 0; i < row.length; i++) {
        let input = row[i];
        if(input === '/'){
          inputRow.push(
          <ClearInputButton 
            style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
            value={input} 
            key={r + "-" + i} 
            highlight={this.state.selectedSymbol === input}
            onPress={this._onInputButtonPressed.bind(this, input)}
          />
          );
        }
        else if(input === '+'){
            inputRow.push(
            <ClearInputButton 
              style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
              value={input} 
              key={r + "-" + i} 
              highlight={this.state.selectedSymbol === input}
              onPress={this._onInputButtonPressed.bind(this, input)}
            />
          );
        } 
        else if(input === '*'){
          inputRow.push(
          <ClearInputButton 
            style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
            value={input} 
            key={r + "-" + i} 
            highlight={this.state.selectedSymbol === input}
            onPress={this._onInputButtonPressed.bind(this, input)}
          />
        );
        
      }
      else if(input === '-'){
        inputRow.push(
        <ClearInputButton 
          style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
          value={input} 
          key={r + "-" + i} 
          highlight={this.state.selectedSymbol === input}
          onPress={this._onInputButtonPressed.bind(this, input)}
        />
      );
    }
    else if(input === '='){
      inputRow.push(
        <InputButtonFat 
          style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
          value={input} 
          key={r + "-" + i} 
          highlight={this.state.selectedSymbol === input}
          onPress={this._onInputButtonPressed.bind(this, input)}
        />
      );
    }
    else if(input === '←'){
      inputRow.push(
      <InputButtonFat 
        style={[Style.keypadClear, this.props.highlight ? Style.inputButtonHighlighted : null]}
        value={input} 
        key={r + "-" + i} 
        highlight={this.state.selectedSymbol === input}
        onPress={this._onInputButtonPressed.bind(this, input)}
      />
    );
    }else if(typeof input === "number"){  
      inputRow.push(
        <InputButton 
          style={[Style.keypad, this.props.highlight ? Style.inputButtonHighlighted : null]}
          value={input} 
          key={r + "-" + i} 
          highlight={this.state.selectedSymbol === input}
          onPress={this._onInputButtonPressed.bind(this, input)}
        />
      );
    }
    }

      views.push(<View style={Style.calculator} key={"row-" + r}>{inputRow}</View>)
    }

    return views;
  }
  _onInputButtonPressed(input) {
    alert(input)
  }
  _onInputButtonPressed(input) {
    switch (typeof input) {
        case 'number':
            return this._handleNumberInput(input)
        case 'string':
            return this._handleStringInput(input)
    }
}
async _handleStringInput(str) {
  switch (str) {
    case '/':
    case '*':
    case '+':
    case '-':
      selectedValue = this.state.selected + "Value"

      this.setState({
          selectedSymbol: str,
          previousInputValue: this.state[this.state.selected+"Value"],
          [selectedValue]: 0
      });
      break;
    case '=':
      let symbol = this.state.selectedSymbol,
          inputValue = this.state.inputValue,
          selectedValue = this.state[this.state.selected + "Value"],
          previousInputValue = this.state.previousInputValue,
          evaluation = eval(previousInputValue + symbol + selectedValue)

      if(this.state.selected === 'to'){
        this.toMath(evaluation)
      }else if(this.state.selected === 'from'){
        this.fromMath(evaluation)
      }

      if (!symbol) {
          return;
      }
      this.setState({
          // [this.state.selected+"Value"]: eval(previousInputValue + symbol + selectedValue),
          previousInputValue: 0,
          selectedSymbol: null
      });
      break;
    case '←':

      let selected = this.state.selected+"Value"
      let string = this.state[this.state.selected+"Value"]
      let minus = string.toString().slice(0,-1)
      let num = parseInt(minus)

      if(!num){
        num = 0
      }

      if(this.state.selected === 'to'){
        this.toMath(num)
      }else if(this.state.selected === 'from'){
        this.fromMath(num)
      }

      this.setState({
        selectedSymbol: null,
        [selected]: num,
      })
      
      break;  
  }
}

_handleNumberInput(num) {
    let selected = this.state.selected+"Value"
    let inputValue = (this.state[selected] * 10) + num;
    
    if(selected === 'toValue'){
      this.toMath(inputValue)
    } else if(selected === 'fromValue'){
      this.fromMath(inputValue)
    }
}
 _maybeRenderModal = () => {
    if (!this.state.modalIsVisible) {
      return null;
    }
    let options = ratesPacket
    let whichMode = this.state.whichModal
    const { modalAnimatedValue } = this.state;
    const opacity = modalAnimatedValue;
    const translateY = modalAnimatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [300, 0],
    });
    
    return (
      <View
        style={StyleSheet.absoluteFill}
        pointerEvents={this.state.modalIsVisible ? 'auto' : 'none'}>
        <TouchableWithoutFeedback onPress={this._handlePressDone}>
          <Animated.View style={[Style.overlay, { opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: [{ translateY }],
          }}>
          <View style={Style.toolbar}>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={Style.list} onPress={this.list}> <Text style={Style.listText}>📍</Text></TouchableOpacity>
                <TouchableOpacity style={Style.list} onPress={this.expand}> <Text style={Style.listText}>{this.state.list}</Text></TouchableOpacity>
              </View>
            <Button style={{alignSelf:'flex-end'}}  title="Done" onPress={this._handlePressDone} />
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#fff' }}
            selectedValue={this.state[whichMode]}
            onValueChange={itemValue => this.setState({ [whichMode]: itemValue })}>
            {Object.keys(ratesPacket.results).sort().map((key) => {
              let packet = ratesPacket.results[key]
              let name = packet.emoji ? packet.name + " " + packet.emoji : packet.name
              if(this.state.list === '🏡'){
                return (<Picker.Item label={name} value={key} key={key}/>)
              }
              
            })}
            <Picker.Item label="Mexico 🇲🇽" value="MX" />
            <Picker.Item label="Sweden 🇸🇪" value="SE" />
            <Picker.Item label="France 🇫🇷" value="FR" />
            <Picker.Item label="Germany 🇩🇪" value="DE" />
            <Picker.Item label="Australia 🇦🇺" value="AU" />
            <Picker.Item label="United Kingdom 🇬🇧" value="GB" />
            <Picker.Item label="Canadian Dollar 🇨🇦" value="CA" />
            <Picker.Item label="Thailand 🇹🇭" value="TH" />
            <Picker.Item label="Lao PDR 🇱🇦" value="LA" />
            <Picker.Item label="Vietnam 🇻🇳" value="VN" />
            <Picker.Item label="Indonesia 🇮🇩" value="ID" />
            <Picker.Item label="Japan 🇯🇵" value="JP" />
          </Picker>
        </Animated.View>
      </View>
    );
  };
}