import React from 'react';
import { 
  Animated,
  StyleSheet, 
  Text, 
  View,
  AsyncStorage,
  Image,
  Picker,
  FlatList,
  TextInput,
  ImageBackground,
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
  AdMobRewarded
} from 'expo';

import { LinearGradient } from 'expo';
import ratesPacket from './rates.js';
import currencyPacket from './currency.js';
import swapImg from './swap.png';

const { width: WindowWidth } = Dimensions.get('window');

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.inputRefs = {};
    
    this.state = {
      modalAnimatedValue: new Animated.Value(0),
      modalIsVisible: false,
      language:'',
      base:'hello',
      map: 'placeholder',
      latitude: "0",
      longitude: "0",
      rate: "0",
      initializing: "true",
      fromCountryCurrencyName:'',
      fromCountryCurrency: 'USD',
      fromCountryName: '',
      fromCountryCode: 'US', 
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
      currentLocation:''
    }
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
      console.log(error);
    }
  };
  componentDidMount(){
    this.from.focus();
  };

  componentWillMount(){
    this.updateCurrencyPacket()

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
      console.log(data.results[0].address_components[0].short_name)
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
      map: "https://maps.googleapis.com/maps/api/staticmap?center=" + this.state.latitude + "," + this.state.longitude + "&zoom=10&size=350x450&sensor=false&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE&format=png&maptype=roadmap&style=element:geometry%7Ccolor:0x1d2c4d&style=element:labels.text.fill%7Ccolor:0x8ec3b9&style=element:labels.text.stroke%7Ccolor:0x1a3646&style=feature:administrative.country%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:administrative.land_parcel%7Celement:labels.text.fill%7Ccolor:0x64779e&style=feature:administrative.province%7Celement:geometry.stroke%7Ccolor:0x4b6878&style=feature:landscape.man_made%7Celement:geometry.stroke%7Ccolor:0x334e87&style=feature:landscape.natural%7Celement:geometry%7Ccolor:0x023e58&style=feature:poi%7Celement:geometry%7Ccolor:0x283d6a&style=feature:poi%7Celement:labels.text.fill%7Ccolor:0x6f9ba5&style=feature:poi%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:poi.park%7Celement:geometry.fill%7Ccolor:0x023e58&style=feature:poi.park%7Celement:labels.text.fill%7Ccolor:0x3C7680&style=feature:road%7Celement:geometry%7Ccolor:0x304a7d&style=feature:road%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:road%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:road.highway%7Celement:geometry%7Ccolor:0x2c6675&style=feature:road.highway%7Celement:geometry.stroke%7Ccolor:0x255763&style=feature:road.highway%7Celement:labels.text.fill%7Ccolor:0xb0d5ce&style=feature:road.highway%7Celement:labels.text.stroke%7Ccolor:0x023e58&style=feature:transit%7Celement:labels.text.fill%7Ccolor:0x98a5be&style=feature:transit%7Celement:labels.text.stroke%7Ccolor:0x1d2c4d&style=feature:transit.line%7Celement:geometry.fill%7Ccolor:0x283d6a&style=feature:transit.station%7Celement:geometry%7Ccolor:0x3a4762&style=feature:water%7Celement:geometry%7Ccolor:0x0e1626&style=feature:water%7Celement:labels.text.fill%7Ccolor:0x4e6d70&size=480x360"
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
    this.countryFromCountryCode(country)
    } else {
      this.countryFromCountryCode(country)
    }
  };

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
    this.setState({
      toValue: x,
      fromValue: newValue.toFixed(2),
    })
  };
  fromMath(x) {
    let newValue = x / this.state.rate
    this.setState({
      toValue: newValue.toFixed(2),
      fromValue: x
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
  _handlePressDone = () => {
    Animated.timing(this.state.modalAnimatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      this.setState({
        modalIsVisible: false
      });
    });
    this.changePosition(this.state[this.state.whichModal])
    this.from.focus();
  };

  _handlePressOpenTo = () => {
    Keyboard.dismiss()
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
    Keyboard.dismiss()
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
  

  render() {
    return (
      <View style={styles.container} >
        <Image
          id="map"
          style={{ 
            backgroundColor: '#ccc',
            flex: 1,
            position: 'absolute',
            width: '100%',
            height: 450,
            justifyContent: 'center',
          }}
          source={{ uri: this.state.map }}
          blurRadius={2}
        />

        <LinearGradient 
          start = {[0.1, 0.1]}
          colors = {['rgba(121, 131, 254, .5)', '#3713AE']}
          style={styles.sentence}
        >

          { /* FROM CURRENCY */ }
          <View style={styles.inputs}>
            <TextInput
              ref={(input) => { this.from = input; }} 
              autofocus='true'
              keyboardType='number-pad'
              style={styles.currencyOutput}
              onChangeText={(fromValue) => this.fromMath(fromValue)}
              value={this.state.fromValue}
              backgroundColor= 'none'
              clearButtonMode = 'always'
              keyboardAppearance='dark'
            />
            <Text style={styles.bold}>
              <Text>
              <TouchableOpacity style={styles.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenFrom}>
              <View style={styles.location}>
                <Text style={styles.subtext}>
                  {this.countryEmoji('fromCountryEmoji') + " " + this.state.fromCountryCurrencyName}
                </Text>
              </View>
              </TouchableOpacity>
              </Text>
            </Text>
          </View>  
          
        {/*
          <TouchableOpacity 
            onPress={this.swapCountry}
            style={{margin:10}}
          >
            <Image
              style={{height:20,width:30,alignSelf:'center'}}
              source={swapImg}
            />
          </TouchableOpacity>
        */}

          { /* TO CURRENCY */ }
          <View style={styles.inputs}>
            <TextInput
              ref={(input) => { this.to = input; }} 
              autofocus='true'
              keyboardType='number-pad'
              style={styles.currencyOutput}
              onChangeText={(toValue) => this.toMath(toValue)}
              value={this.state.toValue}
              backgroundColor= 'none'
              clearButtonMode = 'always'
              keyboardAppearance='dark'
            />
            <Text style={styles.bold}>
              <Text>
              <TouchableOpacity style={styles.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenTo}>
              <View style={styles.location}>
                <Text style={styles.subtext}>
                  {this.countryEmoji('toCountryEmoji') + " " + this.state.toCountryCurrencyName}
                </Text>
              </View>
              </TouchableOpacity>
              </Text>
            </Text>
          </View>
          <View>
            <Text style={{width:'100%', textAlign:'center', 'color':'#fff8', 'padding':20}}>Last Updated {this.state.backup}</Text>
          </View>
        </LinearGradient>

      {this._maybeRenderModal()}
      </View>
    );
  }
 _maybeRenderModal = () => {
    if (!this.state.modalIsVisible) {
      return null;
    }

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
          <Animated.View style={[styles.overlay, { opacity }]} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            transform: [{ translateY }],
          }}>
          <View style={styles.toolbar}>
            <View style={styles.toolbarRight}>
              <Button title="Done" onPress={this._handlePressDone} />
            </View>
          </View>
          <Picker
            style={{ width: WindowWidth, backgroundColor: '#CACED6' }}
            selectedValue={this.state[whichMode]}
            onValueChange={itemValue => this.setState({ [whichMode]: itemValue })}>
            <Picker.Item label="Current Location 📍" value="CRL"/>
            <Picker.Item label="United States 🇺🇸" value="US"/>
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
const styles = StyleSheet.create({
  location: {
    backgroundColor: '#fff',
    borderRadius: 50,
    margin: 10
  },
  buttons:{
  },
  subtext:{
    fontWeight: '600', 
    fontSize: 16, 
    margin:6,
    marginRight:10,
    color: '#314A9D',
  },
  bold:{
    fontWeight: 'bold',
    fontSize: 60,
    color: 'black',
    padding:10
  },
  sentence:{
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    height:500,
    width:'100%',
    paddingTop:50,
    padding:10,
  },
  container: {
    height:'100%',
    backgroundColor: '#000',
  },
  pin:{
    position:'absolute',
    bottom:0,
    textAlign: 'center',
    opacity:0.5,
    padding:5,
    width:'100%',
    color:'white',
    display:'none'
  },
  countryCurrency:{
    width:'20%',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color:'grey',
    padding: 10
  },
  equals:{
    padding:10,
    fontWeight: 'normal', 
    fontSize: 20, 
    color: '#fff8',
  },
  inputs:{
    marginTop:30,
  },
  currencyOutput: {
    fontSize:55,
    fontWeight: 'bold',
    paddingLeft: 10, 
    color:'white',
  },
  currencyToOutput: {
    fontSize: 55,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  toolbar: {
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: 'flex-end',
  }
});
