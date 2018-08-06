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

import { LinearGradient } from 'expo';
import ratesPacket from './rates.js';
import currencyPacket from './currency.js';
import swap from './swap.png';

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
      map: "https://maps.googleapis.com/maps/api/staticmap?center=" + this.state.latitude + "," + this.state.longitude + "&zoom=13&size=400x500&sensor=false&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"
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
            height: 400,
            justifyContent: 'center',
          }}
          source={{ uri: this.state.map }}
          blurRadius={2}
        />

        <LinearGradient 
          colors = {['rgba(121, 131, 254, .8))', 'rgba(255, 10, 254, 0.2)']}
          style={styles.sentence}
        >
          <TextInput
            ref={(input) => { this.from = input; }} 
            autofocus='true'
            keyboardType='number-pad'
            style={styles.currencyOutput}
            onChangeText={(fromValue) => this.fromMath(fromValue)}
            value={this.state.fromValue}
            backgroundColor= 'none'
            clearButtonMode = 'always'
          />
          <Text style={styles.bold}>
            <Text>
             <TouchableOpacity style={styles.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenFrom}>
              <Text style={styles.subtext}>
                {this.state.fromSymbol}
                <Text style={styles.underline}>
                  {this.state.fromCountryCurrencyName}
                </Text>
                {this.countryEmoji('fromCountryEmoji')}
              </Text>
             </TouchableOpacity>
            </Text>
          </Text>

          <Button style={styles.buttons} title='🔄' onPress={this.swapCountry} />

          <Text style={styles.currencyOutput}>{this.state.toValue}</Text>
          <Text style={styles.bold}>
            <Text>
             <TouchableOpacity style={styles.buttons} color='rgba(121, 131, 254, 1)' onPress={this._handlePressOpenTo}>
              <Text style={styles.subtext}>
                {this.state.toSymbol}
                <Text style={styles.underline}>
                  {this.state.toCountryCurrencyName}
                </Text>
                {this.countryEmoji('toCountryEmoji')}
              </Text>
             </TouchableOpacity>
            </Text>
          </Text>

          </LinearGradient>
        <View style={styles.inputContainer}>
          <Text style={{width:'100%', textAlign:'center', 'color':'grey', 'padding':20}}>Last Updated {this.state.backup}</Text>
        </View>
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
  underline:{
    textDecorationLine:'underline',
    padding:10,
  },
  subtext:{
    fontWeight: 'normal', 
    fontSize: 22, 
    margin:10,
    color: 'rgba(255,255,255,0.8)',
  },
  bold:{
    fontWeight: 'bold',
    fontSize: 60,
    color: 'white',
    padding:10
  },
  sentence:{
    height:400,
    paddingTop:50,
    width:'100%',
    padding:15,
  },
  container: {
    height:'100%',
    backgroundColor: 'white',
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
  inputContainer:{
    position:'absolute',
    top:400,
    width:'100%'
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
    // margin:20,
    fontWeight: 'normal', 
    fontSize: 20, 
    color: 'rgba(255,255,255,0.4)',
  },
  inputs:{
    padding:10,
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
  },
  currencyOutput: {
    // flex:1,
    fontSize:50,
    fontWeight: 'bold',
    paddingLeft: 10, 
    // borderColor: 'rgba(121, 131, 254, 1)',
    // borderColor: 'lightgrey',
    // borderWidth: 1,
    // backgroundColor:'white',
    // borderRadius:5,
    color:'white',
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
