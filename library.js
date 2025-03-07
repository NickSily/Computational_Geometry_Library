/**
 * @param {Array.<number>} p1 - Point 1 [x, y]
 * @param {Array.<number>} p2 - Point 2 [x, y]
 * @returns {number} - Angle between the points
 */
export function getAngle(p1, p2) {
  // return c.c.w. angle from horizontal to p1-p2 segment

  const dx = p2[0] - p1[0];
  const dy = -(p2[1] - p1[1]);
  // Flipping dy since y axis if flipped on display

  if (dx == 0) {
    if (dy > 0) {
      return Math.PI / 2;
    }
    return (3 * Math.PI) / 2;
  }

  if (dx > 0) {
    if (dy > 0) {
      // Q1
      return Math.atan(dy / dx);
    }
    // Q4
    if (dy < 0) return Math.atan(dy / dx) + Math.PI * 2;
    // dy = 0
    return 0;
  }

  if (dx < 0) {
    // Q2 or Q3
    return Math.atan(dy / dx) + Math.PI;
  }
}

/**
 * @param {Array.<number>} refPoint - Reference point [x, y]
 * @returns {Function} - Comparator function for sorting points by angle
 */
export function compareAngle(refPoint) {
  // Return comparator function
  return (a, b) => {
    // Return difference of angles with reference Point
    return getAngle(refPoint, a) - getAngle(refPoint, b);
  };
}

/**
 * @param {Array.<number>} v1 - Vector 1 [x, y]
 * @param {Array.<number>} v2 - Vector 2 [x, y]
 * @returns {number} - Cross product of the vectors
 */
export function cross(v1, v2) {
  // Return cross product of vectors v1, v2 respectively

  return v1[0] * v2[1] - v1[1] * v2[0];
}

/**
 * @param {Array.<number>} p1 - Point 1 [x, y]
 * @param {Array.<number>} p2 - Point 2 [x, y]
 * @param {Array.<number>} p3 - Point 3 [x, y]
 * @returns {number} - Orientation of the points (CCW (1), CW (-1), Collinear (0))
 */
export function getOrientation(p1, p2, p3) {
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
export function subtractPoints(p1, p2) {
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
function doIntersect(p1, q1, p2, q2) {
  const o1 = getOrientation(p1, q1, p2);
  const o2 = getOrientation(p1, q1, q2);
  const o3 = getOrientation(p2, q2, p1);
  const o4 = getOrientation(p2, q2, q1);

  if (o1 !== o2 && o3 !== o4) {
    return true;
  }

  return false;
}


/**
 * Check if a polygon is simple (no self-intersections).
 * @param {Array.<Array.<number>>} polygon - Array of [x, y] coordinates representing the polygon vertices.
 * @returns {boolean} - True if the polygon is simple, false otherwise.
 */
function isSimplePolygon(polygon) {
  const n = polygon.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 2; j < n; j++) {
      if (i === 0 && j === n - 1) continue;
      if (
        doIntersect(
          polygon[i],
          polygon[(i + 1) % n],
          polygon[j],
          polygon[(j + 1) % n]
        )
      ) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Generate a random simple polygon with a specified number of vertices.
 * @param {number} numVertices - Number of vertices.
 * @returns {Array.<Array.<number>>} - Array of [x, y] coordinates representing the polygon vertices.
 */
function generateRandomSimplePolygon(numVertices) {
  let polygon;
  do {
    polygon = generateRandomPolygon(numVertices);
  } while (!isSimplePolygon(polygon));
  return polygon;
}


/**
 * Generate a random polygon with a specified number of vertices.
 * @param {number} numVertices - Number of vertices.
 * @returns {Array.<Array.<number>>} - Array of [x, y] coordinates representing the polygon vertices.
 */
function generateRandomPolygon(numVertices) {
  const points = [];
  for (let i = 0; i < numVertices; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    points.push([x, y]);
  }
  return points;
}
