module.exports = class Node {
  constructor(polygonsToCareAbout = [], bottomLeftCoord, sideLength) {
    // Polys to care about point to polys, but aren't the polys themselves
    this.polygonsToCareAbout = polygonsToCareAbout;

    this.bottomLeftCoord = bottomLeftCoord;
    this.sideLength = sideLength;

    // LEAFING (base cases)
    if (this.polygonsToCareAbout.length === 0) {
      // Empty Leaf
      console.log('Empty leaf');
      return;
    }
    if (this.checkIfNodeIsFilledByPoly()) {
      console.log('FILLED!');
      return;
    }

    // SUBDIVIDING (recurrsion)
    // if ()
    //   new Node();
  }

  checkIfNodeIsFilledByPoly = () => {
    // Iterate through each polygon the node was told to care about
    for (let polygonIndex = 0; polygonIndex < this.polygonsToCareAbout.length; polygonIndex++) {
    // Check root point, aka bottom left (cartissian)
    const resultBottomLeft = this.isPointInPolygon(this.bottomLeftCoord, this.polygonsToCareAbout[polygonIndex].points);
    console.log('L BOTTOM LEFT is inside given polygon L : ' + resultBottomLeft);

    // Check top left
    const resultTopLeft = this.isPointInPolygon([this.bottomLeftCoord[0], this.bottomLeftCoord[1] + this.sideLength], this.polygonsToCareAbout[polygonIndex].points);
    console.log('|⎺ TOP LEFT is inside given polygon |⎺ : ' + resultTopLeft)

    // Check top right
    const resultTopRight = this.isPointInPolygon([this.bottomLeftCoord[0] + this.sideLength, this.bottomLeftCoord[1] + this.sideLength], this.polygonsToCareAbout[polygonIndex].points);
    console.log('⎺| TOP RIGHT is inside given polygon ⎺| : ' + resultTopRight)

    // Check bottom right
    const resultBottomRight = this.isPointInPolygon([this.bottomLeftCoord[0] + this.sideLength, this.bottomLeftCoord[1]], this.polygonsToCareAbout[polygonIndex].points);
    console.log('_| BOTTOM RIGHT is inside given polygon _| : ' + resultBottomRight)
    }
  }

  // point: [8, 4]
  // polygon: [  [0, 2], [4, 8], [9, 7]  ]
  isPointInPolygon(point, polygon = []) {
    const DEBUG_METHOD = false;
    let intersections = 0;
    console.log('start check if point is in polygon');
    // Iterate over number of lines in polygon (number of points divided by two, plus the connecting line at between the end node and the first node)
    for (let pointIndex = 0; pointIndex < polygon.length; pointIndex++ ) {
      if (DEBUG_METHOD) { console.log('--LINE #' + (pointIndex + 1) + '--') }
      // Set start and end points for the line
      const linePoint1 = polygon[pointIndex];
      let linePoint2;
      if ((pointIndex + 1) === polygon.length) {
        // pointIndex is the last point, use the first point as linePoint2
        linePoint2 = polygon[0];
      } else {
        linePoint2 = polygon[pointIndex + 1];
      }
      if (DEBUG_METHOD) { console.log('Using line points: ' + linePoint1 + ' and ' + linePoint2) }

      // Invalid Scenarios
      // According to the UofM article (cited further below), there are some instances of lines which should not be counted
      // as intersections. These include horizontal lines, line vertices lying on the imaginary ray
      // Horizontal lines
      if (linePoint2[1] - linePoint1[1] === 0) {
        if (DEBUG_METHOD) { console.log('EDGE CASE: the line is horizontal'); }
      }
      // Line vertex is on imaginary ray
      if (linePoint1[1] === point[1] || linePoint2[1] === point[1]) {
        if (DEBUG_METHOD) { console.log('EDGE CASE: one of the line vertices started on the imaginary ray'); }
        continue;
      }

      // Test range match: point is between linePoint1's value and linePoint2's value
      if (point[1] > Math.min(linePoint1[1], linePoint2[1]) && point[1] < Math.max(linePoint1[1], linePoint2[1])) {
        // Range matched!
        
        // Continue to domain tests:
        if (linePoint2[0] - linePoint1[0] === 0) {
          // Slope is inifinity, Test as a vertical line 
          // Test domain match: Grab any [x, y] pair (since x is the same for all y's) and check if x is after the test point's x
          if (linePoint1[0] > point[0]) {
            // There must be an intersection along the imaginary line, parellel to the x-axis, going right from the test point
            if (DEBUG_METHOD) { console.log('INTERSECT: Vertical Line') }
            intersections++;
            continue;
          }
        }
        const m = ((linePoint2[1] - linePoint1[1]) / (linePoint2[0] - linePoint1[0]));
        const b = linePoint1[1] - (m * linePoint1[0]);
        const x = (point[1] - b) / m;
        if (DEBUG_METHOD) { console.log('slope: ' + m + ' y-intercept: ' + b); }

        // Test domain match: 
        if (x > point[0]) {
          if (DEBUG_METHOD) { console.log('INTERSECT: Line with slope') }
          // Based on the conditions, there must have been an intersection over an imaginary line extending from the point, parallel to the x-axis, continuing right.
          // We add this intersection to the intersection count, according to the UMich site,
          // http://www.eecs.umich.edu/courses/eecs380/HANDOUTS/PROJ2/InsidePoly.html
          // if there are an even number of intersections, the point is outside the polygon
          intersections++;
        }
      }
      if (DEBUG_METHOD) { console.log('-- ---') }
    }
    if (DEBUG_METHOD) { console.log('total line intersections: ' + intersections) }
    return intersections % 2 === 1;
  }
}
