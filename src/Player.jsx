import React, { useState, useEffect, } from "react";
// import logo from './logo.svg';
import "./App.css";
import { Link, withRouter } from 'react-router-dom';
import io from "socket.io-client";
const config = require('./config');

const PlayerComponent = ({match, location, history}) => {
  // Socket connection shared by both TV/viewer and Phone/Controller
  const socket = io.connect("http://localhost:3001", {
    forceNew: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 99999,
  });
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
    // Add user
    if (name) {
      socket.emit('add user', name);
    }
    return function cleanUp() {
      console.log('running cleanup, disconnect user from game')
      socket.emit('disconnect user', name)
    }
  }, [name, socket]);

  useEffect(() => {
    socket.on('action round status', (data) => {
      console.log('YAY IT HAPPENED!' + data);
      console.log(data.actionRoundOn)
      setActionsDisabled(!data.actionRoundOn);
    })
  }, [socket])
  return (
    <>
      <Link to="/">Toggle Web</Link>
      {actionsDisabled ? <div style={{width: 20, height: 20, backgroundColor: 'red'}} /> : <div style={{width: 20, height: 20, backgroundColor: 'green', borderRadius: '100'}} /> }
      <p>You are: {name}!</p>
      <label htmlFor="angle">Angle (0-360)
        <input disabled={actionsDisabled} type="number" name="angle" min="0" max="360" onChange={(e) => setAngle(e.target.value)} value={angle} />
      </label>
      <label htmlFor="power">Power (0-{config.game.player.input.maxMagnitude})
      <input disabled={actionsDisabled} type="number" name="power" min="0" max={config.game.player.input.maxMagnitude} onChange={(e) => setPower(e.target.value)} value={power} />
      </label>
    </>
  )
}
const Player = withRouter((props) => <PlayerComponent {...props} />);
export default Player;
