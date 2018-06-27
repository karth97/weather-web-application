import React, { Component } from 'react';
import './App.css';
import Header from './Header/header.js';
import Wall from './MainContent/ForecastContainer/images/beach1.jpg'
import ForecastContainer from './MainContent/ForecastContainer/TodayForecast.js'
import ph from './icons/logo.png'

import TempGraph from './MainContent/Graphs/Temperature.js'
import WindGraph from './MainContent/Graphs/Wind.js'
import RainGraph from './MainContent/Graphs/Rain.js'

import Snackbar from '@material-ui/core/Snackbar';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';



class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      snack: false,
      rhv: 'Hyderabad,IN',
      
      stype:'search',
      iv: 'Hyderabad,IN',
      lat:null,
      lon:null,

      gldialog:false
    }
  }

  passInputValueHandler = (value) => {
    let tvalue = value();
    if (tvalue === null || tvalue === "" || tvalue === " " || tvalue === undefined || tvalue === unescape) {
      console.log("if case : value from App.js passInputHandler:" + tvalue);
      this.setState({stype:'search'});
      this.setState({ iv: null });
      this.setState({ snack: true })
    } else {
      console.log("else case : value from App.js passInputHandler:" + tvalue);
      this.setState({ rhv: tvalue });
      this.setState({stype:'search'});
      this.setState({ iv: tvalue });
    }
  }

  snackHanlder = () => {
    this.setState({ snack: false })
  }

  refreshHandler = () => {
    console.log("RefreshHandler Called From App.js ")
    let tsl = this.state.rhv;
    this.setState({ iv: tsl });
  }

  geolocHandler = () => {
    // check for Geolocation support
    if (navigator.geolocation) {
      console.log('Geolocation is supported!');
      var showNudgeBanner = () => {
        this.setState({gldialog:true});
      };
  
      var hideNudgeBanner = () => {
        this.setState({gldialog:false});
      };

      let nudgeTimeoutId = setTimeout(showNudgeBanner, 10);
    
      let startPos = null ;
      let geoSuccess = (position) => {
        startPos = position;
        //console.log("Latitude:" + startPos.coords.latitude);
        //console.log("Longitude:" + startPos.coords.longitude);
        this.setState({iv:null});
        this.setState({lat:startPos.coords.latitude});
        this.setState({lon:startPos.coords.longitude});
        this.setState({stype:'latlon'});
        hideNudgeBanner();
        clearTimeout(nudgeTimeoutId);
      };
     
      let geoError = (error) => {
        switch(error.code) {
          case error.TIMEOUT:
            // The user didn't accept the callout
           showNudgeBanner(); break;
        }
      };

     navigator.geolocation.getCurrentPosition(geoSuccess,geoError);
    }
    else {
      console.log('Geolocation is not supported for this Browser/OS.');
    }

  
  }

  getv = () => {

    if (this.state.stype == 'search') {
      let dataObject1 = {
        stype: this.state.stype,
        sl: this.state.iv,
      }
      return dataObject1;
    }
    else if (this.state.stype == 'latlon') {
      let dataObject2 = {
        stype: this.state.stype,
        lat: this.state.lat,
        lon: this.state.lon
      }
      return dataObject2;
    }
  }

  dialogCloseHanlder = () => {
    this.setState({gldialog:false});
  }

  render() {
    // console.log("render called of App and its state values are: "+"iv:"+this.state.iv+" snack:"+this.state.snack+" od:"+this.state.od);
    return (
      <div className="panel-group ">
        <div className="panel-header">
          <Header iv={this.passInputValueHandler} refreshH={this.refreshHandler} glh={this.geolocHandler} />
        </div>
        <div className="panel-body App" data-toggle="modal" data-target="#myModal" style={{ height:'900px', zIndex: '100', marginTop: '50px' }}>

          <ForecastContainer searchLoc={this.getv} />

          <div className='container' style={{ paddingTop: '80px', display: 'flex', width: '90%' }}>

            <TempGraph searchLoc={this.getv} /> <Divider style={{ width: '80px', height: '0' }} />

            <WindGraph searchLoc={this.getv} /> <Divider style={{ width: '80px', height: '0' }} />

            <RainGraph searchLoc={this.getv} />

          </div>

          <Snackbar style={{ marginBottom: '10px' }}
            autoHideDuration={2000}
            onClose={this.snackHanlder}
            open={this.state.snack}
            ContentProps={{ 'aria-describedby': 'message-id', }}
            message={<span style={{ fontSize: '1.5rem' }}
              id="message-id">Location Empty</span>} />


          <Dialog
            open={this.state.gldialog}
            aria-labelledby="alert-dialog-slide-title"
            aria-describedby="alert-dialog-slide-description">
            <DialogTitle id="alert-dialog-slide-title" style={{padding:'10px',width:'350px'}}>
              <Grid container wrap="nowrap" spacing={16}>
                <Grid item>
                <CircularProgress style={{ color: '#1b1d28'}} size={40} />
                </Grid>
                <Grid item xs>
                   <Typography style={{fontSize:'1.2em',marginTop:'10px'}}>Please Wait ... </Typography>
                </Grid>
              </Grid>
            </DialogTitle>
          </Dialog>
        </div>
      </div>
    );
  }
}
export default App;