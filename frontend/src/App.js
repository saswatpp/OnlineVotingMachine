import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, } from "react-router-dom";
import  Timeline  from './components/timeline';
import  Dashboard  from './components/dashboard';
import FaceCamera from './components/face';


function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Dashboard} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/camera" component={FaceCamera} />
      </div>
    </Router>
  );
}

export default App;
