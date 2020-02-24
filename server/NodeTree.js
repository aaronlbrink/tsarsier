const Node = require('./Node');
module.exports = class NodeTree {
  constructor(width, height) {
    this.NTWIDTH = width;
    this.NTHEIGHT = height;
    this.polygons = [ { uniqueName: 'polyA', points: [ [-10, -10], [-10, 10], [400, 10], [400, -10] ] } ];
  }
  
  // newPolygon: { uniqueName: 'a nice poly', points: [ [0, 2], [1, 4] ] }
  addPolygon = (newPolygon) => {
    this.polygons.push(newPolygon);
  }

  generateTree = () => {
    // Using cartisian plotting
    new Node(this.polygons, [0, 0], this.NTWIDTH);
    // const isPointIn = node.isPointInPolygon([5, 5], this.polygons[0].points);
    
  }
  
}