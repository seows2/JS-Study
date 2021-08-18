const points = [40, 100, 1, 5, 2, 25, 10];
const sort1 = points.sort(); // [1, 10, 100, 2, 25, 40, 5]
const sort2 = points.sort((a, b) => a - b); // [1, 2, 5, 10, 25, 40, 100]
const sort3 = points.sort((a, b) => b - a); // [ 100, 40, 25, 10, 5, 2, 1 ]
