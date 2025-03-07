/**
 * @param {Array.<number>} v1 - Vector 1 [x, y]
 * @param {Array.<number>} v2 - Vector 2 [x, y]
 * @returns {number} - Cross product of the vectors
 */
function cross(v1, v2) {
  // Return cross product of vectors v1, v2 respectively

  return v1[0] * v2[1] - v1[1] * v2[0];
}

/**
 * @param {Array.<number>} p1 - Point 1 [x, y]
 * @param {Array.<number>} p2 - Point 2 [x, y]
 * @param {Array.<number>} p3 - Point 3 [x, y]
 * @returns {number} - Orientation of the points (CCW (1), CW (-1), Collinear (0))
 */
function getOrientation(p1, p2, p3) {
  // Orientation of 3 Points Can be
  // CCW (1), CW (-1), Collinear (0)

  const v1 = [p1[0] - p2[0], p1[1] - p2[1]];
  const v2 = [p3[0] - p2[0], p3[1] - p2[1]];

  const res = cross(v1, v2);

  if (res > 0) {
    return 1; // CCW
  } else if (res < 0) {
    return -1; // CW
  } else {
    return 0;
  }
}

/**
 * Return p1 - p2.
 * @param {Array.<number>} p1 - Point 1 [x, y]
 * @param {Array.<number>} p2 - Point 2 [x, y]
 * @returns {Array.<number>} - Result of subtracting p2 from p1
 */
function subtractPoints(p1, p2) {
  // Return p1 - p2
  return [p1[0] - p2[0], p1[1] - p2[1]];
}

/**
 * Check if two line segments intersect.
 * @param {Array.<number>} p1 - First point of the first segment.
 * @param {Array.<number>} q1 - Second point of the first segment.
 * @param {Array.<number>} p2 - First point of the second segment.
 * @param {Array.<number>} q2 - Second point of the second segment.
 * @returns {boolean} - True if the segments intersect, false otherwise.
 */
function isIntersecting(p1, q1, p2, q2) {
  const o1 = getOrientation(p1, q1, p2);
  const o2 = getOrientation(p1, q1, q2);
  const o3 = getOrientation(p2, q2, p1);
  const o4 = getOrientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  return false;
}

// Explanation:
// pseudo code for polygon castability by rotation:
// 2d coordinates are represented as a 2d array of integers
// Polygons are given as set of vertices (2d coordinates) in clockwise order
// edges are represented as pair of vertices (2d coordinates)

// Function to determine if a polygon is castable by rotation
function isPolygonCastable(polygon) {
  // Get all possible top facets
  const topFacets = getTopFacets(polygon);

  // Iterate through each top facet
  for (const topFacet of topFacets) {
    // Rotate the polygon to align with the top facet
    const rotatedPolygon = rotateToEdge(polygon, topFacet);

    // Check if the polygon is castable by rotation
    const rotationCenter = castabilityByRotation(rotatedPolygon, topFacet);

    // If a valid rotation center is found, the polygon is castable
    if (rotationCenter) {
      return {
        castable: true,
        rotationCenter: rotationCenter,
      };
    }
  }

  // If no valid rotation center is found, the polygon is not castable
  return {
    castable: false,
    rotationCenter: null,
  };
}

/**
 * Determine which edges of a polygon could be top facets.
 * @param {Array<Array<number>>} polygon - Array of 2D coordinates in clockwise order.
 * @returns {Array<Array<Array<number>>>} - Array of edges that could be top facets.
 */
function getTopFacets(polygon) {
  const n = polygon.length;
  if (n < 3) {
      return []; // Not a valid polygon
  }
  
  const res = []; // Result list to store top facets
  
  // Loop through each edge
  for (let i = 0; i < n; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % n];
      
      // Check if all other vertices lie to the same side
      let referenceOrientation = null;
      let allSameOrientation = true;
      
      // For p3 equal to each other point but p1 and p2
      for (let j = 0; j < n; j++) {
          if (j !== i && j !== (i + 1) % n) {
              const p3 = polygon[j];
              const orientation = getOrientation(p1, p2, p3);
              
              if (referenceOrientation === null) {
                  referenceOrientation = orientation;
              } else if (orientation !== referenceOrientation) {
                  allSameOrientation = false;
                  break;
              }
          }
      }
      
      // If all orientation is the same add edge to the list
      if (allSameOrientation && referenceOrientation !== null) {
          res.push([p1, p2]);
      }
  }
  
  // Return list of edges res
  return res;
}



// func rotateToEdge(polygon, topEdge)
// 	// given a polygon (set of vertices in c.w order) and it's top edge (pair of vertices)

// // if edge is not in polygon, throw error

// 	// Edit the polygon by rotating it so that the top facet is horizontal and all other edges are below it

// func castabilityByRotation( polygon, topFacet)
// // Give a polygon, and it's top facet, determine if it's castable by a clockwise rotation
// // Return the coordinates of the center of rotation or null is none exist

// // constraints = getRotationConstraints(polygon, topFacet)
// // center = solveLP(constraints)

// func getRotationConstraints(polygon, topFacet)

// 	// Given polygon and top facet, get the set of half plane constraints for rotation
// 	// Each edge (excluding top) defines a half plane constraint

// 	// For each edge e
// 		// Get the normal vector (pointing away from the mold, towards polygon center) n
// 		// if the vector points right (n.x > 0)
// 			// constraints.add( region below half plane, with direction N, passing trough bottom vertex)
// 		// else if (n.x < 0)
// 			// constraints.add ( region above half plane, direction N, passing trough top vertex

// Func solveLP(constraints)
// 	// Solve the Linear programming problem given a set of half edges as constraints.
// 	// Pick the lowest point in the valid region
// 	// return the coordinates of the point or null if no solution

// Func visualizePolygonRotation(polygon, rotationCenter){
// 	// Given the polygon which will have a horizontally aligned top facet
// 		// if no horizontally aligned top facet, throw error

// 	// Plot the polygon
// 	// Color the top facet (edge) red
// 	// if a rotation exists
// 		// Put a green point on the rotation rotationCenter coordinate
// 		// Trace the arc trajectory of a point in each edge following a clockwise rotation about the rotationCenter

// 	// if no rotation exists, write (not castable)

// }
