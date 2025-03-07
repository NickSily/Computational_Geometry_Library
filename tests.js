// This file contains both the geometry functions and test cases

// ===== Library Functions =====

/**
 * @param {Array.<number>} p1 - Point 1 [x, y]
 * @param {Array.<number>} p2 - Point 2 [x, y]
 * @returns {number} - Angle between the points
 */
function getAngle(p1, p2) {
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
  function compareAngle(refPoint) {
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
  
  // ===== Test Suite =====
  
  // Run all tests
  function runAllTests() {
    console.log("=== Running Geometry Library Tests ===");
  
    const results = {
      getAngle: testGetAngle(),
      compareAngle: testCompareAngle(),
      cross: testCross(),
      getOrientation: testGetOrientation(),
      subtractPoints: testSubtractPoints(),
      doIntersect: testDoIntersect(),
      isSimplePolygon: testIsSimplePolygon()
    };
    
    console.log("\n=== Test Summary ===");
    for (const [testName, passed] of Object.entries(results)) {
      console.log(`${testName}: ${passed ? '✓ PASSED' : '✗ FAILED'}`);
    }
    
    const totalPassed = Object.values(results).filter(Boolean).length;
    const totalTests = Object.values(results).length;
    
    console.log(`\nOverall: ${totalPassed}/${totalTests} tests passed`);
  }
  
  // Call runAllTests to execute all tests
  runAllTests();
  
  // Test getAngle function
  function testGetAngle() {
    console.log("\n=== Testing getAngle function ===");
    
    // Test cases for different quadrants
    // NOTE: The coordinate system is flipped in the y-axis in the library's implementation,
    // so the expected angles need to be adjusted accordingly
    const testCases = [
      { p1: [0, 0], p2: [1, 0], expected: 0, description: "0 degrees (horizontal right)" },
      { p1: [0, 0], p2: [1, 1], expected: (Math.PI * 1.75), description: "315 degrees (bottom right)" },
      { p1: [0, 0], p2: [0, 1], expected: (Math.PI * 1.5), description: "270 degrees (straight down)" },
      { p1: [0, 0], p2: [-1, 1], expected: (Math.PI * 1.25), description: "225 degrees (bottom left)" },
      { p1: [0, 0], p2: [-1, 0], expected: Math.PI, description: "180 degrees (horizontal left)" },
      { p1: [0, 0], p2: [-1, -1], expected: (Math.PI * 0.75), description: "135 degrees (top left)" },
      { p1: [0, 0], p2: [0, -1], expected: (Math.PI * 0.5), description: "90 degrees (straight up)" },
      { p1: [0, 0], p2: [1, -1], expected: (Math.PI * 0.25), description: "45 degrees (top right)" },
      { p1: [5, 5], p2: [8, 4], expected: (Math.PI * 0.25), description: "45 degrees (from non-origin point)" }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = getAngle(test.p1, test.p2);
      const isClose = Math.abs(result - test.expected) < 0.0001;
      
      console.log(`Case: ${test.description}`);
      console.log(`  Points: [${test.p1}] and [${test.p2}]`);
      console.log(`  Expected: ${test.expected.toFixed(4)} (${(test.expected * 180 / Math.PI).toFixed(2)}°)`);
      console.log(`  Actual: ${result.toFixed(4)} (${(result * 180 / Math.PI).toFixed(2)}°)`);
      console.log(`  Result: ${isClose ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isClose) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for getAngle`);
    return passCount === testCases.length;
  }
  
  // Test compareAngle function
  function testCompareAngle() {
    console.log("\n=== Testing compareAngle function ===");
    
    const refPoint = [0, 0];
    const points = [
      [0, -1],  // 270 degrees
      [1, 0],   // 0 degrees
      [0, 1],   // 90 degrees
      [-1, 0]   // 180 degrees
    ];
    
    const expectedOrder = [
      [1, 0],   // 0 degrees
      [0, 1],   // 90 degrees
      [-1, 0],  // 180 degrees
      [0, -1]   // 270 degrees
    ];
    
    console.log("Original points:");
    console.log(points);
    
    const sortedPoints = [...points].sort(compareAngle(refPoint));
    
    console.log("Sorted by angle (counter-clockwise from positive x-axis):");
    console.log(sortedPoints);
    
    let isCorrect = true;
    for (let i = 0; i < expectedOrder.length; i++) {
      if (sortedPoints[i][0] !== expectedOrder[i][0] || sortedPoints[i][1] !== expectedOrder[i][1]) {
        isCorrect = false;
        break;
      }
    }
    
    console.log(`Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
    return isCorrect;
  }
  
  // Test cross function
  function testCross() {
    console.log("\n=== Testing cross function ===");
    
    const testCases = [
      { v1: [1, 0], v2: [0, 1], expected: 1, description: "Perpendicular vectors (positive)" },
      { v1: [0, 1], v2: [1, 0], expected: -1, description: "Perpendicular vectors (negative)" },
      { v1: [1, 0], v2: [2, 0], expected: 0, description: "Parallel vectors" },
      { v1: [3, 4], v2: [5, 2], expected: -14, description: "Arbitrary vectors" }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = cross(test.v1, test.v2);
      const isCorrect = result === test.expected;
      
      console.log(`Case: ${test.description}`);
      console.log(`  Vectors: [${test.v1}] and [${test.v2}]`);
      console.log(`  Expected: ${test.expected}`);
      console.log(`  Actual: ${result}`);
      console.log(`  Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isCorrect) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for cross`);
    return passCount === testCases.length;
  }
  
  // Test getOrientation function
  function testGetOrientation() {
    console.log("\n=== Testing getOrientation function ===");
    
    // NOTE: Due to the flipped y-axis in the library, the orientation results are also flipped
    // (i.e., what would normally be CCW is CW in this implementation, and vice versa)
    const testCases = [
      { 
        p1: [0, 0], p2: [1, 0], p3: [1, 1], 
        expected: -1, 
        description: "Clockwise orientation (flipped y-axis)" 
      },
      { 
        p1: [0, 0], p2: [1, 1], p3: [1, 0], 
        expected: 1, 
        description: "Counter-clockwise orientation (flipped y-axis)" 
      },
      { 
        p1: [0, 0], p2: [1, 1], p3: [2, 2], 
        expected: 0, 
        description: "Collinear points" 
      },
      { 
        p1: [3, 1], p2: [5, 4], p3: [7, 2], 
        expected: 1, 
        description: "Arbitrary points (counter-clockwise with flipped y-axis)" 
      }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = getOrientation(test.p1, test.p2, test.p3);
      const isCorrect = result === test.expected;
      
      console.log(`Case: ${test.description}`);
      console.log(`  Points: [${test.p1}], [${test.p2}], [${test.p3}]`);
      console.log(`  Expected: ${test.expected} (${
        test.expected === 1 ? 'CCW' : test.expected === -1 ? 'CW' : 'Collinear'
      })`);
      console.log(`  Actual: ${result} (${
        result === 1 ? 'CCW' : result === -1 ? 'CW' : 'Collinear'
      })`);
      console.log(`  Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isCorrect) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for getOrientation`);
    return passCount === testCases.length;
  }
  
  // Test subtractPoints function
  function testSubtractPoints() {
    console.log("\n=== Testing subtractPoints function ===");
    
    const testCases = [
      { p1: [5, 7], p2: [2, 3], expected: [3, 4], description: "Positive coordinates" },
      { p1: [0, 0], p2: [5, 5], expected: [-5, -5], description: "From origin" },
      { p1: [-3, -4], p2: [2, 3], expected: [-5, -7], description: "Negative coordinates" },
      { p1: [10, 20], p2: [10, 20], expected: [0, 0], description: "Identical points" }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = subtractPoints(test.p1, test.p2);
      const isCorrect = result[0] === test.expected[0] && result[1] === test.expected[1];
      
      console.log(`Case: ${test.description}`);
      console.log(`  Points: [${test.p1}] - [${test.p2}]`);
      console.log(`  Expected: [${test.expected}]`);
      console.log(`  Actual: [${result}]`);
      console.log(`  Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isCorrect) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for subtractPoints`);
    return passCount === testCases.length;
  }
  
  // Test isSimplePolygon function
  function testIsSimplePolygon() {
    console.log("\n=== Testing isSimplePolygon function ===");
    
    const testCases = [
      { 
        polygon: [[0, 0], [10, 0], [10, 10], [0, 10]], 
        expected: true, 
        description: "Simple rectangle" 
      },
      { 
        polygon: [[0, 0], [10, 0], [5, 5], [0, 10], [10, 10]], 
        expected: true, 
        description: "Simple pentagon" 
      },
      { 
        polygon: [[0, 0], [10, 10], [0, 10], [10, 0]], 
        expected: false, 
        description: "Self-intersecting quadrilateral (bowtie shape)" 
      },
      { 
        polygon: [[0, 0], [5, 5], [10, 0], [5, 10]], 
        expected: false, 
        description: "Self-intersecting quadrilateral (hourglass shape)" 
      }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = isSimplePolygon(test.polygon);
      const isCorrect = result === test.expected;
      
      console.log(`Case: ${test.description}`);
      console.log(`  Polygon: [${test.polygon.map(p => `[${p}]`).join(', ')}]`);
      console.log(`  Expected: ${test.expected}`);
      console.log(`  Actual: ${result}`);
      console.log(`  Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isCorrect) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for isSimplePolygon`);
    return passCount === testCases.length;
  }
  
  // Test doIntersect function
  function testDoIntersect() {
    console.log("\n=== Testing doIntersect function ===");
    
    const testCases = [
      { 
        p1: [0, 0], q1: [10, 10], p2: [0, 10], q2: [10, 0], 
        expected: true, 
        description: "Intersecting lines forming an X" 
      },
      { 
        p1: [0, 0], q1: [5, 5], p2: [6, 6], q2: [10, 10], 
        expected: false, 
        description: "Collinear but not overlapping" 
      },
      { 
        p1: [0, 0], q1: [5, 0], p2: [0, 5], q2: [5, 5], 
        expected: false, 
        description: "Non-intersecting lines" 
      },
      { 
        p1: [0, 0], q1: [10, 0], p2: [5, -5], q2: [5, 5], 
        expected: true, 
        description: "T-intersection" 
      }
    ];
    
    let passCount = 0;
    for (const test of testCases) {
      const result = doIntersect(test.p1, test.q1, test.p2, test.q2);
      const isCorrect = result === test.expected;
      
      console.log(`Case: ${test.description}`);
      console.log(`  Line 1: [${test.p1}] to [${test.q1}]`);
      console.log(`  Line 2: [${test.p2}] to [${test.q2}]`);
      console.log(`  Expected: ${test.expected}`);
      console.log(`  Actual: ${result}`);
      console.log(`  Result: ${isCorrect ? '✓ PASS' : '✗ FAIL'}`);
      
      if (isCorrect) passCount++;
    }
    
    console.log(`\nPassed ${passCount}/${testCases.length} tests for doIntersect`);
    return passCount === testCases.length;
  }