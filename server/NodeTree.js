const Node = require('./Node');
module.exports = class NodeTree {
  constructor(width, height) {
    this.NTWIDTH = width;
    this.NTHEIGHT = height;
    this.tree = [];
    this.polygons = [ { uniqueName: 'polyA', points: [ [-900, -900], [-300, 600], [900, 200] ] } ];
  }
  
  // newPolygon: { uniqueName: 'a nice poly', points: [ [0, 2], [1, 4] ] }
  addPolygon = (newPolygon) => {
    this.polygons.push(newPolygon);
  }

  getTree = () => {
    return this.tree;
  }

  generateTree = () => {
    // Using cartisian plotting
    new Node(this.polygons, [0, 0], this.NTWIDTH, this.tree);
    // const isPointIn = node.isPointInPolygon([5, 5], this.polygons[0].points); 
  }

  getFlatListOfFilledSquares = () => {

    return []
  }
  
}