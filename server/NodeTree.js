const Node = require('./Node');
module.exports = class NodeTree {
  constructor(width, height) {
    this.NTWIDTH = width;
    this.NTHEIGHT = height;
    this.polygons = [ { uniqueName: 'polyA', points: [ [0, 0], [0, 10], [10, 0] ] } ];
  }
  
  // newPolygon: { uniqueName: 'a nice poly', points: [ [0, 2], [1, 4] ] }
  addPolygon = (newPolygon) => {
    this.polygons.push(newPolygon);
  }

  generateTree = () => {
    const node = new Node();
    node.checkIfPointIsInPolygon([1, 1], this.polygons[0].points);
  }
  
}