import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import Player from "./Player";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  withRouter
} from "react-router-dom";
import Canvas from './Canvas';
import { createBrowserHistory } from "history";
import io from "socket.io-client";
import axios from 'axios';
const config = require('./config');

// Socket connection shared by both TV/viewer and Phone/Controller
const socket = io.connect("http://localhost:3001", {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 99999,
});

// Quick Routing
const App = () => {
  const customHistory = createBrowserHistory();
  return (
    <>
      <Router history={customHistory}>
        <Switch>
          <Route path="/player/:user">
            <Player />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
};


// class Animation extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { angle: 0 };
//     this.updateAnimationState = this.updateAnimationState.bind(this);
//   }
  
//   componentDidMount() {
//     this.rAF = requestAnimationFrame(this.updateAnimationState);
//   }
  
//   componentWillUnmount() {
//     cancelAnimationFrame(this.rAF);
//   }
  
//   updateAnimationState() {
//     this.setState(prevState => ({ angle: prevState.angle + 1 }));
//     this.rAF = requestAnimationFrame(this.updateAnimationState);
//   }
  
//   render() {
//     return <Canvas angle={0} terrainData={this.props.terrainData} />
//   }
// }



// The Screen / TV View
const Home = props => {
  const [name, setName] = useState();
  const [actionRoundResults, setActionRoundResults] = useState();
  const [terrainData, setTerrainData] = useState();

  const canvas_width = 600;
  const server_width = config.game.terrain.width;


  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connection made!");
    });
  })

  useEffect(() => {
    socket.on('action round results', (data) => {
      
      console.log('Action round data' + data);
      // console.log(data)
      setActionRoundResults(data.users);
    })
  })

  useEffect(() => {
    socket.on('initial game structure', (data) => {
      // console.log(data);
      setTerrainData(data.tree);
    });
  })

  const goToController = e => {
    if (name) {
      e.preventDefault();
      props.history.push(`/player/${name}`);
    }
  };

  const handleUpdateName = thing => {
    setName(thing.target.value);
  };

  const resetGame = () => {
    axios.post('http://localhost:3001/reset', {
      reset: true,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  const startFirstRound = () => {
    axios.post('http://localhost:3001/start', {
      start: true,
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }


  return (
    <>
      <form onSubmit={goToController}>
        <input
          name="name"
          type="text"
          onChange={handleUpdateName}
          value={name}
        />
        <input type="submit" value="Go!" /> 
      </form>
      <p>Don't press enter to connect, click the go link</p>

      <p>Namen: {name}</p>

      <button onClick={resetGame}>Reset Game</button>
      <button onClick={startFirstRound}>Start First Round (everyone is in the game)</button>
      <br />
      <Canvas terrainData={terrainData} />
    </>
  );
};

const HomePage = withRouter(Home);

export default App;
