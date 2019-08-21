import React from 'react'
import { Menu, Button, Input, Header } from 'semantic-ui-react';
import TabGraphs from './tabGraphs';
import SearchBar from './searchBar';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';

var flex = {display: 'flex', justifyContent: 'center', alignItems: 'center'};


export default class Dashboard extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username : "",
            password: "",
            active: {title: "CON1", id: "1"},
            data: {male: "22", female: "38"},
            redirect: false, 
            error: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
 
    handleChange = (event, {name, value}) => {
        //  console.log(name, value)
        this.setState({[name]: value});
    }

    handleSubmit = (event) => {
        var { username } = this.state;
        Axios.get(`http://localhost:5000/user/${username}`)
        .then(res => {
            if(res.data !== undefined){
                // console.log(res.data)
                localStorage.setItem("user", JSON.stringify(res.data.voter_info[0]));
                this.setState({redirect: true})  
            };
        })
        .catch(error => {
            console.log(error)
            this.setState({error: true})
        })
    }

    handleSelect = (active) => {
        this.setState({active: active})
    }

    componentWillMount(){
        var {active} = this.state;
        Axios.get("http://localhost:5000/stats")
        .then(res => {
            var data = res.data.stats_info;
            data = data.filter((item) => {
                return item.ConstituencyID === active.id;
            })
            // console.log(data)    
            var stats = {
                "male": data[0].MaleVotes,
                "female": data[0].FemaleVotes
            }
            // console.log(stats)
            this.setState({data: stats})
        })
        .catch(error => {
            console.log(error)
        })
    }

    render(){
        var {active, data, redirect, error} = this.state;
        // console.log(data)
        if(redirect)
            return <Redirect to="/camera"/>
        return(
            
            <div>
                <Menu secondary style={{ backgroundColor: "#213440", boxShadow: "5px 10px 10px grey", ...flex, flexDirection: 'row', margin: "0"}}>
                    <Menu.Item>
                        <Header content='Online Voting' as='h1' style={{color: "white"}}/>
                    </Menu.Item>
                    <Menu.Menu position='right' style={{width: '38%'}}>
                    <Menu.Item style={{width: '100%'}}>
                        <div style={{...flex, flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                            <Input error={error} size='mini' icon='user' placeholder='Username' name='username' onChange={this.handleChange}/>
                            <Input error={error} size='mini' icon='lock' placeholder='Passowrd' name='password' onChange={this.handleChange}/>
                            <Button size='small' icon='sign in' content='Login' compact onClick={this.handleSubmit}/>
                        </div>
                    </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <div style={{ backgroundColor: "#eff3f6", backgroundAttachment: "fixed"}}>
                    <SearchBar onSelectItem={this.handleSelect} style={{width: "70%", marginLeft: "15%"}} />
                    <TabGraphs active={active.title} data={data}/>
                </div>
            </div>
        )
    }

}
    
