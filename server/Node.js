module.exports = class Node {
  constructor(polygonsToCareAbout, topLeftCoord, bottomRightCoord) {
    // Polys to care about point to polys, but aren't the polys themselves
    this.polygonsToCareAbout = polygonsToCareAbout = [];

    this.topLeftCoord = topLeftCoord;
    this.bottomRightCoord = bottomRightCoord;

    // LEAFING (base cases)
    if (this.polygonsToCareAbout.length === 0) {
      // Empty Leaf
      console.log('Empty leaf');
      return;
    }
    if (this.nodeIsFilledByPoly()) {
      console.log('FILLED!');
      return;
    }

    // SUBDIVIDING (recurrsion)
    // if ()
    //   new Node();
  }

  nodeIsFilledByPoly = () => {
    // Check point 1

    // Check point 2

    // Check point 3

    // Check point 4
  }

  // point: [8, 4]
  // polygon: [  [0, 2], [4, 8], [9, 7]  ]
  checkIfPointIsInPolygon(point, polygon = []) {
    console.log('start check if point is in polygon')
    // Iterate over number of lines in polygon (number of points divided by two, plus the connecting line at between the end node and the first node)
    for (let pointIndex = 0; pointIndex < polygon.length; pointIndex++ ) {
      console.log('--LINE #' + (pointIndex + 1) + '--')
      // Set start and end points for the line
      const linePoint1 = polygon[pointIndex];
      let linePoint2;
      if ((pointIndex + 1) === polygon.length) {
        // pointIndex is the last point, use the first point as linePoint2
        linePoint2 = polygon[0];
      } else {
        linePoint2 = polygon[pointIndex + 1];
      }
      console.log('Using line points: ' + linePoint1 + ' and ' + linePoint2)

      // Test range match: point is between linePoint1's value and linePoint2's value
      if (point[1] > Math.min(linePoint1[1], linePoint2[1]) && point[1] < Math.max(linePoint1[1], linePoint2[1])) {
        // Range matched!
        console.log('the range matched!')
        // Test domain match: 
        const m = ((linePoint2[1] - linePoint1[1]) / (linePoint2[0] - linePoint1[0]));
        const b = linePoint1[1] - (m * linePoint1[0]);
        console.log('slope: ' + m + ' y-intercept: ' + b);
      }
    }
  }
}
