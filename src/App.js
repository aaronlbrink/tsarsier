import React, { useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import Player from "./Player";
import * as PIXI from 'pixi.js'
import { Container, Stage, Sprite, Text, Graphics } from "@inlet/react-pixi";
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

    // These fake users are just for development
    const users = [{
      name: 'PETER',
      x: 340, y: 100,
      projectile: {
        x: 310, y:140,
      },
    },{
      name: 'KRIS',
      x: 200, y:70,
      projectile: {
        x: 160, y:100,
      },
    },{
      name: 'ARCHIE',
      x:50, y: 90,
    }];
    // This fake terrain is just for development
    const cell_x_coordinates = [...Array(200).keys()].map(i => i*2);
    const terrain_ground_cells = cell_x_coordinates.flatMap(x =>
        [...Array(20+Math.floor(Math.random()*20)).keys()].map(i => i*2).map(y => 
          ({x:x, y:y})));

    function transform_coordinate(server_x, server_y) {
      // The server thinks (0,0) is the bottom-left and (400,400) is the top-right.
      // PIXI.js thinks (0,0) is the top-left and (400,400) is the bottom-right.
      // Later we'll dynamically change the width of the <canvas> requiring more code here.
      return [server_x, 400-server_y];
    }

    const blockSize = 2; // todo: fetch from config.game.terrain.blockSize;
    const terrain_views = terrain_ground_cells.map(cell => {
      const [x, y] = transform_coordinate(cell.x, cell.y);
      return (
      <Graphics
        draw={g => {
          g.clear()
          g.beginFill(0x9b7653)
          g.moveTo(x, y)
          g.lineTo(x + blockSize, y)
          g.lineTo(x + blockSize, y + blockSize)
          g.lineTo(x, y + blockSize)
          g.endFill()
        }}
      />
      );
    });

    const user_views = users.map(user => {
      const [x, y] = transform_coordinate(user.x, user.y);
      return (
      <Sprite
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
        x={x}
        y={y}
        anchor={[0.5, 0.5]}
      />);
    });

    const username_views = users.map(user => {
      const [x, y] = transform_coordinate(user.x, user.y);
      return (<Text
        text={user.name}
        x={x+5}
        y={y+30}
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
        const [x, y] = transform_coordinate(user.projectile.x, user.projectile.y);
        return (<Text
          text="•"
          x={x}
          y={y}
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
        <Container x={0} y={0}>
          <Visuals />
        </Container>
      </Stage>
    </>
  );
};

const HomePage = withRouter(Home);

export default App;
