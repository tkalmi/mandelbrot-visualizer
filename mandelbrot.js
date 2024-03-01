const canvas = document.getElementById('mandelbrot');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const RE_AXIS_START = -2;
const RE_AXIS_END = 2;
const IM_AXIS_START = -2;
const IM_AXIS_END = 2;

function getMandelbrotIterations(cRe, cIm, maxIterations) {
  let n = 0;
  let re = 0;
  let im = 0;
  while (n < maxIterations && re ** 2 + im ** 2 < 4) {
    let reTemp = re ** 2 - im ** 2 + cRe;
    im = 2 * re * im + cIm;
    re = reTemp;
    n++;
  }
  return n;
}

function getCachedNs(maxIterations) {
  const cachedNs = new Array(width * height);
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cRe = RE_AXIS_START + (x / width) * (RE_AXIS_END - RE_AXIS_START);
      const cIm = IM_AXIS_START + (y / height) * (IM_AXIS_END - IM_AXIS_START);
      cachedNs[x + y * width] =
        getMandelbrotIterations(cRe, cIm, maxIterations) - 1;
    }
  }
  return cachedNs;
}

function drawMandelbrot(maxIterations) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cachedN = cachedNs[x + y * width];
      if ((cachedN === 0 || cachedN === maxIterations) && maxIterations > 1) {
        continue;
      }
      const n = Math.min(maxIterations, cachedNs[x + y * width]);
      const color = 1 - n / maxIterations;
      context.fillStyle = `rgb(${color * 255}, ${color * 255}, ${color * 255})`;
      context.fillRect(x, y, 1, 1);
    }
  }
}

const cachedNs = getCachedNs(150);

const iterationCounter = document.getElementById('iteration-counter');

let maxIterations = 1;
function step() {
  iterationCounter.textContent = maxIterations;
  drawMandelbrot(maxIterations);
  if (maxIterations < 10) {
    maxIterations++;
  } else if (maxIterations < 50) {
    maxIterations += 5;
  } else if (maxIterations < 120) {
    maxIterations += 10;
  } else {
    return;
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
