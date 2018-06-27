
import React, { Component } from 'react';
import './TodayForecast.css';
import axios from 'axios';

import wind from './images/iconwind.png';
import dir from './images/iconcompass.png';
import hum from './images/humidity.png';
import minmax from './images/upandd.png';

import srss from './icons/srss.svg';
import brokenclouds from './icons/brokenclouds.svg';
import clearsky from './icons/clearsky.svg';
import fewclouds from './icons/fewclouds.svg';
import mist from './icons/mist.svg';
import rain from './icons/rain.svg';
import scatteredclouds from './icons/scatteredclouds.svg';
import showerrain from './icons/showerrain.svg';
import snow from './icons/snow.svg';
import thunderstorm from './icons/thunderstorm.svg';
import thunderstormwithrain from './icons/thunderstormwithrain.svg';
import clouds from './icons/clouds.svg';
import uparrow from './icons/uparrow.png';

import CanvasJS from '../canvasjs/canvasjs.min.js';

import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';



class TodayForecast extends Component {

	
	constructor(props) {
		super(props);
		this.state = {
			wdata:null,
			gdata:null
		}
	}

	degToCard(deg) {
		if (deg > 11.25 && deg < 33.75) {
			return "NNE";
		} else if (deg > 33.75 && deg < 56.25) {
			return "ENE";
		} else if (deg > 56.25 && deg < 78.75) {
			return "EAST";
		} else if (deg > 78.75 && deg < 101.25) {
			return "ESE";
		} else if (deg > 101.25 && deg < 123.75) {
			return "ESE";
		} else if (deg > 123.75 && deg < 146.25) {
			return "SE";
		} else if (deg > 146.25 && deg < 168.75) {
			return "SSE";
		} else if (deg > 168.75 && deg < 191.25) {
			return "SOUTH";
		} else if (deg > 191.25 && deg < 213.75) {
			return "SSW";
		} else if (deg > 213.75 && deg < 236.25) {
			return "SW";
		} else if (deg > 236.25 && deg < 258.75) {
			return "WSW";
		} else if (deg > 258.75 && deg < 281.25) {
			return "WEST";
		} else if (deg > 281.25 && deg < 303.75) {
			return "WNW";
		} else if (deg > 303.75 && deg < 326.25) {
			return "NW";
		} else if (deg > 326.25 && deg < 348.75) {
			return "NNW";
		} else {
			return "NORTH";
		}
	}

	componentDidMount() {
		this.intialiseCard();
	}

	drawGraph = (dob) => {

		let dataPoints = [];
		let width = 455;
		if (dob.dys.length === 5) {
			width = 455;
		}
		else {
			width = 373;
		}
	
		for(let i = 0; i < dob.dts.length; i++) {
			let ya = [];
			let dt = dob.dts[i];
			ya.push(dob.tmx[i]);
			ya.push(dob.tmn[i]);
			dataPoints.push({
				x: new Date(dt),
				y: ya
			});
		}

		const chart = new CanvasJS.Chart("chartContainer", {
			animationEnabled: true,
			backgroundColor: '#00000000',
			width: width,
			axisX: {
				gridThickness: 0,
				tickLength: 0,
				lineThickness: 0,
				labelFormatter: function () {
					return " "
				}
			},
			axisY: {
				interval: 10,
				gridThickness: 0,
				tickLength: 0,
				lineThickness: 0,
				labelFormatter: function () {
					return " ";
				}
			},
			data: [{
				lineThickness: 1,
				type: "rangeSplineArea",
				indexLabel: "{y[#index]}°",
				indexLabelFontColor: "#fff",
				indexLabelFontSize: 15,
				lineColor: "#00c8ff",
				fillOpacity: 0.1,
				markerColor: "#fff",
				xValueFormatString: "MMMM YYYY",
				toolTipContent: "Max:{y[0]}°C</br>Min: {y[1]}°C",
				dataPoints: dataPoints
			}]
		});

		chart.render();
	}

	getDateFromGData = (date) => {
		let tdate = date.split(" ", 1);
		let dat = new Date(tdate);
		let ttdat = dat.getDate();
		//console.log("ttdat: "+ttdat);
		return ttdat;
	}

	getDt = (dt) => {
		let tdate = dt.split(" ",1);
		return tdate[0];
	}

	packDataToDrawGraph = (gdata) => {
		let day = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let tempformn = [];
		let tempformx = [];
		let dates = [];
		let maxt = [];
		let mint = [];
		let days =[];
		let imgids = [];
		
		let listlength = gdata.list.length;
		let d = new Date();
		let date = d.getDate();
		//let date = gdata.list[0].dt_txt;
		let ttdat = date;//this.getDateFromGData(date);
		for (let i = 1; i < listlength; i++) {
			let dat = gdata.list[i].dt_txt;
			let tempdt = this.getDateFromGData(dat);
			//console.log("temdt: "+tempdt);
			if(ttdat!==tempdt) {
				ttdat = tempdt;
				tempformn.push(i);
			}
		}
		
		for (let i = 0; i < tempformn.length; i++) {
			if (i !== tempformn.length - 1) {
				tempformx[i] = tempformn[i] + 7;
			}
			else {
				tempformx[tempformn.length - 1] = listlength - 1;
			}
		}

		for (let i = 0; i < tempformn.length; i++) {
			let index = tempformn[i];
			let tpdt = gdata.list[index];

			let dt = this.getDt(tpdt.dt_txt);
			let mnt = gdata.list[index].main.temp_min;
			mint.push(mnt);
			
		    index = tempformx[i];
			let mxt = gdata.list[index].main.temp_max;
            maxt.push(mxt);

			imgids.push(gdata.list[index].weather[0].id)
			dates.push(dt);
			
		}

		for(let i=0;i<dates.length;i++) {
			let dt = dates[i];
			let tdt = new Date(dt);
			days.push(day[tdt.getDay()]);
		}
	

		let dataObject = {
			dts: dates,
			tmx: maxt,
			tmn: mint,
			dys:days,
			imageids:imgids
		}

	/*	console.log("temformn array value => From packDataToDrawGraph TodayFrorecast: "+tempformn);
		console.log("temformx array value => From packDataToDrawGraph TodayFrorecast: "+tempformx);
		console.log("mint array value => From packDataToDrawGraph TodayFrorecast: "+mint);
		console.log("maxt array value => From packDataToDrawGraph TodayFrorecast: "+maxt);
		console.log("dates array value => From packDataToDrawGraph TodayFrorecast: "+dates);
		console.log("days array value => From packDataToDrawGraph TodayFrorecast: "+days);*/
    
		return dataObject;
	}

	intialiseCard = () => {
		let dObject = {
			stype:'search',
			sl:'Hyderabad,IN'
		};
	    this.makeApiRequest(dObject);
	}



	componentWillReceiveProps() {
		let tsearchLoc = this.props.searchLoc();
		if (tsearchLoc === null || tsearchLoc === "" ||tsearchLoc === undefined) {
			console.log("if case tsearchLocObject value in TodayForecast componentWillReceiveProps:" + tsearchLoc);
		}
		else {
			this.makeApiRequest(tsearchLoc);
			console.log(" else case tsearchLocObject property sl value in TodayForecast componentWillReceiveProps:" + tsearchLoc.stype);
		}
	}

	makeApiRequest = (usloc) => {
		let weatherresponse = null;
		let graphresponse = null;
		let graphu = null;
		let tsloc = null;
		let searchtype = usloc.stype;
		if(searchtype == 'search') {
			if(usloc.sl !==null || usloc.sl !==undefined ) {
				tsloc = usloc.sl;
				console.log("usloc.sl value in TodayForecast from makeApiRequest "+usloc);
			}
			else {
              console.log("Null or Undefined usloc.sl value in TodayForecast from makeApiRequest "+usloc);
			}
		}
		else if (searchtype == 'latlon') {
			if (usloc.lat !== null && usloc.lon !== null || usloc.lat !== undefined && usloc.lon !== undefined) {
				tsloc = `lat=${usloc.lat}&lon=${usloc.lon}`;
				console.log("line 273 usloc.lat:"+usloc.lat+"and usloc.lon:"+usloc.lon+"values in TodayForecast from makeApiRequest");
			}
			else {
				console.log("Null or Undefined usloc.lat and usloc.lon values in TodayForecast from makeApiRequest ");
			}
		}

		if (tsloc === null || tsloc === undefined) {
			console.log("tsloc value in TodayForecast makeApiRequest:" + tsloc);
		}
		else {
			let newurlrequest = null;
			let apiu = 'http://api.openweathermap.org/data/2.5/weather?q=Hyderabad,IN&units=metric&type=accurate&appid=91dc0b102809685bf3c5a9df4407b580'
			
			if(searchtype== 'search') {
				newurlrequest = apiu.replace('Hyderabad,IN', tsloc);
			}
			else if(searchtype == 'latlon') {
				newurlrequest = apiu.replace('q=Hyderabad,IN',tsloc);
			}
			if (newurlrequest !== null) {
				axios.get(newurlrequest)
				.then(response1 => {
					if (response1.status === 200) {
						weatherresponse = response1.data;
						this.setState({ wdata: weatherresponse });
						console.log("line 299 Location Searched From TodayForecast loc: "+this.state.wdata.name);
						graphu = `http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.wdata.coord.lat}&lon=${this.state.wdata.coord.lon}&units=metric&type=accurate&appid=91dc0b102809685bf3c5a9df4407b580`
						axios.get(graphu)
							.then(response2 => {
								if (response2.status === 200) {
									graphresponse = response2.data;
									this.setState({ gdata: graphresponse })
									let dob = this.packDataToDrawGraph(this.state.gdata);
									this.drawGraph(dob);
									tsloc = null;
								}
							})
							.catch(function (error) {
								if (error.response) {
									console.log(error.response.data);
									console.log(error.response.status);
									console.log(error.response.headers);
								} else if (error.request) {
									console.log(error.request);
								} else {
									console.log('Error', error.message);
								}
								console.log(error.config);
							});
					}
				})
				.catch(function (error) {
					if (error.response) {
						console.log(error.response.data);
						console.log(error.response.status);
						console.log(error.response.headers);
					} else if (error.request) {
						console.log(error.request);
					} else {
						console.log('Error', error.message);
					}
					console.log(error.config);
				});
			}
			else {
				console.log("NewUrlRequest From TodayForecast makeApiRequest: " + newurlrequest);
			}
			//console.log("NewUrlRequest From TodayForecast makeApiRequest: " + newurlrequest);
		}
	}

	getIcon = (dt) => {
		if (dt >= 200 && dt <= 232) {
			if (dt === 201) {
				return thunderstormwithrain;
			}
			else {
				return thunderstorm;
			}
		}
		if (dt >= 300 && dt <= 321) {
			return rain;
		}
		if (dt >= 500 && dt <= 531) {
			return showerrain;
		}
		if (dt >= 600 && dt <= 622) {
			return snow;
		}
		if (dt >= 701 && dt <= 781) {
			return mist;
		}
		if (dt === 800) {
			return clearsky;
		}
		else {
			if (dt === 801) {
				return fewclouds;
			}
			else if (dt === 802) {
				return scatteredclouds;
			}
			else if (dt === 803) {
				return brokenclouds;
			}
			else {
				return clouds;
			}
		}
	}

	 forecastList = (fprops) => {
		const days = fprops.prps.dys;
		//console.log("days :"+days);
		const flistItems = days.map((day,indx) =>
			<div key ={indx} className="forecast">
				<div className="forecast-header">
					<div className="day">{day}</div>
				</div>
				<div className="forecast-content">
					<div className="forecast-icon">
						<img src={this.getIcon(fprops.prps.imageids[indx])} alt="" style={{ width: '48px' }} />
					</div>
				</div>
			</div>
		);
		return flistItems;
	  }
	  

	render() {
		if (!this.state.gdata) {
			return (
				<div className="container" style={{textAlign:'center'}}>
					<CardContent>
						<CircularProgress style={{ color:'#1b1d28',margin: '10px' }} size={50} />
					</CardContent>
				</div>
			);
		}
	

		let gs = {
			paddingTop:'10px',
			overflowY: 'hidden',
			marginTop: '100px',
			height: '168px',
		    width:'455px'
		};

		let dob = this.packDataToDrawGraph(this.state.gdata);
		
		let days = ["Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		let tdt = new Date(0);
		tdt.setUTCSeconds(this.state.wdata.dt);
		let day = days[tdt.getDay()];
		let date = tdt.getDate();
		let month = months[tdt.getMonth()];

		let ap = "AM";
		let sr = new Date(0);
		sr.setUTCSeconds(this.state.wdata.sys.sunrise);
		let h = sr.getHours();
		if (h === "0") { h = "12"; }
		else if (h > 12) { h -= 12; ap = "PM"; }
		else if (h === 12) { ap = "PM"; }
		let tsr = h + ':' + sr.getMinutes() + " " + ap;
		let ss = new Date(0);
		ss.setUTCSeconds(this.state.wdata.sys.sunset);
		h = ss.getHours();
		ap = "AM";
		if (h === "0") { h = "12"; }
		else if (h > 12) { h -= 12; ap = "PM"; }
		else if (h === 12) { ap = "PM"; }
		let tss = h + ':' + ss.getMinutes() + " " + ap;

		let temp = this.state.wdata.main.temp;
		let maxt = this.state.wdata.main.temp_max;
		let mint = this.state.wdata.main.temp_min;
		let direction = this.degToCard(this.state.wdata.wind.deg);
		const desc = this.state.wdata.weather[0].description.toUpperCase();
		let d = this.state.wdata.weather[0].id;
		let mainicon = this.getIcon(d);
	    let loc =  this.state.wdata.name;
        let cntry = this.state.wdata.sys.country;
        let humdty = this.state.wdata.main.humidity;
		let wndspeed = this.state.wdata.wind.speed;
		
		return (
			<div className="container">
				<CardContent>
					<div className="forecast-container w3-card w3-animate-zoom" >
						<div className="today forecast">
							<div className="forecast-header">
								<div className="day">{day}</div>
								<div className="date">{date} {month}</div>
							</div>
							<div className="forecast-content">
								<div className="location" style={{ textAlign: 'center' }} >{desc}</div>
								<div className="location">{loc},{cntry}</div>
								<div className="degree">
									<div className="num">{Math.floor(temp)}<sup>o</sup>C</div>
									<div className="forecast-icon">
										<img src={mainicon} alt="" style={{ width: '75px' }} />
									</div>
									<div className="forecast-icon2">
										<img src={srss} alt="" style={{ marginRight: '15px', width: '45px' }} />
										<img className="row" src={uparrow} alt="" style={{ paddingTop: '12px' }} />
										<span style={{ position: 'relative', marginLeft: '16px', bottom: '5px', display: 'inline-block' }}><h6>{tsr}</h6></span>
										<span style={{ display: 'block', position: 'relative', marginLeft: '70px', bottom: '21px' }}><h6>{tss}</h6></span>
									</div>
								</div>
								<span><img src={hum} alt="" />{humdty}%</span>
								<span><img src={wind} alt="" />{wndspeed}m/s</span>
								<span><img src={dir} alt="" />{direction}</span>
								<span><img src={minmax} alt="" />{Math.floor(maxt)}<sup>o</sup>C|{Math.floor(mint)}<sup>o</sup>C</span>
							</div>
						</div>
						<div className='forecast-container2'>
							<div id='chartContainer' style={gs} />
						</div>
						<this.forecastList prps={dob}/>
					</div>
				</CardContent>
			</div>
		);
	}
}
export default TodayForecast;