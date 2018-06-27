import React, { Component } from 'react';
import './header.css';
import companylogo from '../icons/logo.png'
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';
import GpsFixed from '@material-ui/icons/GpsFixed';
import Tooltip from '@material-ui/core/Tooltip';
import axios from 'axios';


class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      slts:[]
    }
  }

  inputOnChangeHandler = (event) => {
    let etv = event.target.value;
    if (etv !== null || etv !== "" || etv !== " " || etv!==undefined || etv!==unescape ) {
      this.makeApiRequest(etv);
      etv = null;
    }
    else {
      etv = null;
      this.setState({slts:[]});
    }
  }


  packDataForListing = (fr) => {
    this.setState({slts:[]});
    if (fr.count !== 0) {
      let tfr = fr;
      //let frcnt = tfr.count;
      let frlistcnt = tfr.list.length;
      let listItems = [];

      for (let i = 0; i < frlistcnt; i++) {
        let cty = tfr.list[i].name;
        let cntry = tfr.list[i].sys.country;
        let fccn = cty + ',' + cntry;
        listItems.push(fccn);
      }
      //console.log('listItems array Value From Header: ' + listItems);
      this.setState({slts:listItems});
    }
  }

  listItemClickHandler = (indx) => {
    //console.log("List Item Clicked Index: "+indx);
    document.getElementById("inpv").focus();
    let cv = this.state.slts[indx];
    document.getElementById('inpv').value=cv;
    this.setState({ivv:document.getElementById('inpv').value});
    this.setState({slts:[]});
  }
 
  showList = () => {
       let listms = this.state.slts.map((lns,i) => <li className='listonhover' style={{ background:'#1b1d28'}} key={i} onClick={this.listItemClickHandler.bind(this,i)}>{lns}</li>);
       return listms;
  }

  makeApiRequest = (usloc) => {
    let findresponse = null;
    const tsloc = usloc;
    if (tsloc === null) {
      console.log("tsloc value in Header makeApiRequest:" + tsloc);
    }
    else {
      let apiu = 'http://api.openweathermap.org/data/2.5/find?q=Hyderabad&units=metric&type=accurate&appid=91dc0b102809685bf3c5a9df4407b580'
      let newurlrequest = apiu.replace('Hyderabad', tsloc);
      axios.get(newurlrequest)
        .then(response1 => {
          if (response1.status === 200) {
            findresponse = response1.data;
            this.packDataForListing(findresponse);
          }
          else if(response1.status === 400){
            console.log("Bad Query From makeApiRequest Header");
          }
        })
        .catch(function (error) {
          if (error.response) {
            //console.log(error.response.data);
            console.log(error.response.status);
            //console.log(error.response.headers);
          } else if (error.request) {
            console.log(error.request);
          } else {
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
      console.log("NewUrlRequest From Header makeApiRequest: " + newurlrequest);
    }

  }
  
  getivv = () => {
    let sl = document.getElementById('inpv').value;
    return sl;
  }

  onBlurHandler = () => {
    console.log("OnBlur called From Header.js");
    this.setState({slts:[]});
  }

  render() {

    return (
      <div className="navba  navbar-fixed-top w3-card-4" style={{ userSelect: 'none', marginTop: '1px', background: '#1b1d28' }}>
        <div className="container-fluid">
          <div className="navbar-header">
            <img className="logo" src={companylogo} alt="companylogo" ></img>
            <div className="logo_type">
              <h1 className="site_title">Weather InFo</h1>
            </div>
          </div>
          <div className="navbar-right  w3-animate-right" style={{ display: 'flex' }}>
            <Tooltip enterDelay={2000} title={<span style={{ padding: '5px', fontSize: '1.2rem' }}>Refresh</span>} >
              <IconButton style={{ outline: 'none', color: 'white', width: '45px' }}>
                <Refresh onClick={this.props.refreshH.bind(this)}/>
              </IconButton>
            </Tooltip>
            <Tooltip enterDelay={2000} title={<span style={{ padding: '5px', fontSize: '1.2rem' }}>Detect Location</span>} >
              <IconButton  style={{ outline: 'none', color: 'white', width: '45px' }}>
                <GpsFixed onClick={this.props.glh.bind(this)}/>
              </IconButton>
            </Tooltip>
            <div className="nvr input-group">
              <input type="text" id="inpv" className="form-control  input-sm"   onChange={this.inputOnChangeHandler.bind(this)} placeholder="Search Location ..." name="search" />
              <div className="input-group-btn" style={{paddingLeft:'2px'}}>
                <Tooltip enterDelay={2000} title={<span style={{ padding: '5px', fontSize: '1.2rem' }}>Search</span>} >
                  <button className="btn btn-default btn-sm" onClick={this.props.iv.bind(this,this.getivv)}>
                    <i className="glyphicon glyphicon-search"></i>
                  </button>
                </Tooltip>
              </div>
              <ul className="w3-ul" style={{ borderRadius: '4px', color: 'white', background:'transparent', minWidth: '100%', top: '38px', position: 'absolute', left: '0px' }}>
                 <this.showList/>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;