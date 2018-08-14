import {
  StyleSheet
} from 'react-native';

var Style = StyleSheet.create({
location: {
    backgroundColor: '#fff',
    borderRadius: 50,
    margin: 10
  },
  buttons: {},
  subtext: {
    fontWeight: '600',
    fontSize: 16,
    margin: 6,
    marginRight: 10,
    color: '#314A9D',
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 60,
    color: 'black',
    padding: 10
  },
  sentence: {
    // flex: 1,
    // flexDirection: 'column',
    justifyContent:'space-between',
    height: '100%',
    width: '100%',
    paddingTop: 10,
    // paddingBottom:20
    // padding:10,
  },
  container: {
    height: '100%',
    backgroundColor: '#000',
  },
  pin: {
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    opacity: 0.5,
    padding: 5,
    width: '100%',
    color: 'white',
    display: 'none'
  },
  countryCurrency: {
    width: '20%',
    textAlign: 'center',
    fontSize: 50,
    fontWeight: 'bold',
    color: 'grey',
    padding: 10
  },
  equals: {
    padding: 10,
    fontWeight: 'normal',
    fontSize: 20,
    color: '#fff8',
  },
  inputs: {
    marginTop: 30,
  },
  currencyOutput: {
    fontSize: 55,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: 'white',
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
    backgroundColor: '#f3f3f3',
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  toolbarRight: {
    alignSelf: 'flex-end',
  },
  keypad: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    margin: 2,
    width: '26%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    shadowColor:'#0003',
    shadowOffset:{ width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius:0
  },
  keypadClear: {
    padding: 2,
    borderRadius: 5,
    // backgroundColor: '#fff1',
    margin: 1,
    width: '13%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  keypadFat: {
    padding: 8,
    borderRadius: 5,
    // backgroundColor: '#fff1',
    margin: 2,
    width: '26%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  calculator: {
    // flex:1,
    // marginTop: 150,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: '#1119',
    // flexWrap: 'wrap',
    // paddingBottom: 120,
    // paddingTop: 25,
    padding: 2,
    // width:300
  },
  num: {
    textAlign:'center',
    fontSize: 23,
    fontWeight: '400',
    color: '#111'
  },
  numOp: {
    textAlign:'center',
    fontSize: 23,
    fontWeight: '400',
    color: '#555'
  },
  calculatorPanel:{
    // marginTop:100
    // bottom:0,
    // paddingTop:10,
    // height:'auto',
    padding:5,
    backgroundColor:'#D2D5DB'
  },
  inputButtonHighlighted: {
    backgroundColor: '#999'
  },
  from:{
    fontSize: 55,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff',
  },
  to:{
    fontSize: 55,
    fontWeight: 'bold',
    paddingLeft: 10,
    color: '#fff8',
  }
});

export default Style;