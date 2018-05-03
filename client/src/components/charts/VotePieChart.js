import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from 'react-chartjs-2'

class VotePieChart extends Component {


	getRandomColor() {
	    var letters = '0123456789ABCDEF'.split('');
	    var color = '#';
	    for (var i = 0; i < 6; i++ ) {
	        color += letters[Math.floor(Math.random() * 16)];
	    }
	    return color;
	 	}

	generateColors(number){	
		let colorArray = [];
		for (let i = 0; i < number; i++) {
			colorArray.push(this.getRandomColor());
		}


		return colorArray;
	}


	generateData(){

		const labels = this.generateLabels(this.props.data);
		const voteData =  this.generateOptions(this.props.data);
		const backgroundColors = this.generateColors(voteData.length);

		let data = {
	        labels: labels,
	        datasets: [{	  
	            data: voteData,
	            backgroundColor: backgroundColors
	        }]
	    }	    
	    return data;
	}

	generateOptions(data){

		let dataArray = [];


		data.forEach(option => {

			if (option.score > 0) dataArray.push(option.score)
		});
	
		return dataArray;
	

	}

	generateLabels(data){

		let labelArray = [];
		
		data.forEach(option => {

			if (option.score > 0) labelArray.push(option.option)
		});

		return labelArray;
	
	}



	render(){
	
		return(
			<div className="chart">
				<Pie data={() => this.generateData()} />
			</div>
		)
	}

}

export default VotePieChart