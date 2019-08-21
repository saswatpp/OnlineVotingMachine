import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import ConfirmButton from './confirm';
import Axios from 'axios';


class Candidate extends React.Component{

    constructor(props){
        super(props);
        this.handleVote = this.handleVote.bind(this);
        this.handleUnvote = this.handleUnvote.bind(this);
        this.handleCardSelect = this.handleCardSelect.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleUnvote = (event) => {
      var { onUnvote, id } = this.props;
      onUnvote(id)
      console.log("unvote")
    }

    handleVote = (event) => {
        var { onVote, id } = this.props;
        onVote(id);
        console.log(id);
    }
    

    handleCardSelect = (event) => {
      event.stopPropagation();
    }

    handleClick(e){
      var {lastVoted} = this.props;
      console.log(lastVoted)
      if(lastVoted)
        this.handleUnvote(e);
      else 
        this.handleVote(e);
    }


    render(){
        var { lastVoted, voted } = this.props;
        var classs = "";
        if(lastVoted)
          classs = "overlay";
        return(
          <div>
             <Card onClick={this.handleCardSelect} id={classs}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped/>
                <Card.Content>
                  <Card.Header>Matthew</Card.Header>
                  <Card.Meta>
                    <span className='date'>Joined in 2015</span>
                  </Card.Meta>
                  <Card.Description>
                    Matthew is a musician living in Nashville.
                  </Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <ConfirmButton onClick={this.handleClick} active={!voted} lastVoted={lastVoted}/>
                </Card.Content>
              </Card>
          </div>
        );
    }

}

export default Candidate;