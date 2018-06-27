import React, { Component } from 'react';
import CanvasJS from '../canvasjs/canvasjs.min.js';
import Card from '@material-ui/core/Card';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';

class WindGraph extends Component {
    

    constructor(props) {
        super(props);
        this.state = {}
    }

    drawGraph = (dob) => {
        let dataPoints = [];
        for (let i = 0; i < dob.dts.length; i++) {
			let dt = dob.dts[i];
		//	console.log("Dates: "+dt);
            dataPoints.push({ x:new Date(dt) , y:dob.wnd[i]});
        }
       // console.log("dataPoints array value => From drawGraph in WindGraph : "+dataPoints);
        var chart = new CanvasJS.Chart('windg', {
            backgroundColor: "#1b1d28",
            animationEnabled: true,
            title: {
                fontColor: "#fff",
                text: "Wind,m/s"
            },
            axisX: {
                labelFontColor: "#fff",
                valueFormatString: "DDD"
            },
            axisY: {
                labelFontColor: "#fff",
                suffix: "m/s",
            },
            data: [{
                lineThickness: 1,
                lineColor: "#00c8ff",
                markerColor: "#fff",
                type: "spline",
                indexLabel: "{y}m/s",
                indexLabelFontColor: "#fff",
                dataPoints:dataPoints
            }]
        });
        chart.render();
    }

    getDateFromGData = (date) => {
		let tdate = date.split(" ", 1);
		let dat = new Date(tdate);
		let ttdat = dat.getDate();
		return ttdat;
	}

	getDt = (dt) => {
		let tdate = dt.split(" ",1);
		return tdate[0];
	}

	packDataToDrawGraph = (gdata) => {
		let tempformn = [];
		let tempformx = [];
		let dates = [];
		let wind = [];

		let listlength = gdata.list.length;
		let d = new Date();
		let date = d.getDate();
		let ttdat = date;
		for (let i = 1; i < listlength; i++) {
			let dat = gdata.list[i].dt_txt;
			let tempdt = this.getDateFromGData(dat);
			if(ttdat!==tempdt) {
				ttdat = tempdt;
				tempformn.push(i);
			}
		}

		tempformx.push(tempformn[0]-1);
		
		for (let i = 0; i < tempformn.length; i++) {
			if (i !== tempformn.length - 1) {
				tempformx.push(tempformn[i] + 7);
			}
			else {
				tempformx.push(listlength - 1);
            }
		}

		for (let i = 0; i < tempformx.length; i++) {
		    let index = tempformx[i];
            let mxt = gdata.list[index].wind.speed;
            let dt =  this.getDt(gdata.list[index].dt_txt);
            wind.push(mxt);
			dates.push(dt);
		}

		let dataObject = {
			dts: dates,
			wnd: wind
        }
       
       /* console.log("tempformx array value => From packDataToDrawGraph in WindGraph : "+tempformx);
        console.log("maxt array value => From packDataToDrawGraph in WindGraph : "+maxt);
        console.log("dates array value => From packDataToDrawGraph in WindGraph : "+dates);*/
        return dataObject;
    }

    componentDidMount() {
		let dObject = {
			stype:'search',
			sl:'Hyderabad,IN'
		};
	    this.makeApiRequest(dObject);
    }

    componentWillReceiveProps() {
		let tsearchLoc = this.props.searchLoc();
		if (tsearchLoc === null || tsearchLoc === "" ||tsearchLoc === undefined) {
			console.log("if case tsearchLocObject value in WindGraph componentWillReceiveProps:" + tsearchLoc);
		}
		else {
			this.makeApiRequest(tsearchLoc);
			console.log(" else case tsearchLocObject property sl value in WindGraph componentWillReceiveProps:" + tsearchLoc.stype);
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
				console.log("usloc.sl value in WindGraph from makeApiRequest "+usloc);
			}
			else {
              console.log("Null or Undefined usloc.sl value in WindGraph from makeApiRequest "+usloc);
			}

		}
		else if (searchtype == 'latlon') {
			if (usloc.lat !== null && usloc.lon !== null || usloc.lat !== undefined && usloc.lon !== undefined) {
				tsloc = `lat=${usloc.lat}&lon=${usloc.lon}`;
				console.log("line 273 usloc.lat:"+usloc.lat+"and usloc.lon:"+usloc.lon+"values in WindGraph from makeApiRequest");
			}
			else {
				console.log("Null or Undefined usloc.lat and usloc.lon values in WindGraph from makeApiRequest ");
			}
		}

		if (tsloc === null || tsloc === undefined) {
			console.log("tsloc value in WindGraph makeApiRequest:" + tsloc);
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
				console.log("NewUrlRequest From WindGraph makeApiRequest: " + newurlrequest);
			}
			//console.log("NewUrlRequest From WindGraph makeApiRequest: " + newurlrequest);
		}
	}

    render() {
		if (!this.state.gdata) {
			return (
			        <div className='w3-display-container' style={{ background:'transparent',borderRadius: '8px', width: '100%'}}>
			            <div className='w3-display-middle'>
			 	       <CircularProgress  style={{ color:'#1b1d28',margin: '10px' }} size={70} />
			 	    </div>
			 	</div>
			);
		}
        return (
            <Card  className='w3-animate-zoom' style={{background:'transparent',userSelect:'none',borderRadius:'8px',width: '100%' }}>
                <div id='windg' style={{ overflowY: 'hidden', height: '250px', width: '510px' }}></div>
            </Card>
        );
    }
}
export default WindGraph;