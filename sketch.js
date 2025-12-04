let bgImg;
let machineImg;
let clawImg;

let clawOffset = 0; // movimiento vertical de la garra
let clawSpeed = 5; // qué tan rápido sube/baja

let clawXOffset = 0; // movimiento horizontal de la garra
let clawXSpeed = 5; // qué tan rápido se mueve a los lados

function preload() {
  bgImg = loadImage("background.jpg"); // así está escrito en tu carpeta
  machineImg = loadImage("machine.png"); // así está escrito en tu carpeta
  clawImg = loadImage("claw.png"); // así está escrito en tu carpeta
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(255, 230, 0);

  // ---------- BACKGROUND ----------
  image(bgImg, width / 2, height / 2, width, height);

  // ---------- ESCALA DE LA MÁQUINA ----------
  let maxMachineHeight = height * 0.8; // la máquina ocupa 80% del alto
  let machineScale = maxMachineHeight / machineImg.height;

  let machineW = machineImg.width * machineScale;
  let machineH = machineImg.height * machineScale;

  let machineX = width / 2;
  let machineY = height / 2;

  image(machineImg, machineX, machineY, machineW, machineH);

  // ---------- ACTUALIZAR MOVIMIENTO VERTICAL DE LA CLAW ----------
  // cuánto puede bajar como máximo (ajusta este número para que no llegue al control)
  let maxOffset = machineH * 0.2; // 0.28 es un poco antes del control

  if (keyIsDown(DOWN_ARROW)) {
    // si se presiona flecha abajo, baja hasta el límite
    clawOffset = min(clawOffset + clawSpeed, maxOffset);
  } else {
    // si no se presiona, regresa hacia arriba poco a poco
    clawOffset = max(clawOffset - clawSpeed, 0);
  }

  // ---------- ACTUALIZAR MOVIMIENTO HORIZONTAL DE LA CLAW ----------
  // cuánto se puede mover hacia los lados (dentro del vidrio)
  let maxXOffset = machineW * 0.1; // ajusta para más/menos recorrido

  if (keyIsDown(LEFT_ARROW)) {
    clawXOffset = max(clawXOffset - clawXSpeed, -maxXOffset);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    clawXOffset = min(clawXOffset + clawXSpeed, maxXOffset);
  }

  // ---------- DIBUJAR CLAW ----------
  if (clawImg) {
    let clawScale = machineScale; // mismo tamaño que la tenías
    let clawW = clawImg.width * clawScale;
    let clawH = clawImg.height * clawScale;

    // posición base donde la dejaste (sin movimiento)
    let baseClawX = machineX;
    let baseClawY = machineY - machineH * 0.18;

    // aplicar offsets de movimiento
    let clawX = baseClawX + clawXOffset;
    let clawY = baseClawY + clawOffset;

    image(clawImg, clawX, clawY, clawW, clawH);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
