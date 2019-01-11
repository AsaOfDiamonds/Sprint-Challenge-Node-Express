import React, { Component } from 'react';
import Projects from "./components/Projects";
import axios from "axios";
import { Route, } from "react-router-dom";

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      
    };
  }

  componentDidMount() {
    axios
      .get('http://localhost:5000/api/project')
      .then(response => {
        console.log(response.data);
        this.setState({
          projects: response.data
        });
      })
      .catch(err => console.log(err));
  }

  updateProjects = projects => {
    this.setState({ projects })
  }


  render() {
    return (
      <div className="App">
        <h1>This is the Project App</h1>
        <Route
          exact path='/'
          render={(props) => (
            <Projects {...props} projects={this.state.projects} />
          )}
        />
      </div>
    );
  }
}

export default App;
