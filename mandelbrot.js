const canvas = document.getElementById('mandelbrot');
const ctx = canvas.getContext('2d');
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
      cachedNs[x + y * width] = getMandelbrotIterations(
        cRe,
        cIm,
        maxIterations
      );
    }
  }
  return cachedNs;
}

function drawMandelbrot(maxIterations) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const n = Math.min(maxIterations, cachedNs[x + y * width]);
      const color = 255 * (1 - n / maxIterations);
      ctx.fillStyle = `rgb(${color}, ${color}, ${color})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

const cachedNs = getCachedNs(10_000);

let maxIterations = 1;
function step() {
  console.log('N max:', maxIterations);
  drawMandelbrot(maxIterations);
  maxIterations++;
  requestAnimationFrame(step);
}

requestAnimationFrame(step);
