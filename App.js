import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View,
  AsyncStorage,
  Image,
  Picker,
  FlatList,
  TextInput,
  ImageBackground,
  Button
} from 'react-native';

// import { stringify } from 'querystring';
import { LinearGradient } from 'expo';
import ratesPacket from './rates.js';
// import icon from './logo.png'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.inputRefs = {};
    
    this.state = {
      base:'hello',
      map: 'placeholder',
      latitude: "0",
      longitude: "0",
      rate: "0",
      initializing: "true",
      fromCountryCurrencyName:'',
      fromCountryCurrency: '',
      fromCountryName: '',
      fromCountryCode: '',
      fromValue: "✨ Loading! ✨",
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
      backup:''
    }
  }
  componentDidUpdate(){
    // this.loadPosition()
  };

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

  componentWillMount(){
    this.loadPosition()

    if (!AsyncStorage.getItem('toCountry')) {
      this.toCountryCurrency = 'USD'
    } else {
      this.toCountryCurrency = AsyncStorage.getItem('toCountry')
    }
  };

  // loadRates(){
  //   this.setState({
  //     ratePackage: ratesPacket.results.AF.name.toLocaleString()
  //   })
  // };

  createMap() {
    let that = this
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + that.state.latitude + "," + that.state.longitude + "&result_type=country&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"
    // let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=37.4224764,-122.0842499&result_type=country&key=AIzaSyAc9BvmSaga2NJwzDn7iSn_Oz6I7Th3oIE"

    fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      that.setState({
        fromCountryName: data.results[0].address_components[0].long_name,
        fromCountryCode: data.results[0].address_components[0].short_name
      })
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
    // console.log(ratesPacket.results)
    // let countryId = (that.pickRandomProperty(ratesPacket.results)).toLocaleString()

    that.setState({
      // fromCountryCurrency: ratesPacket.results[countryId].currencyId,
      // fromCountryCurrencyName: ratesPacket.results[countryId].currencyName,
      // fromSymbol: ratesPacket.results[countryId].currencySymbol,
      offlineMode: true
    })
  };

  convert(num) {
    let unixtimestamp = num;
    let months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let date = new Date(unixtimestamp * 1000);
    let year = date.getFullYear();
    let month = months_arr[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();
    let convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    console.log(convdataTime)
  }


  async countryFromCountryCode() {
    let that = this
    let countries = "https://openexchangerates.org/api/latest.json?app_id=9c7cb94c795045bcbd7acd369010b544"
    // let countries = ""
    fetch(countries)
    .then((resp) => resp.json())
    .then(function (data) {
      let d = new Date(data.timestamp*1000)
      let stamp = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
      that.setState({
        fromCountryCurrency: ratesPacket.results[that.state.fromCountryCode].currencyId,
        fromCountryCurrencyName: ratesPacket.results[that.state.fromCountryCode].currencyName,
        fromSymbol: ratesPacket.results[that.state.fromCountryCode].currencySymbol,
        backup:stamp,
        offlineMode:false,
        base:data.base
      })
        that.countryToRate()
      }).catch(function(){
        that.setState({
          offlineMode: true
        })
        // that.offlineMode();
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
    let convert = "https://openexchangerates.org/api/latest.json?app_id=9c7cb94c795045bcbd7acd369010b544"

    fetch(convert)
      .then((resp) => resp.json())
      .then(function (data) {
        that.setState({
          rate: data.rates[that.state.fromCountryCurrency]
        })
        that.popFromValue()
      })

  };
  changePosition(){
    this.setState({
      fromCountryCode:'TH'
    })
    this.countryFromCountryCode()
  };
  
  popFromValue() {
    let newValue = this.state.toValue * this.state.rate
    let toValue = 1
    this.setState({
      fromValue: newValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      toValue: toValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })
  };
  fromMath(x) {
    let newValue = x / this.state.rate
    this.setState({
      toValue: newValue.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      fromValue: x.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    })
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
            height: 250,
            justifyContent: 'center',
          }}
          source={{ uri: this.state.map }}
          blurRadius={2}
        />
        
        
        <LinearGradient 
        colors = {['rgba(121, 131, 254, .8))', 'rgba(255, 10, 254, 0.2)']}
        style={styles.sentence}
        >




          <Text style={styles.bold}>
            { this.state.fromValue} {"\n"}
            <Text style={styles.subtext}>
              {this.state.fromSymbol + " " + this.state.fromCountryCurrencyName} equals
            </Text>
          </Text>

          <Text style={styles.bold}>
            {this.state.toValue}{"\n"}
            <Text style={styles.subtext}>
              {this.state.toSymbol + " " + this.state.toCountryCurrencyName}
            </Text>
          </Text>

          <Text style={styles.pin}> 🗺 {this.state.fromCountryName}</Text>
        </LinearGradient>

        <View style={styles.inputContainer}>
          <View style={styles.inputs}>
            <Text style={{fontSize: 22 }}></Text>
            <TextInput
              keyboardType='numeric'
              returnKeyType = 'go'
              style={styles.currencyOutput}
              onChangeText={(fromValue) => this.fromMath(fromValue)}
              value={this.state.fromValue}
              selectTextOnFocus
            />
            <Text style={styles.countryCurrency}>{this.state.fromCountryCurrency}</Text>
          </View>

          <View style={styles.inputs}>
            <Text style={{ fontSize: 22 }}></Text>
            <TextInput
              keyboardType='numeric'
              style={styles.currencyOutput}
              onChangeText={(toValue) => this.setState({ toValue })}
              value={this.state.toValue}
              selectTextOnFocus
            />
            <Text style={styles.countryCurrency}>{this.state.toCountryCurrency}</Text>
            </View>
            <Button  title="refresh" onPress={() => this.loadPosition()} />
            <Button  title="TH" onPress={() => this.changePosition()} />
            <Text style={{width:'100%', textAlign:'center'}}>{this.state.base}</Text>
            <Text style={{width:'100%', textAlign:'center'}}>{this.state.offlineMode.toLocaleString()}</Text>
            <Text style={{width:'100%', textAlign:'center'}}>{this.state.ratePackage}</Text>
            <Text style={{width:'100%', textAlign:'center'}}>{this.state.backup}</Text>
          </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  subtext:{
    fontWeight: 'normal', 
    fontSize: 22, 
    color: 'rgba(255,255,255,0.8)',
  },
  bold:{
    fontWeight: 'bold',
    fontSize: 42,
    // color: '#7983FE',
    color: 'white',
    padding:10
  },
  sentence:{
    height:250,
    paddingTop:30,
    width:'100%',
    padding:15,
    // backgroundColor:'rgba(255,255,255,0.5)'
  },
  container: {
    // flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    // justifyContent: 'space-around',
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
    top:290,
    width:'100%'
  },
  countryCurrency:{
    // margin:20,
    width:'20%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color:'grey',
    padding: 10
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
    flex:1,
    fontSize:18,
    padding: 10, 
    borderColor: 'rgba(121, 131, 254, .5)',
    // borderColor: 'lightgrey',
    borderWidth: 1,
    backgroundColor:'white',
    borderRadius:5
  }
});

// appleStocks(){
//   async function geolocateMe() {
//     let url = 'http://dev.markitondemand.com/Api/v2/Quote/json?symbol=AAPL';
//     let response = await fetch(url);
//     let body = await response.json();
//     let {
//       AlertIOS
//     } = require('react-native');
//     AlertIOS.alert(body.Symbol, '$' + body.LastPrice);
//   }
// };