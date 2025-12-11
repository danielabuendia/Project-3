let bgImg;
let machineImg;

// claw
let clawImg;
let clawOpenImg;
let clawClosedImg;
let paloImg;
let instructionImg;

let glassLImg;
let glassRImg;
let paredImg;

// PREMIOS FINALES
let shirtImg;
let bookImg;
let superImg;

// imágenes de prendas
let imagen1;
let imagen2;
let imagen3;
let imagen4;
let imagen5;
let imagen6;
let imagen7;
let imagen8;
let imagen9;
let imagen10;
let imagen11;

// overlays
let estrellaImg;
let tableroImg;

let botonImg;
let botonOnImg;

// palanca
let palDefaultImg;
let palLeftImg;
let palRightImg;
let currentPalImg;

// sonido
let bgSound;
let gameOnSound;
let grabSound;
let winnerSound;

let clawOffset = 0;
let clawSpeed = 5;

let clawXOffset = 0;
let clawXSpeed = 5;

let clawState = "idle"; // idle, goingDown, goingUp

let machineOn = false;

// CLAW ESTÁ CARGANDO
let grabbedImg = null;
let grabbedImageRef = null;

// Control de audio
let audioStarted = false;

// WIN MODE
let winMode = false;
let winImage = null;
let winScale = 0;

// --------------------------------------------------------
// PRELOAD
// --------------------------------------------------------
function preload() {
  bgImg = loadImage("background.jpg");
  machineImg = loadImage("machine.png");

  clawOpenImg = loadImage("clawopen.png");
  clawClosedImg = loadImage("clawcerrado.png");
  clawImg = clawOpenImg;
  paloImg = loadImage("palo.png");
  instructionImg = loadImage("instructions.png");

  glassLImg = loadImage("glassl.png");
  glassRImg = loadImage("glassr.png");

  // Pared cargada
  paredImg = loadImage("pared.png");

  // PREMIOS FINALES
  shirtImg = loadImage("shirtfinal.png");
  bookImg = loadImage("bookfinal.png");
  superImg = loadImage("superfinal.png");

  imagen1 = loadImage("imagen1.png");
  imagen2 = loadImage("imagen2.png");
  imagen3 = loadImage("imagen3.png");
  imagen4 = loadImage("imagen4.png");
  imagen5 = loadImage("imagen5.png");
  imagen6 = loadImage("imagen6.png");
  imagen7 = loadImage("imagen7.png");
  imagen8 = loadImage("imagen8.png");
  imagen9 = loadImage("imagen9.png");
  imagen10 = loadImage("imagen10.png");
  imagen11 = loadImage("imagen11.png");

  estrellaImg = loadImage("estrella.png");
  tableroImg = loadImage("tablero.png");

  botonImg = loadImage("offboton.png");
  botonOnImg = loadImage("onboton.png");

  palDefaultImg = loadImage("paldefault.png");
  palLeftImg = loadImage("palleft.png");
  palRightImg = loadImage("palright.png");
  currentPalImg = palDefaultImg;

  bgSound = loadSound("sound.wav");
  gameOnSound = loadSound("gameon.wav");
  grabSound = loadSound("grab.wav");
  winnerSound = loadSound("winner.wav");

  gameOnSound.onended(function () {
    if (machineOn) {
      gameOnSound.play();
    }
  });
}

// SETUP
function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

// DRAW
function draw() {
  background(255, 230, 0);

  // CAPA 1: FONDO
  image(bgImg, width / 2, height / 2, width, height);

  let maxMachineHeight = height * 1.2;
  let machineScale = maxMachineHeight / machineImg.height;

  let machineW = machineImg.width * machineScale;
  let machineH = machineImg.height * machineScale;
  let machineX = width / 2;
  let machineY = height / 2;

  // CAPA 2: ESTRUCTURA INTERNA
  image(machineImg, machineX, machineY, machineW, machineH);

  // CAPA 3: ROPA
  function dibujarConVaiven(img, baseX, baseY, fase, extraY) {
    if (!img) return;
    if (!extraY) extraY = 0;

    let x = baseX;
    let y = baseY + extraY;

    if (machineOn) {
      let t = frameCount * 0.05 + fase;
      let ampX = machineW * 0.002;
      let ampRot = radians(3.5);
      let offsetX = sin(t) * ampX;
      let ang = sin(t) * ampRot;

      push();
      translate(x + offsetX, y);
      rotate(ang);
      image(img, 0, 0, machineW, machineH);
      pop();
    } else {
      image(img, x, y, machineW, machineH);
    }
  }

  let baseX = machineX;
  let baseY = machineY;

  dibujarConVaiven(imagen1, baseX, baseY, 0.0);
  dibujarConVaiven(imagen2, baseX, baseY, 0.7);
  dibujarConVaiven(imagen3, baseX, baseY, 1.4);
  dibujarConVaiven(imagen4, baseX, baseY, 2.1);
  dibujarConVaiven(imagen5, baseX, baseY, 2.8);
  dibujarConVaiven(imagen6, baseX, baseY, 3.5);
  dibujarConVaiven(imagen7, baseX, baseY, 4.2);
  dibujarConVaiven(imagen8, baseX, baseY, 4.9);
  dibujarConVaiven(imagen9, baseX, baseY, 5.6);
  dibujarConVaiven(imagen10, baseX, baseY, 6.3);
  let extraY11 = -machineH * 0.012;
  dibujarConVaiven(imagen11, baseX, baseY, 7.0, extraY11);

  // Controles
  if (machineOn && keyIsDown(LEFT_ARROW)) currentPalImg = palLeftImg;
  else if (machineOn && keyIsDown(RIGHT_ARROW)) currentPalImg = palRightImg;
  else currentPalImg = palDefaultImg;

  let maxXOffset = machineW * 0.07;

  if (machineOn && clawState === "idle" && !winMode) {
    if (keyIsDown(LEFT_ARROW))
      clawXOffset = max(clawXOffset - clawXSpeed, -maxXOffset);
    if (keyIsDown(RIGHT_ARROW))
      clawXOffset = min(clawXOffset + clawXSpeed, maxXOffset);
  }

  let maxOffset = machineH * 0.12;

  if (machineOn && clawState === "goingDown") {
    clawOffset += clawSpeed;
    if (clawOffset >= maxOffset) {
      clawOffset = maxOffset;
      clawState = "goingUp";
      clawImg = clawClosedImg;
      if (grabSound && grabSound.isLoaded()) grabSound.play();

      if (!grabbedImg) {
        let imgToGrab;
        if (clawXOffset < -maxXOffset / 3) {
          imgToGrab = imagen9;
          grabbedImageRef = "imagen9";
        } else if (clawXOffset > maxXOffset / 3) {
          imgToGrab = imagen11;
          grabbedImageRef = "imagen11";
        } else {
          imgToGrab = imagen10;
          grabbedImageRef = "imagen10";
        }

        if (imgToGrab) {
          grabbedImg = imgToGrab;
          if (grabbedImageRef === "imagen9") imagen9 = null;
          else if (grabbedImageRef === "imagen10") imagen10 = null;
          else if (grabbedImageRef === "imagen11") imagen11 = null;
        }
      }
    }
  } else if (machineOn && clawState === "goingUp") {
    clawOffset -= clawSpeed;
    if (clawOffset <= 0) {
      clawOffset = 0;
      clawState = "idle";
      clawImg = clawOpenImg;

      if (grabbedImg) {
        if (grabbedImageRef === "imagen9") winImage = shirtImg;
        else if (grabbedImageRef === "imagen10") winImage = bookImg;
        else if (grabbedImageRef === "imagen11") winImage = superImg;

        winMode = true;
        grabbedImg = null;
        grabbedImageRef = null;
        winScale = 0;

        if (grabSound && grabSound.isPlaying()) grabSound.stop();
        if (winnerSound && winnerSound.isLoaded()) winnerSound.play();
      }
    }
  }

  let cW = clawImg.width * machineScale;
  let cH = clawImg.height * machineScale;
  let clawYStart = machineY;
  let clawX = machineX + clawXOffset;
  let clawY = clawYStart + clawOffset;

  // CAPA 4: PALO, PREMIO, GARRA
  if (paloImg) {
    push();
    imageMode(CORNER);
    let paloW = paloImg.width * machineScale;
    let paloH_Original = paloImg.height * machineScale;
    let paloTopY = machineY - paloH_Original / 2 - 95;
    let alturaTotal = paloH_Original + clawOffset + 410;
    image(
      paloImg,
      int(clawX - paloW / 2),
      int(paloTopY),
      int(paloW),
      int(alturaTotal)
    );
    pop();
  }

  if (grabbedImg) {
    let premioW = machineW;
    let premioH = machineH;
    let ajusteX = 0.0;
    if (grabbedImageRef === "imagen9") ajusteX = 0.06;
    else if (grabbedImageRef === "imagen10") ajusteX = 0.02;
    else if (grabbedImageRef === "imagen11") ajusteX = -0.05;

    let premioX = clawX + machineW * ajusteX;
    let premioY = clawY + cH * -0.2;

    push();
    imageMode(CENTER);
    image(grabbedImg, premioX, premioY, premioW, premioH);
    pop();
  }

  image(clawImg, clawX, clawY, cW, cH);

  // CAPA 5: FRENTE (PARED Y VIDRIOS)
  image(glassLImg, machineX, machineY, machineW, machineH);
  image(glassRImg, machineX, machineY, machineW, machineH);
  image(paredImg, machineX, machineY, machineW, machineH);

  if (tableroImg) image(tableroImg, machineX, machineY, machineW, machineH);
  image(currentPalImg, machineX, machineY, machineW, machineH);
  image(botonImg, machineX, machineY, machineW, machineH);

  image(instructionImg, machineX, machineY, machineW, machineH);

  if (estrellaImg && !winMode) {
    image(estrellaImg, machineX, machineY, machineW, machineH);
  }

  // CAPA 6: PANTALLA DE GANADOR
  if (winMode && winImage) {
    push();
    imageMode(CENTER);
    fill(0, 150);
    rect(0, 0, width, height);

    if (winScale < 1) winScale += 0.05;
    let pulse = 1 + sin(frameCount * 0.1) * 0.05;
    let finalScale = winScale * pulse;

    translate(width / 2, height / 2);
    scale(finalScale);
    image(winImage, 0, 0, machineW * 1.0, machineH * 1.0);
    pop();
  }

  let botonSize = machineW * 0.02;
  let botonX = machineX + machineW * 0.046;
  let botonY = machineY + machineH * 0.17;

  window._hitbox = { botonX, botonY, botonSize };
}

// INPUTS
function mousePressed() {
  // ⭐ TRUCO DEL AUDIO:
  // Quitamos el "return". Ahora, el primer clic inicia el audio
  // Y TAMBIÉN enciende la máquina si le diste al botón.
  if (!audioStarted) {
    audioStarted = true;
    userStartAudio(); // Desbloquea el audio del navegador
    if (bgSound && bgSound.isLoaded()) {
      bgSound.setVolume(0.5);
      bgSound.loop();
    }
    // ¡NO HAY RETURN AQUÍ! El código sigue bajando...
  }

  // LÓGICA DE GANADOR (LINKS)
  if (winMode) {
    if (winImage === bookImg) {
      window.open(
        "https://danielabuendia.github.io/DataVisualizationHouseless/",
        "_blank"
      );
    } else if (winImage === superImg) {
      window.open(
        "https://danielabuendia.github.io/InClassExercise2/",
        "_blank"
      );
    } else if (winImage === shirtImg) {
      window.open(
        "https://danielabuendia.github.io/Choose-My-Outfit/",
        "_blank"
      );
    }
    winMode = false;
    winImage = null;
    return;
  }

  // LÓGICA DE BOTÓN DE ENCENDIDO
  let hb = window._hitbox;
  if (!hb) return;
  let left = hb.botonX - hb.botonSize / 2;
  let right = hb.botonX + hb.botonSize / 2;
  let top = hb.botonY - hb.botonSize / 2;
  let bottom = hb.botonY + hb.botonSize / 2;

  if (
    !machineOn &&
    mouseX > left &&
    mouseX < right &&
    mouseY > top &&
    mouseY < bottom
  ) {
    botonImg = botonOnImg;
    machineOn = true;
    // Si el audio ya estaba sonando por el clic de arriba, aquí solo aseguramos volumen
    if (bgSound) bgSound.setVolume(0.15);
    if (gameOnSound) gameOnSound.play();
  }
}

function keyPressed() {
  if (!machineOn) return;

  if (keyCode === 32 && clawState === "idle" && !winMode) {
    clawState = "goingDown";
    clawImg = clawOpenImg;
  }

  if (key === "r" || key === "R") {
    clawOffset = 0;
    clawXOffset = 0;
    clawState = "idle";
    clawImg = clawOpenImg;
    grabbedImg = null;
    grabbedImageRef = null;
    winMode = false;
    winImage = null;
    winScale = 0;

    imagen9 = loadImage("imagen9.png");
    imagen10 = loadImage("imagen10.png");
    imagen11 = loadImage("imagen11.png");

    if (winnerSound && winnerSound.isPlaying()) winnerSound.stop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
