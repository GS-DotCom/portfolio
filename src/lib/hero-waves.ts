// Disegno del nastro di linee della hero, usato sia dal Web Worker (hero-waves.worker.ts)
// sia, come ripiego, dal thread principale (hero-waves.tsx).

// Nastro di linee sottili ispirato a references/sfondo header.png. La curva di base passa
// in basso al centro e sale solo verso destra, per lasciare libera la zona del nome.
// Punti di controllo in frazioni di larghezza e altezza della hero.
const CONTROL_POINTS: [number, number][] = [
  [-0.1, 1.02],
  [0.04, 0.98],
  [0.18, 0.86],
  [0.42, 0.96],
  [0.72, 0.92],
  [0.86, 0.42],
  [0.97, 0.1],
  [1.15, -0.02],
];
const LINES = 40;
const SAMPLES_PER_SEGMENT = 24;
const COLORS = ["#d10ce8", "#8a1fd6", "#4a2fd0"];
const LINE_ALPHA = 0.85;
// Il nastro si muove piano: a 30 fotogrammi al secondo il movimento è identico e il lavoro si dimezza.
// La tolleranza evita di saltare un fotogramma in più per le piccole variazioni di requestAnimationFrame.
const FRAME_INTERVAL = 1000 / 30 - 4;
const TWIST_SPEED = 0.22;

// Un canvas della pagina oppure quello ceduto al worker: hanno la stessa interfaccia per WebGL e 2D
type WavesCanvas = HTMLCanvasElement | OffscreenCanvas;

export type WavesSize = { width: number; height: number; ratio: number };
// running: l'animazione gira; still: movimento ridotto, il nastro resta fermo nella posizione iniziale
export type WavesState = { running: boolean; still: boolean };

// Messaggi dalla pagina al worker e dal worker alla pagina
export type WavesMessage =
  | { type: "init"; canvas: OffscreenCanvas }
  | ({ type: "resize" } & WavesSize)
  | ({ type: "state" } & WavesState);
export type WavesReply = { type: "drawn" } | { type: "failed" };

type Point = { x: number; y: number; nx: number; ny: number; u: number };

// Spline Catmull-Rom che passa per tutti i punti, con la normale in ogni campione
function sampleCurve(width: number, height: number): Point[] {
  const points = CONTROL_POINTS.map(([x, y]) => ({ x: x * width, y: y * height }));
  const curve: { x: number; y: number }[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
      const t = s / SAMPLES_PER_SEGMENT;
      const t2 = t * t;
      const t3 = t2 * t;
      const blend = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (c - a) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (3 * b - a - 3 * c + d) * t3);
      curve.push({ x: blend(p0.x, p1.x, p2.x, p3.x), y: blend(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  curve.push(points[points.length - 1]);

  return curve.map((point, i) => {
    const prev = curve[Math.max(0, i - 1)];
    const next = curve[Math.min(curve.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dy = next.y - prev.y;
    const length = Math.hypot(dx, dy) || 1;
    return { ...point, nx: -dy / length, ny: dx / length, u: i / (curve.length - 1) };
  });
}

// Geometria del nastro per una data dimensione. Lo spostamento di ogni punto lungo la normale
// è scomposto in seno e coseno: sin(A - b) = sin A · cos b - cos A · sin b, dove A dipende solo
// dal punto e b solo dal tempo. Così a ogni fotogramma servono un seno e un coseno in tutto.
type Ribbon = {
  curve: Point[];
  xSin: Float32Array;
  xCos: Float32Array;
  ySin: Float32Array;
  yCos: Float32Array;
};

function buildRibbon(width: number, height: number): Ribbon {
  const curve = sampleCurve(width, height);
  // Il nastro si allarga con lo schermo, ma non supera un tetto
  const spread = Math.min(height * 0.22, width * 0.13, 190);
  const size = LINES * curve.length;
  const ribbon = {
    curve,
    xSin: new Float32Array(size),
    xCos: new Float32Array(size),
    ySin: new Float32Array(size),
    yCos: new Float32Array(size),
  };
  for (let line = 0; line < LINES; line++) {
    const offset = line / (LINES - 1) - 0.5;
    for (let i = 0; i < curve.length; i++) {
      const { nx, ny, u } = curve[i];
      // Dove il seno passa per zero le linee si stringono: è l'avvitamento del nastro
      const phase = Math.PI * 2 * (u * 1.7 + offset * 0.08);
      const sin = Math.sin(phase) * offset * spread;
      const cos = Math.cos(phase) * offset * spread;
      const k = line * curve.length + i;
      ribbon.xSin[k] = nx * sin;
      ribbon.xCos[k] = nx * cos;
      ribbon.ySin[k] = ny * sin;
      ribbon.yCos[k] = ny * cos;
    }
  }
  return ribbon;
}

type Renderer = {
  resize: (size: WavesSize, ribbon: Ribbon) => void;
  draw: (cosTime: number, sinTime: number) => void;
  dispose: () => void;
};

// Vertex shader: sposta ogni punto lungo la normale per il tempo corrente e allarga la linea
// in una striscia di triangoli, perpendicolare alla direzione tra il punto precedente e il successivo.
const VERTEX_SHADER = `
attribute vec4 aPrev;
attribute vec2 aPrevCos;
attribute vec4 aCurr;
attribute vec2 aCurrCos;
attribute vec4 aNext;
attribute vec2 aNextCos;
attribute float aSide;
uniform vec2 uTime;
uniform vec2 uSize;
uniform float uRatio;
uniform float uHalfWidth;
varying float vDistance;
varying float vGradient;

vec2 place(vec4 point, vec2 cosTerm) {
  return point.xy + point.zw * uTime.x - cosTerm * uTime.y;
}

void main() {
  vec2 prev = place(aPrev, aPrevCos);
  vec2 curr = place(aCurr, aCurrCos);
  vec2 next = place(aNext, aNextCos);
  vec2 direction = next - prev;
  direction = length(direction) > 0.0 ? normalize(direction) : vec2(1.0, 0.0);
  vec2 normal = vec2(-direction.y, direction.x);
  vec2 position = curr + normal * aSide * uHalfWidth / uRatio;
  vDistance = aSide * uHalfWidth;
  vGradient = position.x / uSize.x;
  vec2 clip = position / uSize * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}
`;

// Fragment shader: copertura della linea larga 1 px CSS con il bordo sfumato su un pixel, come
// l'antialiasing del canvas 2D, e colore preso dalla sfumatura orizzontale a tre tappe.
const FRAGMENT_SHADER = `
precision mediump float;
uniform vec3 uColors[3];
uniform float uLineWidth;
uniform float uAlpha;
varying float vDistance;
varying float vGradient;

void main() {
  float coverage = clamp(uLineWidth * 0.5 + 0.5 - abs(vDistance), 0.0, 1.0);
  float t = clamp(vGradient, 0.0, 1.0) * 2.0;
  vec3 color = t < 1.0 ? mix(uColors[0], uColors[1], t) : mix(uColors[1], uColors[2], t - 1.0);
  float alpha = coverage * uAlpha;
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

// Per ogni punto: posizione di base, termini del seno (vec4) e del coseno (vec2), e lato della striscia
const FLOATS_PER_VERTEX = 7;

function hexToRgb(hex: string): number[] {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

// Disegno con WebGL: tutte le linee in una sola chiamata, calcolate dalla scheda grafica.
// A ogni fotogramma cambiano solo due numeri (seno e coseno del tempo).
function createWebGLRenderer(canvas: WavesCanvas): Renderer | null {
  const gl = (canvas as OffscreenCanvas).getContext("webgl", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vertexShader = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!vertexShader || !fragmentShader || !program) return null;
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const vertexBuffer = gl.createBuffer();
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Precedente, corrente e successivo leggono lo stesso buffer con due vertici di scarto l'uno
  // dall'altro: ogni linea ha in testa e in coda una copia del primo e dell'ultimo punto.
  const stride = FLOATS_PER_VERTEX * 4;
  const roles = [
    ["aPrev", "aPrevCos", 0],
    ["aCurr", "aCurrCos", 2],
    ["aNext", "aNextCos", 4],
  ] as const;
  for (const [pointName, cosName, shift] of roles) {
    const point = gl.getAttribLocation(program, pointName);
    const cos = gl.getAttribLocation(program, cosName);
    gl.enableVertexAttribArray(point);
    gl.vertexAttribPointer(point, 4, gl.FLOAT, false, stride, shift * stride);
    gl.enableVertexAttribArray(cos);
    gl.vertexAttribPointer(cos, 2, gl.FLOAT, false, stride, shift * stride + 16);
  }
  const side = gl.getAttribLocation(program, "aSide");
  gl.enableVertexAttribArray(side);
  gl.vertexAttribPointer(side, 1, gl.FLOAT, false, stride, 2 * stride + 24);

  const uTime = gl.getUniformLocation(program, "uTime");
  const uSize = gl.getUniformLocation(program, "uSize");
  const uRatio = gl.getUniformLocation(program, "uRatio");
  const uHalfWidth = gl.getUniformLocation(program, "uHalfWidth");
  const uLineWidth = gl.getUniformLocation(program, "uLineWidth");
  gl.uniform3fv(gl.getUniformLocation(program, "uColors"), COLORS.flatMap(hexToRgb));
  gl.uniform1f(gl.getUniformLocation(program, "uAlpha"), LINE_ALPHA);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  let indexCount = 0;

  return {
    resize({ width, height, ratio }, { curve, xSin, xCos, ySin, yCos }) {
      const points = curve.length;
      const slots = points + 2;
      const vertices = new Float32Array(LINES * slots * 2 * FLOATS_PER_VERTEX);
      for (let line = 0; line < LINES; line++) {
        for (let slot = 0; slot < slots; slot++) {
          const i = Math.min(points - 1, Math.max(0, slot - 1));
          const k = line * points + i;
          for (let s = 0; s < 2; s++) {
            const offset = ((line * slots + slot) * 2 + s) * FLOATS_PER_VERTEX;
            vertices[offset] = curve[i].x;
            vertices[offset + 1] = curve[i].y;
            vertices[offset + 2] = xSin[k];
            vertices[offset + 3] = ySin[k];
            vertices[offset + 4] = xCos[k];
            vertices[offset + 5] = yCos[k];
            vertices[offset + 6] = s === 0 ? -1 : 1;
          }
        }
      }
      // Due triangoli per ogni tratto; l'indice punta al vertice "precedente" del punto
      const indices = new Uint16Array(LINES * (points - 1) * 6);
      let n = 0;
      for (let line = 0; line < LINES; line++) {
        for (let i = 0; i < points - 1; i++) {
          const a = (line * slots + i) * 2;
          indices.set([a, a + 1, a + 2, a + 1, a + 3, a + 2], n);
          n += 6;
        }
      }
      indexCount = n;
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

      // Larghezza di 1 px CSS, più un pixel per lato di sfumatura
      const lineWidth = ratio;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uSize, width, height);
      gl.uniform1f(uRatio, ratio);
      gl.uniform1f(uLineWidth, lineWidth);
      gl.uniform1f(uHalfWidth, lineWidth * 0.5 + 1);
    },
    draw(cosTime, sinTime) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uTime, cosTime, sinTime);
      gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
    },
    dispose() {
      gl.deleteBuffer(vertexBuffer);
      gl.deleteBuffer(indexBuffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    },
  };
}

// Ripiego con il canvas 2D, per i browser senza WebGL
function create2DRenderer(canvas: WavesCanvas): Renderer | null {
  const context = (canvas as OffscreenCanvas).getContext("2d");
  if (!context) return null;
  let ribbon: Ribbon | null = null;
  let gradient: CanvasGradient | null = null;
  let width = 0;
  let height = 0;

  return {
    resize(size, nextRibbon) {
      ({ width, height } = size);
      ribbon = nextRibbon;
      context.setTransform(size.ratio, 0, 0, size.ratio, 0, 0);
      const next = context.createLinearGradient(0, 0, width, 0);
      COLORS.forEach((color, i) => next.addColorStop(i / (COLORS.length - 1), color));
      gradient = next;
    },
    draw(cosTime, sinTime) {
      if (!ribbon || !gradient) return;
      const { curve, xSin, xCos, ySin, yCos } = ribbon;
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = gradient;
      context.globalAlpha = LINE_ALPHA;

      for (let line = 0; line < LINES; line++) {
        const base = line * curve.length;
        context.beginPath();
        for (let i = 0; i < curve.length; i++) {
          const { x, y } = curve[i];
          const k = base + i;
          const px = x + xSin[k] * cosTime - xCos[k] * sinTime;
          const py = y + ySin[k] * cosTime - yCos[k] * sinTime;
          if (i === 0) context.moveTo(px, py);
          else context.lineTo(px, py);
        }
        context.stroke();
      }
    },
    dispose() {},
  };
}

// Nei worker requestAnimationFrame non c'è ovunque: in quel caso si usa un timer
function schedule(callback: (now: number) => void): number {
  if (typeof requestAnimationFrame === "function") return requestAnimationFrame(callback);
  return setTimeout(() => callback(performance.now()), FRAME_INTERVAL) as unknown as number;
}

function unschedule(frame: number) {
  if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(frame);
  else clearTimeout(frame);
}

export type WavesAnimation = {
  resize: (size: WavesSize) => void;
  setState: (state: WavesState) => void;
  dispose: () => void;
};

// Animazione del nastro su un canvas: WebGL se disponibile, altrimenti canvas 2D.
// onFirstDraw viene chiamata una sola volta, dopo il primo disegno, per la dissolvenza d'ingresso.
export function createWavesAnimation(canvas: WavesCanvas, onFirstDraw: () => void): WavesAnimation | null {
  const created = createWebGLRenderer(canvas) ?? create2DRenderer(canvas);
  if (!created) return null;
  const renderer: Renderer = created;

  const start = performance.now();
  let ready = false;
  let drawn = false;
  let still = false;
  let running = false;
  let frame = 0;
  let lastDraw = 0;

  function draw() {
    if (!ready) return;
    const time = still ? 0 : (performance.now() - start) / 1000;
    renderer.draw(Math.cos(time * TWIST_SPEED), Math.sin(time * TWIST_SPEED));
    if (!drawn) {
      drawn = true;
      onFirstDraw();
    }
  }

  function loop(now: number) {
    if (now - lastDraw >= FRAME_INTERVAL) {
      lastDraw = now;
      draw();
    }
    frame = schedule(loop);
  }

  return {
    resize(size) {
      canvas.width = Math.round(size.width * size.ratio);
      canvas.height = Math.round(size.height * size.ratio);
      renderer.resize(size, buildRibbon(size.width, size.height));
      ready = true;
      draw();
    },
    setState(state) {
      still = state.still;
      if (state.running && !running) {
        running = true;
        frame = schedule(loop);
      } else if (!state.running && running) {
        running = false;
        unschedule(frame);
        draw();
      }
    },
    dispose() {
      unschedule(frame);
      renderer.dispose();
    },
  };
}
