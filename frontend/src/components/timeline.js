import React from 'react';
import { Container, Header, Button } from 'semantic-ui-react';
import Candidates from './candidates';
import {Redirect} from 'react-router-dom';

const HeaderIcon = () => (
        <Header as='h2' block textAlign="center" color="grey" style={{fontFamily: "'Montserrat', sans-serif", backgroundColor: "black"}}> 
             Welcome to Secure Voting Portal
        </Header>
  )
  

class Timeline extends React.Component {
    render(){
        if(!localStorage.hasOwnProperty('user'))
            return <Redirect exact to="" />
        return(
            <div>
                <HeaderIcon />
                <Container>
                    <Candidates />
                </Container>
            </div>
        );
    }
}


export default Timeline;