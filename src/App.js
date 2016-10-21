import React, { Component } from 'react';
const ReactHighcharts = require('react-highcharts'); 
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Slider from 'material-ui/Slider';
import { Grid, Row, Col} from 'react-flexbox-grid/lib/index';
import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import {
  blueGrey100, blueGrey200, blueGrey300, blueGrey400, 
  blueGrey500,blueGrey600, blueGrey700, blueGrey800,
  orange800,
  grey100, grey300, grey400, grey500,
  white, darkBlack, fullBlack,cyan500,
} from 'material-ui/styles/colors';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: blueGrey500,
    primary2Color: blueGrey800,
    primary3Color: grey400,
    accent1Color: orange800,
    accent2Color: grey100,
    accent3Color: grey500,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    /*disabledColor: fade(darkBlack, 0.3),*/
    pickerHeaderColor: cyan500,
    /*clockCircleColor: fade(darkBlack, 0.07),*/
    shadowColor: fullBlack,
  },
  appBar: {
    height: 50,
  },
});
const assetColors=[blueGrey100, blueGrey200, blueGrey300, blueGrey400, 
  blueGrey500,blueGrey600, blueGrey700, blueGrey800];
import RaisedButton from 'material-ui/RaisedButton';
//import './alasql.min.js';
import logo from './logo.svg';
import './App.css';
var groupBy=function(objectToReduce, category, values, names){//, names){
  values=Array.isArray(values)?values:[values];
  names=names?names:values.push(category);
  return objectToReduce.reduce((res, obj)=>{
    var n=values.length;
    if (!(obj[category] in res)){
      for(var i=0; i<n; ++i){
        obj[names[i]] = obj[values[i]];
        delete obj[values[i]];
      }
      obj[names[n]]=obj[category];
      delete obj[category];//rename category
      res.__array.push(res[obj[names[n]]] = obj);
    }
    else {
      for(var i=0; i<n; ++i){
        res[obj[category]][names[i]] += obj[values[i]];
      }
    }
    return res;
  }, {__array:[]}).__array;
}
const assets=[
  {
    asset:"loan1", 
    number:4,
    risk:5,
    return:2,
    type:"loan"
  },
  {
    asset:"loan2", 
    number:3,
    risk:3,
    return:1,
    type:"loan"
  },
  {
    asset:"stock1",
    number:6,
    risk:10,
    return:6, 
    type:"stock"
  },
  {
    asset:"stock2",
    number:4,
    risk:8,
    return:4, 
    type:"stock"
  },
  {
    asset:"bond1",
    number:7,
    risk:1,
    return:.5, 
    type:"bond"
  },
  {
    asset:"bond2",
    number:4,
    risk:.2,
    return:.1, 
    type:"bond"
  },
];
const config= 
{
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: 0,
    plotShadow: false,

  },
  credits:{
    enabled:false
  },
  title: {
    text:null
  },
  plotOptions: {
    pie: {
      dataLabels: {
        enabled: true,
        distance: -50,
        /*style: {
            fontWeight: 'bold',
            color: 'white'
        }*/
      },
     // center: ['50%', '75%']
    }
  },
  series: [{
      type: 'pie',
      name: 'Allocation',
      innerSize: '50%',
      data:[
      ]
  }]
};

class Chart extends Component{
  constructor(props){
    super(props);
    this.firstRisk=50;
    this.state={
      risk:this.firstRisk,
      ret:this.relRiskReturn(this.firstRisk),
      update:true
    };
    this.assets=[{y:0, name:'stock', risk:1.2, color:assetColors[1]}, {y:0, name:'loans', risk:1.05, color:assetColors[2]}, {y:0, name:'bond', risk:.95, color:assetColors[3]}];
    
    //config.series[0].data=assets;
  }
  computeWeightsGivenRisk(newRisk){
    //var n=this.state.backboneData.length;
    this.assets.map((value, index)=>{ //does this mutate chart?
      value.y=Math.pow(newRisk, value.risk);
    });
  }
  relRiskReturn(risk){
    return 10*Math.sqrt(risk);
  }
  relReturnRisk(ret){
    return ret*ret/100;
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.update;
  }
  computeRiskAndReturn(newRisk){
    this.computeWeightsGivenRisk(newRisk);
    this.setState({
      risk:newRisk,
      ret:this.relRiskReturn(newRisk)
    });
    if(this.state.update){
      this.chart.redraw();
    }
    
  }
  startDrag=(event)=>{
    console.log("Dragging");
    this.setState({update:false});
  }
  stopDrag=(event)=>{
    console.log("stopped Dragging");
    this.setState({update:true});

  }
  handleRisk=(event, value)=>{
    this.computeRiskAndReturn(value);
  }
  handleRet=(event, value)=>{
    this.computeRiskAndReturn(this.relReturnRisk(value));
  }
  componentDidMount(){
    this.chart = this.refs.chart.getChart();
    this.computeRiskAndReturn(this.firstRisk);
    this.chart.series[0].setData(this.assets, false);
  }
  render(){
    return(
      <Grid>
        <Paper zDepth={2}>
          <Row center="xs" middle="xs">
            <Col xs={12} sm={4}>
              <Row start="xs">
                <Col xs={12}>
                  <p>Risk</p>
                  <Slider min={0}
                    max={100}
                    step={1}
                    defaultValue={this.firstRisk}
                    value={this.state.risk}
                    onChange={this.handleRisk}
                    onDragStart={this.startDrag}
                    onDragStop={this.stopDrag}
                    label="Risk"
                  />
                  <p>Return</p>
                  <Slider min={0}
                    max={100}
                    step={1}
                    defaultValue={this.state.ret}
                    value={this.state.ret}
                    onChange={this.handleRet}
                    onDragStart={this.startDrag}
                    onDragStop={this.stopDrag}
                    label="Return"
                  />
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={6}>
              <ReactHighcharts ref="chart" config={config}></ReactHighcharts>
            </Col>
          </Row>
        </Paper>
      </Grid>
    );
  }



}


class App extends Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Chart/>
      </MuiThemeProvider>
    );
  }
}
export default App;
