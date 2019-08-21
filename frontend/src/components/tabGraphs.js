import React, { Component } from 'react'
import { Header } from 'semantic-ui-react';

const style = {
  borderRadius:"5px",
  backgroundColor: "white", 
  margin: "2em 0 1em 0", 
  boxShadow: "0 0 7px grey", 
  padding: "2em",
}


export default class TabGraphs extends Component {
    constructor(props){
      super(props);
      this.state = {
        barChart: {},
        pieChartMale: {},
        pieChartFemale: {}
      }
    }

    componentDidMount(){
        var { barChart, pieChartMale, pieChartFemale } = this.state;
        barChart = new window.Chart(document.getElementById("bar-graph").getContext('2d'), {
            type: 'bar',
            data: {
              labels: [
                "2018-19",
                "2017-18",
                "2018-19",
                "2017-18",
                ],
              datasets: [{
                type: "line",
                label: "Number of literate",
                data: [59,23,89,34],
                borderColor: "#F0A24A",
                backgroundColor: "rgba(0,0,0,0)"
              },{
                 label: "Number of votes",
                 backgroundColor: ["#80B8C1","#307073","#56A1BF","#284B59"],
                 data: [243,211,231,112]
              }]
            },
            options: {
              tooltips: {
                enabled: true
              },
              title: {
                display: true,
                text: 'Last year v/s Current year',
                fontSize: 20,
                padding: 20
              },
              scales: {
                 xAxes: [{
                    ticks: {
                       autoSkip: false,
                       maxRotation: 90,
                       minRotation: 0
                     }
                 }],
                 yAxes: [{
                    ticks: {
                       beginAtZero: true
                    },
                    scaleLabel: {
                       display: true,
                       labelString: 'Number of Candidates'
                    }
                 }]
              }
            }
        
        })


        pieChartMale = new window.Chart(document.getElementById("male-percentage"), {
            type: 'pie',
            data: {
              labels: [
                "Males Voted",
                "Males Registered",
              ],
              datasets: [{
                label: "Label",
                backgroundColor: ["#88898C", "#D9D9D9"],
                data: [
                "30",
                "70",
              ]
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Male Voting Percentage',
                fontSize: 20,
                padding: 20
              }
            }
        });
        
        pieChartFemale = new window.Chart(document.getElementById("female-percentage"), {
            type: 'pie',
            data: {
              labels: [
                "Females Voted",
                "Females Registered",
              ],
              datasets: [{
                label: "Label",
                backgroundColor: ["#2B2E38", "#D3DEE3"],
                data: [
                "55",
                "45",
              ]
              }]
            },
            options: {
              title: {
                display: true,
                text: 'Female Voting Percentage',
                fontSize: 20,
                padding: 20
              }
            }
        });

        this.setState({barChart:barChart, pieChartMale: pieChartMale, pieChartFemale: pieChartFemale})
    }

    render() {
      var {active, data} = this.props;
      var {pieChartFemale, pieChartMale} = this.state;
      if(pieChartMale.data !== undefined){
        pieChartMale.data.datasets[0].data[0] = data.male;
        pieChartMale.data.datasets[0].data[1] = 100 - parseInt(data.male);
        pieChartMale.update();
      }
      if(pieChartMale.data !== undefined){
        pieChartFemale.data.datasets[0].data[0] = data.female;
        pieChartFemale.data.datasets[0].data[1] = 100 - parseInt(data.female);
        pieChartFemale.update();
      }
      // console.log(data)
        return (
            <div style={{width: "70%", marginLeft: "15%"}}>
                    <Header style={{ textAlign: "center"}} content={"You are seeing the stats for "+active+ " constituency" } as="h3"/>
                    <canvas style={{...style, margin: "0em 0 1em 0"}} id='male-percentage'></canvas>
                    <canvas style={style} id='female-percentage'></canvas>
                    <canvas style={style} id='bar-graph'></canvas>
            </div>
        )
    }
}
