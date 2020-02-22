import React from "react";
// import logo from './logo.svg';
import "./App.css";
import { Stage, Sprite } from "@inlet/react-pixi";
// import { Stage, Container, Sprite, withPixiApp } from ReactPixi;

function App() {
  return (
    <Stage width={500} height={500} options={{ backgroundColor: 0xeef1f5 }}>
      <Sprite image="./bunny.png" x={100} y={100} />
    </Stage>
  );
}

export default App;
