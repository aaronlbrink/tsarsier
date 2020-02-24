import React, {useEffect } from 'react';

const Canvas = (props) => {
  // constructor(props) {
  //   super(props);
  //   saveContext = saveContext.bind(this);
  // }

  const canvasRef = React.useRef(null)

  useEffect(() => {
    console.log('canvas!')
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d');
    
    // ctx.font = '48px serif';
    // ctx.fillText('Hello world', 10, 50);
    // const columns = Array(40);
    // let i = 0;
    // columns.map(function(col, a) {
    //   ctx.fillRect(i++, 0, 1, height - 20)
    //   return ctx.fillRect(i, 0, 1, height - 20)
    // });
    console.log(props.terrainData)
    if (props.terrainData) {
      for (let boxIndex = 0; boxIndex < props.terrainData.length; boxIndex++) {
        if (props.terrainData[boxIndex].isEmpty) {
          // Create empty box
          ctx.clearRect(props.terrainData[boxIndex].coordXY[0], props.terrainData[boxIndex].coordXY[1], props.terrainData[boxIndex].length, props.terrainData[boxIndex].length);
          continue;
        }
        
        // Create filled box
        ctx.fillRect(props.terrainData[boxIndex].coordXY[0], props.terrainData[boxIndex].coordXY[1], props.terrainData[boxIndex].length, props.terrainData[boxIndex].length);
        console.log("CREATED BOX: " + props.terrainData[boxIndex].coordXY[0], props.terrainData[boxIndex].coordXY[1], props.terrainData[boxIndex].length, props.terrainData[boxIndex].length)
      }
    }
    // ctx.fillRect(30, 30, 31, height - 80)
    // ctx.clearRect(0, 0, 40, 40);
    // ctx.translate(width / 2, height / 2);
    // ctx.rotate((angle * Math.PI) / 180);
    ctx.fillStyle = '#4397AC';
    // ctx.fillRect(
    //   -width / 4,
    //   -height / 4,
    //   width / 2,
    //   height / 2
    // );
    ctx.restore();
  }, [props.terrainData])

  return <canvas
    width="900"
    height="900"
    ref={canvasRef}
    style={{border: '1px solid red'}}
  />
}

export default Canvas;