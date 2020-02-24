const LOWEST_RESOLUTION = 1;
module.exports = class Node {
  constructor(polygonsToCareAbout = [], bottomLeftCoord, sideLength, NT) {
    // Polys to care about point to polys, but aren't the polys themselves
    this.polygonsToCareAbout = polygonsToCareAbout;

    this.bottomLeftCoord = bottomLeftCoord;
    this.sideLength = sideLength;

    // Generate coordanates
    const nodeCoords = this.generateSquareCoordsFromBottomLeftCoord(bottomLeftCoord, sideLength);
    this.topLeftCoord = nodeCoords.topLeft;
    this.topRightCoord = nodeCoords.topRight;
    this.bottomRightCoord = nodeCoords.bottomRight;
    
    // Useful if subdivided
    this.q1Polygons = [];
    this.q2Polygons = [];
    this.q3Polygons = [];
    this.q4Polygons = [];
    // LEAFING (base cases)
    if (this.polygonsToCareAbout.length === 0) {
      // Empty Leaf
      console.log('Empty leaf');
      NT.push({coordXY: this.bottomLeftCoord, length: sideLength, isEmpty: true})
      return;
    }
    if (this.checkIfNodeIsFilledByPoly()) {
      console.log('FILLED!');
      NT.push({coordXY: this.bottomLeftCoord, length: sideLength})
      return;
    }

    // SUBDIVIDING (recurrsion)
    if (sideLength > LOWEST_RESOLUTION) {

      // Define the start points (bottom left most point) for each sub quad.
      // All start points can be obtained by dividing the length in half.
      // The outputted quadStartCoords.topRight will be the starting coord for the top right quadrant
      const quadStartCoords = this.generateSquareCoordsFromBottomLeftCoord(bottomLeftCoord, sideLength / 2);

      for (let polygonIndex = 0; polygonIndex < this.polygonsToCareAbout.length; polygonIndex++) {
        // Quad 1 (bottom left) (same as quadStartCoords, but splitting)
        const quadBottomLeftCoords = quadStartCoords;
        this.testQuad(quadBottomLeftCoords, polygonIndex, this.q1Polygons)
        
        // if they all pass (all are false), then try test 2, see if any of the polygon's points are contained within the quadrant

        // Quad 2 (top left)
        const quadTopLeftCoords = this.generateSquareCoordsFromBottomLeftCoord(quadStartCoords.topLeft, sideLength / 2);
        this.testQuad(quadTopLeftCoords, polygonIndex, this.q2Polygons)

        // Quad 3 (top right)
        const quadTopRightCoords = this.generateSquareCoordsFromBottomLeftCoord(quadStartCoords.topRight, sideLength / 2);
        this.testQuad(quadTopRightCoords, polygonIndex, this.q3Polygons)

        // Quad 4 (bottom right)
        const quadBottomRightCoords = this.generateSquareCoordsFromBottomLeftCoord(quadStartCoords.bottomRight, sideLength / 2);
        this.testQuad(quadBottomRightCoords, polygonIndex, this.q4Polygons)

      }

      // Generate new nodes
      // Bottom left subnode
      this.subNodeBottomLeft = new Node(this.q1Polygons, quadStartCoords.bottomLeft, sideLength / 2, NT);
      // Top left subnode
      this.subNodeTopLeft = new Node(this.q2Polygons, quadStartCoords.topLeft, sideLength / 2, NT);
      // Top right subnode
      this.subNodeTopRight = new Node(this.q3Polygons, quadStartCoords.topRight, sideLength / 2, NT);
      // Bottom right subnode
      this.subNodeBottomRight = new Node(this.q4Polygons, quadStartCoords.bottomRight, sideLength / 2, NT);
    }
  }

  testQuad = (quadCoords, polygonIndex, quadPolygons) => {
    const DEBUG_METHOD = false;
    // Test 1: One of the corners of the quad is inside the polygon
    for (let qTestIndex = 0; qTestIndex < 4; qTestIndex++) {
      let qName = "";
      if (qTestIndex === 0) { qName = "bottomLeft";}
      if (qTestIndex === 1) { qName = "topLeft";}
      if (qTestIndex === 2) { qName = "topRight";}
      if (qTestIndex === 3) { qName = "bottomRight";}

      if (this.isPointInPolygon(quadCoords[qName], this.polygonsToCareAbout[polygonIndex].points)) {
        if (DEBUG_METHOD) { console.log('TEST 1: QUAD VERTEX IS INSIDE POLYGON')}
        quadPolygons.push(this.polygonsToCareAbout[polygonIndex])
        break;
      }
    }
    // Test 2: One of the points of the polygon is inside the quad (the quad is now the polygon to test by)
    for (let pointIndex = 0; pointIndex < this.polygonsToCareAbout[polygonIndex].points; pointIndex++) {
      // We have a point from the polygon
      if (this.isPointInPolygon(this.polygonsToCareAbout[polygonIndex].points[pointIndex], quadCoords)) {
        // Since in Test 1 we established "no corner of the quad is in this polygon", and here in
        // Test 2 we have established "a point of the polygon is in the quad", it must be true that
        // the quad contains the polygon, and therefore the quad should care about this polygon.
        if (DEBUG_METHOD) { console.log('TEST 2: POLYGON POINT IS INSIDE QUAD')}
        quadPolygons.push(this.polygon[polygonIndex]);
        break;
      }
    }
  }

  generateSquareCoordsFromBottomLeftCoord = (bottomLeft = [0, 0], length) => {
    const topLeft = [bottomLeft[0], bottomLeft[1] + length];
    const topRight = [bottomLeft[0] + length, bottomLeft[1] + length]
    const bottomRight = [bottomLeft[0] + length, bottomLeft[1]]
    return {
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    }
  }

  checkIfNodeIsFilledByPoly = () => {
    const DEBUG_METHOD = false;
    // Iterate through each polygon the node was told to care about
    for (let polygonIndex = 0; polygonIndex < this.polygonsToCareAbout.length; polygonIndex++) {

      // Check root point, aka bottom left (cartissian)
      const resultBottomLeft = this.isPointInPolygon(this.bottomLeftCoord, this.polygonsToCareAbout[polygonIndex].points);
      if (DEBUG_METHOD) { console.log('L BOTTOM LEFT is inside given polygon L : ' + resultBottomLeft); }

      // Check top left
      const resultTopLeft = this.isPointInPolygon(this.topLeftCoord, this.polygonsToCareAbout[polygonIndex].points);
      if (DEBUG_METHOD) { console.log('|⎺ TOP LEFT is inside given polygon |⎺ : ' + resultTopLeft)}

      // Check top right
      const resultTopRight = this.isPointInPolygon(this.topRightCoord, this.polygonsToCareAbout[polygonIndex].points);
      if (DEBUG_METHOD) { console.log('⎺| TOP RIGHT is inside given polygon ⎺| : ' + resultTopRight)}

      // Check bottom right
      const resultBottomRight = this.isPointInPolygon(this.bottomRightCoord, this.polygonsToCareAbout[polygonIndex].points);
      if (DEBUG_METHOD) { console.log('_| BOTTOM RIGHT is inside given polygon _| : ' + resultBottomRight)}

      // All 4 points defining the node are contained within the boundaries of a single polygon
      // Node should be filled
      return resultBottomLeft && resultTopLeft && resultTopRight && resultBottomRight;
    }
  }

  // point: [8, 4]
  // polygon: [  [0, 2], [4, 8], [9, 7]  ]
  isPointInPolygon(point, polygon = []) {
    const DEBUG_METHOD = false;
    let intersections = 0;
    if (DEBUG_METHOD) { console.log('start check if point is in polygon');}
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
