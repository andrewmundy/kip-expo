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
    padding: 15
  },
  sentence: {
    justifyContent:'space-between',
    height: '100%',
    width: '100%',
    paddingTop: 10,
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
    backgroundColor: '#C7CCD2',
    paddingVertical: 5,
    paddingHorizontal: 15,
    justifyContent:'space-between',
    alignItems:'center',
    flexDirection:'row'
  },
  listText:{
    fontSize:16,
    fontWeight:'600',
    paddingRight:3,
    paddingLeft:3
  },
  hello:{
    color:'white',
    fontSize:50,
    fontWeight:'bold'
  },
  helloSubtext:{
    fontWeight:'200',
    fontSize:24,
    color:'white'
  },
  helloBold:{
    fontWeight:'bold',
    fontSize:28,
    color:'#fff'
  },
  helloNumbers:{
    fontSize:22,
    color:'#fff9'
  },
  list:{
    padding:5,
    backgroundColor:'white',
    borderRadius:50,
    marginRight:15
  },
  toolbarRight: {
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
    margin: 1,
    width: '13%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff5',
    shadowColor:'#0003',
    shadowOffset:{ width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius:0
  },
  keypadFat: {
    padding: 8,
    borderRadius: 5,
    margin: 2,
    width: '26%',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff5',
    shadowColor:'#0003',
    shadowOffset:{ width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius:0
  },
  calculator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,

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
    padding:5,
    backgroundColor:'#C7CCD2'
    // backgroundColor:'#1119'
  },
  inputButtonHighlighted: {
    backgroundColor: '#4445',
    shadowColor:'#fff',
    shadowOffset:{ width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius:0
  },
  from:{
    fontSize: 48,
    fontWeight: 'bold',
    padding: 10,
    color: '#fff',
    width:'100%',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: {width: 0, height: 10},
    textShadowRadius: 20
  },
  to:{
    fontSize: 48,
    fontWeight: 'bold',
    padding: 10,
    color: '#fff9',
    width:'100%',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 10},
    textShadowRadius: 20
  },
  adjust:{
  }
});

export default Style;