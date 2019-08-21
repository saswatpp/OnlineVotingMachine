import React, { Component } from 'react';
import Candidate from './candidate';
import Slider from 'react-slick';
import Axios from 'axios';

//recieve constituency id as prop get all candidates of that constituency


class CustomSlide extends Component {
    constructor(props){
      super(props);
      this.state = {
        lastVoted: false,
      }
      this.onUnvote = this.onUnvote.bind(this);
      this.onVote = this.onVote.bind(this);
    }

    onUnvote = (voted) => {
      // console.log("lastVoted maeker false")
      this.setState({lastVoted: false})
      this.props.onUnvote(voted);
    }

    onVote = (id) => {
      this.setState({lastVoted: true})
      this.props.onVote(id);
    }

    componentWillMount(){
      // Axios.get()
    }

    render() {
      var {voted} = this.props;
      var {lastVoted} = this.state;
      // console.log(lastVoted)
      return (
          <div style={{height: "100%", width: "100%", padding: "1em", display: "flex", justifyContent: "center"}}>
              <Candidate id={3} voted={voted} lastVoted={lastVoted} onUnvote={this.onUnvote} onVote={this.onVote}/>
          </div>
      );
    }
  }



export default class Candidates extends Component {
    constructor(props){
        super(props);
        this.state = {
            voted: false,
        }
    }

    handleVote = (id) => {
        this.setState({voted: true});
    }

    handleUnvote = (id) => {
      this.setState({voted: false});
    }

    render() {
      var {voted} = this.state;
        var settings = {
          infinite: true,
          speed: 500,
          slidesToShow: 3,
          slidesToScroll: 1,
          focusOnSelect: true,
          arrows: true,
        };
        return (
          <Slider {...settings}>
            <CustomSlide voted={voted} onVote={this.handleVote} onUnvote={this.handleUnvote}/> 
            <CustomSlide voted={voted} onVote={this.handleVote} onUnvote={this.handleUnvote}/> 
            <CustomSlide voted={voted} onVote={this.handleVote} onUnvote={this.handleUnvote}/> 
            <CustomSlide voted={voted} onVote={this.handleVote} onUnvote={this.handleUnvote}/> 
            <CustomSlide voted={voted} onVote={this.handleVote} onUnvote={this.handleUnvote}/> 
          </Slider>
        );
    }
}
