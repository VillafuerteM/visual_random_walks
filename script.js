// Set the dimensions of the SVG container to the full window size
const width = window.innerWidth;
const height = window.innerHeight;

// Add the SVG element to the container
const svg = d3.select('#svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .style('border', '1px solid black'); // Optional: to see the SVG's boundaries

const poemLines = [
  "Los ponientes y las generaciones.",
  "Los días y ninguno fue el primero.",
  "La frescura del agua en la garganta de Adán.",
  "El ordenado Paraíso.",
  "El ojo descifrando la tiniebla.",
  "El amor de los lobos en el alba.",
  "La palabra. El hexámetro. El espejo.",
  "La Torre de Babel y la soberbia.",
  "La luna que miraban los caldeos.",
  "Las arenas innúmeras del Ganges.",
  "Chuang-Tzu y la mariposa que lo sueña.",
  "Las manzanas de oro de las islas.",
  "Los pasos del errante laberinto.",
  "El infinito lienzo de Penélope.",
  "El tiempo circular de los estoicos.",
  "La moneda en la boca del que ha muerto.",
  "El peso de la espada en la balanza.",
  "Cada gota de agua en la clepsidra.",
  "Las águilas, los fastos, las legiones.",
  "César en la mañana de Farsalia.",
  "La sombra de las cruces en la tierra.",
  "El ajedrez y el álgebra del persa.",
  "Los rastros de las largas migraciones.",
  "La conquista de reinos por la espada.",
  "La brújula incesante. El mar abierto.",
  "El eco del reloj en la memoria.",
  "El rey ajusticiado por el hacha.",
  "El polvo incalculable que fue ejércitos.",
  "La voz del ruiseñor en Dinamarca.",
  "La escrupulosa línea del calígrafo.",
  "El rostro del suicida en el espejo.",
  "El naipe del tahúr. El oro ávido.",
  "Las formas de la nube en el desierto.",
  "Cada arabesco del calidoscopio.",
  "Cada remordimiento y cada lágrima.",
  "Se precisaron todas esas cosas para que nuestras manos se encontraran."
];

function displayPoemLine(index) {
  // Remove existing text
  svg.selectAll('text.poem').remove();

  // Add new text if index is within range
  if (index < poemLines.length) {
    svg.append('text')
      .attr('class', 'poem')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .text(poemLines[index]);
  }
}

function generateRandomPoints(steps, minX, maxX, minY, maxY) {
  let points = [];
  for (let i = 0; i < steps; i++) {
    points.push({
      x: Math.random() * (maxX - minX) + minX,
      y: Math.random() * (maxY - minY) + minY
    });
  }
  return points;
}

function startRandomWalk() {
  // Define the number of steps for the random walk
  const steps = 37;

  // Define starting points
  const startPointUpper = { x: 0, y: 0 };
  const startPointLower = { x: width, y: height };

  // Generate random points within the canvas, excluding the starting and ending points
  let randomPointsUpper = generateRandomPoints(steps - 2, 0, width, 0, height / 2);
  let randomPointsLower = generateRandomPoints(steps - 2, 0, width, height / 2, height);

  // Define the last point as the center of the canvas for each walk
  const center = { x: width / 2, y: height / 2 };

  // Add the starting and ending points for each random walk
  randomPointsUpper.unshift(startPointUpper);
  randomPointsUpper.push(center);
  randomPointsLower.unshift(startPointLower);
  randomPointsLower.push(center);

  // Now animate the transitions for each random walk
  animateWalk(randomPointsUpper, 0, 'upper');
  animateWalk(randomPointsLower, 0, 'lower');
}



function animateWalk(points, currentIndex, walkId) {
  // Stop the animation if we've reached the last point
  if (currentIndex >= points.length - 1) return;

  // Define colors
  const blueColor = 'rgb(15, 76, 129)';
  const redColor = 'rgb(223, 68, 159)'; 

  // Draw line segment from current point to the next
  const line = svg.append('line')
    .attr('x1', points[currentIndex].x)
    .attr('y1', points[currentIndex].y)
    .attr('x2', points[currentIndex + 1].x)
    .attr('y2', points[currentIndex + 1].y)
    .attr('stroke', walkId === 'upper' ? blueColor : redColor)
    .attr('stroke-width', 2)
    .style('stroke-dasharray', function() {
      const length = this.getTotalLength();
      return `${length} ${length}`;
    })
    .style('stroke-dashoffset', function() {
      return this.getTotalLength();
    })
    .transition()
    .duration(3000)
    .style('stroke-dashoffset', 0)
    .on('end', () => animateWalk(points, currentIndex + 1, walkId));

  // Display the corresponding line from the poem
  displayPoemLine(currentIndex);
}



// Call startRandomWalk when the "Start Walk" button is clicked
d3.select('#start-btn').on('click', startRandomWalk);

