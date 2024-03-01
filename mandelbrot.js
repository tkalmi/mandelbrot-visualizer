const canvas = document.getElementById('mandelbrot');
const context = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const RE_AXIS_START = -2;
const RE_AXIS_END = 2;
const IM_AXIS_START = -2;
const IM_AXIS_END = 2;

const MAX_ITERATIONS = 150;

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
      cachedNs[x + y * width] = getMandelbrotIterations(
        cRe,
        cIm,
        maxIterations
      );
    }
  }
  return cachedNs;
}

/**
 * 0    : blue   (hsl(240, 100%, 50%))
 * 0.25 : cyan   (hsl(180, 100%, 50%))
 * 0.5  : green  (hsl(120, 100%, 50%))
 * 0.75 : yellow (hsl(60, 100%, 50%))
 * 1    : red    (hsl(0, 100%, 50%))
 * @returns
 */
function heatMapColorforValue(value) {
  if (value === 1) {
    return 'rgb(0, 0, 0)';
  }
  const h = value * 240;
  return 'hsl(' + h + ', 100%, 50%)';
}

function drawMandelbrot(maxIterations) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const cachedN = cachedNs[x + y * width];
      if (cachedN === maxIterations && maxIterations > 1) {
        continue;
      }
      const n = Math.min(maxIterations, cachedNs[x + y * width]);
      context.fillStyle = heatMapColorforValue(n / maxIterations);
      context.fillRect(x, y, 1, 1);
    }
  }
}

const cachedNs = getCachedNs(MAX_ITERATIONS);

const iterationCounter = document.getElementById('iteration-counter');

let maxIterations = 1;
function step() {
  iterationCounter.textContent = `${maxIterations} / ${MAX_ITERATIONS}`;
  drawMandelbrot(maxIterations);
  maxIterations++;
  if (maxIterations > MAX_ITERATIONS) {
    return;
  }

  requestAnimationFrame(step);
}

requestAnimationFrame(step);
