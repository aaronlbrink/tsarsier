import React from 'react';
import PureCanvas from './PureCanvas';

export default class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.saveContext = this.saveContext.bind(this);
  }

  saveContext(ctx) {
    this.ctx = ctx;
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
  }

  componentDidUpdate() {
    this.ctx.save();
    this.ctx.font = '48px serif';
    this.ctx.fillText('Hello world', 10, 50);
    const columns = Array(40);
    let i = 0;
    columns.map(function(col, a) {
      this.ctx.fillRect(i++, 0, 1, this.height - 20)
      return this.ctx.fillRect(i, 0, 1, this.height - 20)
    });
    this.ctx.fillRect(0, 0, 1, this.height)
    this.ctx.fillRect(1, 0, 1, this.height - 80)
    this.ctx.fillRect(3, 0, 1, this.height - 80)
    this.ctx.clearRect(0, 0, 40, 40);
    
    // this.ctx.translate(this.width / 2, this.height / 2);
    // this.ctx.rotate((angle * Math.PI) / 180);
    this.ctx.fillStyle = '#4397AC';
    // this.ctx.fillRect(
    //   -this.width / 4,
    //   -this.height / 4,
    //   this.width / 2,
    //   this.height / 2
    // );
    this.ctx.restore();
  }

  render() {
    return <PureCanvas contextRef={this.saveContext} />;
  }
}