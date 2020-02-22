import React, { useState, useEffect, } from "react";
// import logo from './logo.svg';
import "./App.css";
import { Link, withRouter } from 'react-router-dom';
const config = require('./config');
// import { Container, Stage, Sprite, useTick } from "@inlet/react-pixi";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

const PlayerComponent = ({socket, match, location, history}) => {

  // USER STATE
  const [name, setName] = useState(match.params.user);

  // GAME STATE
  const [actionsDisabled, setActionsDisabled] = useState(true);

  // USER INPUT STATE
  // const [actionsEnabled, setActionsEnabled] = useState(false);
  const [angle, setAngle] = useState(0);
  const [power, setPower] = useState(0);

  useEffect(() => {
    // Send power adjustment (on each input update)
    console.log('effect ran!');
    socket.emit('power move', power, name);
  }, [power, name, socket])

  useEffect(() => {
    // Send angle adjustment (on each input update)
    socket.emit('angle move', angle, name);
  }, [angle, name, socket])

  useEffect(() => {
    // Get and set user's name from url params
    setName(match.params.user)
  }, [match.params.user]);

  useEffect(() => {
    if (!socket.connected) {
      // Try connecting
      socket.emit('add user', name);
      socket.on('connect', () => {
        console.log('connection made!')
      });
    }
  }, [name, socket]);

  useEffect(() => {
    socket.on('action round status', (data) => {
      console.log('YAY IT HAPPENED!' + data);
      console.log(data.actionRoundOn)
      setActionsDisabled(!data.actionRoundOn);
    })
  })
  return (
    <>

      <Link to="/">Toggle Web</Link>
      <p>You are: {name}!</p>
      <label htmlFor="angle">Angle (0-360)
        <input disabled={actionsDisabled} type="number" name="angle" min="0" max="360" onChange={(e) => setAngle(e.target.value)} value={angle} />
      </label>
      <label  htmlFor="power">Power (0-{config.game.player.input.maxMagnitude})
      <input disabled={actionsDisabled} type="number" name="power" min="0" max={config.game.player.input.maxMagnitude} onChange={(e) => setPower(e.target.value)} value={power} />
      </label>
    </>
  )
}
const Player = withRouter((props) => <PlayerComponent {...props} />);
export default Player;
