import React, { useReducer, useRef } from "react";
// import logo from './logo.svg';
import "./App.css";
import Player from "./Player";
import { Container, Stage, Sprite, useTick } from "@inlet/react-pixi";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/player">
            <Player />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </>
  );
};

const Home = () => {
  const reducer = (_, { data }) => data
  const Bunny = () => {
    const [motion, update] = useReducer(reducer)
    const iter = useRef(0);

    useTick(delta => {
      const i = (iter.current += 0.05 * delta)

      update({
        type: 'update',
        data: {
          x: Math.sin(i) * 100,
          y: Math.sin(i / 1.5) * 100,
          rotation: Math.sin(i) * Math.PI,
          anchor: Math.sin(i / 2),
        },
      })
    })

    return (
      <Sprite
        image="https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png"
        {...motion}
      />
    )
  }

  const goToClient = e => {
    e.preventDefault();
  }

  return (
    <>
      <form onSubmit={goToClient}>
        <input name="name" type="text" />
        <input type="submit" />
      </form>
      <Stage width="300" height={300} options={{ backgroundColor: 0x1d2230 }}>
        <Container x={150} y={150}>
          <Bunny />
        </Container>
      </Stage>
    </>
  );
};
export default App;
