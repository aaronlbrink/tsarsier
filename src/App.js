import React, { useReducer, useRef, useState, useEffect } from "react";
// import logo from './logo.svg';
import "./App.css";
import Player from "./Player";
import { Container, Stage, Sprite, useTick } from "@inlet/react-pixi";
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

  const reducer = (_, { data }) => data;
  const Bunny = () => {
    const [motion, update] = useReducer(reducer);
    const iter = useRef(0);

    useTick(delta => {
      const i = (iter.current += 0.05 * delta);

      update({
        type: "update",
        data: {
          x: Math.sin(i) * 100,
          y: Math.sin(i / 1.5) * 100,
          rotation: Math.sin(i) * Math.PI,
          anchor: Math.sin(i / 2)
        }
      });
    });

    return (
      <Sprite
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
        {...motion}
      />
    );
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
      <p style={{cursor: 'pointer'}} onClick={resetGame}>Reset Game</p>
      <p onClick={startFirstRound}>Start First Round (everyone is in the game)</p>
      <p>TIMER: {tickNumber}</p>
      <Stage width={300} height={300} options={{ backgroundColor: 0x1d2230 }}>
        <Container x={150} y={150}>
          <Bunny />
        </Container>
      </Stage>
    </>
  );
};

const HomePage = withRouter(Home);

export default App;
