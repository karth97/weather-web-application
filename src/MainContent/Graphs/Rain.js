import React, { Component } from 'react';
import CanvasJS from '../canvasjs/canvasjs.min.js';
import Card from '@material-ui/core/Card';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

class RainGraph extends Component {
    
    constructor(props) {
        super(props);
        this.state = {}
    }

    drawGraph = (dob) => {
        let dataPoints = [];
        for (let i = 0; i < dob.dts.length; i++) {
            let dt = dob.dts[i];
            dataPoints.push({ x:new Date(dt) , y:dob.rn[i]});
        }
       // console.log("dataPoints array value => From drawGraph in RainGraph : "+dataPoints);
        var chart = new CanvasJS.Chart('raing', {
            backgroundColor: "#1b1d28",
            animationEnabled: true,
            title: {
                fontColor: "#fff",
                text: "Rain,mm"
            },
            axisX: {
                labelFontColor: "#fff",
                valueFormatString: "DDD"
            },
            axisY: {
                labelFontColor: "#fff",
                suffix: "mm",
            },
            data: [{
				connectNullData: true,
                lineThickness: 1,
                lineColor: "#00c8ff",
                markerColor: "#fff",
                type: "spline",
                indexLabel: "{y}mm",
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
		let rain = [];

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
            let mxt = null;
            let index = tempformx[i];
            let dt =  this.getDt(gdata.list[index].dt_txt);
            dates.push(dt);
			try {
				mxt = gdata.list[index].rain['3h'];
				//console.log("mxt value from try RainG: "+mxt);
				if(mxt===undefined) {
					rain.push(null);
				}
				else {
					rain.push(mxt);
				}
			}
			catch (er) {
		       //	console.log("mxt value from catch RainG: "+mxt);
			}
		}

		let dataObject = {
			dts: dates,
			rn: rain
        }
       
       //console.log("tempformx array value => From packDataToDrawGraph in RainGraph : "+tempformx);
       //console.log("rain array value => From packDataToDrawGraph in RainGraph : "+rain.length);
       //console.log("dates array value => From packDataToDrawGraph in RainGraph : "+dates);
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
			console.log("if case tsearchLocObject value in RainGraph componentWillReceiveProps:" + tsearchLoc);
		}
		else {
			this.makeApiRequest(tsearchLoc);
			console.log(" else case tsearchLocObject property sl value in RainGraph componentWillReceiveProps:" +tsearchLoc.stype);
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
				console.log("usloc.sl value in RainGraph from makeApiRequest "+usloc);
			}
			else {
              console.log("Null or Undefined usloc.sl value in RainGraph from makeApiRequest "+usloc);
			}

		}
		else if (searchtype == 'latlon') {
			if (usloc.lat !== null && usloc.lon !== null || usloc.lat !== undefined && usloc.lon !== undefined) {
				tsloc = `lat=${usloc.lat}&lon=${usloc.lon}`;
				console.log("line 273 usloc.lat:"+usloc.lat+"and usloc.lon:"+usloc.lon+"values in RainGraph from makeApiRequest");
			}
			else {
				console.log("Null or Undefined usloc.lat and usloc.lon values in RainGraph from makeApiRequest ");
			}
		}

		if (tsloc === null || tsloc === undefined) {
			console.log("tsloc value in RainGraph makeApiRequest:" + tsloc);
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
				console.log("NewUrlRequest From RainGraph makeApiRequest: " + newurlrequest);
			}
			//console.log("NewUrlRequest From TodayForecast makeApiRequest: " + newurlrequest);
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
                <div id='raing' style={{ overflowY: 'hidden', height: '250px', width: '510px' }}></div>
            </Card>
        );
    }
}
export default RainGraph;