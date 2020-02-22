import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { Link } from 'react-router-dom';
// import { Container, Stage, Sprite, useTick } from "@inlet/react-pixi";
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

const Player = () => {


  return (
<>
  <Link to="/">Toggle Web</Link>
  <div className="button" onPress={() => {  }} style={{margin: 5, width: '100%', height: '30vh', backgroundColor: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    FIRE
  </div>
  <div style={{display: 'flex'}}>
    <div className="button" onPress={() => {  }} style={{margin: 5, width: '100%', height: '30vh', backgroundColor: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      /|
    </div>
    <div className="button" onPress={() => {  }} style={{margin: 5, width: '100%', height: '30vh', backgroundColor: 'grey', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      |/
    </div>
  </div>
</>
  )
}
export default Player;
