import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import Player from "./Player";
import * as PIXI from 'pixi.js'
import { Container, Stage, Sprite, Text } from "@inlet/react-pixi";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  Link,
  withRouter
} from "react-router-dom";
import { createBrowserHistory } from "history";
import io from "socket.io-client";
import axios from 'axios';

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
            <Player socket={socket} />
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

// The Screen / TV View
const Home = props => {
  const [name, setName] = useState();
  const [tickNumber, setTickNumber] = useState();
  const [actionRoundResults, setActionRoundResults] = useState();

  useEffect(() => {
    socket.on('action round results', (data) => {
      console.log('Action round data' + data);
      console.log(data)
      setActionRoundResults(data.users);
    })
  })

  const Visuals = () => {

    // temporary data for development
    const users = [{
      name: 'PETER',
      x: -170, y: -90,
      projectile: {
        x: -140, y:-120,
      },
    },{
      name: 'KRIS',
      x: 0, y:0,
      projectile: {
        x: -10, y:-80,
      },
    },{
      name: 'ARCHIE',
      x:30, y: 35,
    }];

    const terrain_views = [];

    const user_views = users.map(user => {
      return (
      <Sprite
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
        x={user.x}
        y={user.y}
        anchor={[0.5, 0.5]}
      />);
    });

    const username_views = users.map(user => {
      return (<Text
        text={user.name}
        x={user.x+5}
        y={user.y+30}
        anchor={0.5}
        style={
          new PIXI.TextStyle({
            align: 'center',
            fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
            fontSize: 15,
            fontWeight: 400,
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#01d27e',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#ccced2',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
          })
        }
      />);
    });

    const projectile_views = users
      .filter(user => user.projectile)
      .map(user => {
        return (<Text
          text="•"
          x={user.projectile.x}
          y={user.projectile.y}
        />);
      });

    return [...terrain_views, ...username_views, ...user_views, ...projectile_views];
  };

  useEffect(() => {
    // Update round count
    socket.on("tick tock", (update) => {
      console.log('tick tock' + update);
      setTickNumber(update)
    })
  }, )

  const goToClient = e => {
    if (name) {
      e.preventDefault();
      // Send the user's name to the server
      socket.emit("add user", name);
      socket.on("connect", () => {
        console.log("connection made!");
      });

      props.history.push("/player");
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
      <form onSubmit={goToClient}>
        <input
          name="name"
          type="text"
          onChange={handleUpdateName}
          value={name}
        />
        <Link to={`/player/${name}`}>Go!</Link>
      </form>
      <p>Don't press enter to connect, click the go link</p>

      <p>Namen: {name}</p>

      <button style={{cursor: 'pointer'}} onClick={resetGame}>Reset Game</button>
      <button onClick={startFirstRound}>Start First Round (everyone is in the game)</button>
      <p>TIMER: {tickNumber}</p>
      <Stage width={400} height={400} options={{ backgroundColor: 0xede2e0 }}>
        <Container x={200} y={200}>
          <Visuals />
        </Container>
      </Stage>
    </>
  );
};

const HomePage = withRouter(Home);

export default App;
