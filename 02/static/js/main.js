CANVAS = document.getElementById("canvas");
let CUBE_SIDELENGTH = 10;
let GAP = 2;
let rotate = false; // camera rotate toggle value
CAMERAS = [];
let cameraLoop = null; // camera loop toggle value
let cameraIndex = 0;
let applyColorBtn = document.getElementById("colorBtn"); // Apply Custom RGB Colors button

window.onload = function () {
  loadCanvasColors();
  var r = createRenderer(CANVAS);
  var c1 = new X.cube();
  c1.lengthX = c1.lengthY = c1.lengthZ = CUBE_SIDELENGTH;
  r.add(c1);

  console.log("cube loaded");
  r.render();

  window.onkeypress = function (e) {
    keyboardControls(e, r, c1);
  };
  /*window.addEventListener("keydown", (event) => {
    keyboardControls(event, r, c1);
  });*/

  r.onRender = function () {
    // camera rotate event
    if (rotate) {
      rotateCamera(r, 10, 0);
    }
  };

  applyColorBtn.onclick = function () {
    rgb = normalizeRGB([
      document.getElementById("red").value,
      document.getElementById("green").value,
      document.getElementById("blue").value,
    ]);

    c1.color = rgb;
  };
};

// create renderer and set its container
function createRenderer(container) {
  if (!container) {
    console.log(`${container} not found`);
    return;
  }
  var r = new X.renderer3D();
  r.container = container; // set the renderer container

  r.init();
  console.log("renderer initialized");
  return r; // return the renderer
}

function keyboardControls(e, renderer, cube) {
  switch (e.code) {
    // movement controls
    case "KeyW": // move up
      cube.transform.translateZ(CUBE_SIDELENGTH + GAP);
      console.log("W pressed");
      break;
    case "KeyA": // move left
      cube.transform.translateX(CUBE_SIDELENGTH + GAP);
      console.log("A pressed");
      break;
    case "KeyS": // move down
      cube.transform.translateZ(-CUBE_SIDELENGTH - GAP);
      console.log("S pressed");
      break;
    case "KeyD": // move right
      cube.transform.translateX(-CUBE_SIDELENGTH - GAP);
      console.log("D pressed");
      break;
    case "KeyQ": // move foward
      cube.transform.translateY(CUBE_SIDELENGTH + GAP);
      console.log("Q pressed");
      break;
    case "KeyE": // move back
      cube.transform.translateY(-CUBE_SIDELENGTH - GAP);
      console.log("E pressed");
      break;
    // change colors
    case "Digit0": // change to black
      cube.color = [0, 0, 0];
      console.log("0 pressed");
      break;
    case "Digit1": // change to white
      cube.color = [1, 1, 1];
      console.log("1 pressed");
      break;
    case "Digit2": // change to red
      cube.color = [1, 0, 0];
      console.log("2 pressed");
      break;
    case "Digit3": // change to green
      cube.color = [0, 1, 0];
      console.log("3 pressed");
      break;
    case "Digit4": // change to blue
      cube.color = [0, 0, 1];
      console.log("4 pressed");
      break;
    case "Digit5": // change to yellow
      cube.color = [1, 1, 0];
      console.log("5 pressed");
      break;
    case "Digit6": // change to pink
      cube.color = [1, 0, 1];
      console.log("6 pressed");
      break;
    case "Digit7": // change to cyan
      cube.color = [0, 1, 1];
      console.log("7 pressed");
      break;
    case "Digit8": // change to custom color
      cube.color = rgb;
      console.log("8 pressed");
      break;
    // place the cube
    case "Space":
      var new_cube = new X.cube();
      new_cube.color = cube.color;
      new_cube.transform.matrix = new Float32Array(cube.transform.matrix);
      new_cube.lengthX = new_cube.lengthY = new_cube.lengthZ = CUBE_SIDELENGTH;
      renderer.add(new_cube);
      break;
    // loader functions
    case "KeyO":
      download(renderer);
      break;
    case "KeyL":
      upload("scene.json", renderer);
      break;
    case "KeyB":
      rotate = !rotate;
      console.log("B pressed");
      break;
    case "KeyC":
      CAMERAS.push(renderer.camera.view.slice());
      console.log("Camera view saved:", renderer.camera.view);
      break;
    case "KeyV":
      if (cameraLoop) {
        clearInterval(cameraLoop);
        cameraLoop = null;
      } else if (CAMERAS.length > 0) {
        cameraLoop = setInterval(() => {
          cycleCameras(renderer, cameraLoop);
        }, 1000);
      }
      console.log("V pressed");
      break;
  }
}

// function to input normal RGB values and make readable for xtk
function normalizeRGB(rgb) {
  return [
    Math.floor(rgb[0]) / 255,
    Math.floor(rgb[1]) / 255,
    Math.floor(rgb[2]) / 255,
  ];
}

// function to rotate camera x direction for given renderer
function rotateCamera(renderer, x, y) {
  // spin the camera in X direction by 1 degree
  renderer.camera.rotate([x, y]);
}

// function to cycle through camera lists on given renderer
function cycleCameras(renderer) {
  cameraIndex = (cameraIndex + 1) % CAMERAS.length;
  renderer.camera.view = CAMERAS[cameraIndex];
  console.log("Switched to camera view:", renderer.camera.view);
}

// load colorlist
function loadCanvasColors() {
  const colorList = document.getElementById("colorList");
  canvasColors = ["black", "white", "grey"];
  canvasColors.forEach((color) => {
    const option = document.createElement("option");
    option.name = color;
    option.value = color;
    option.textContent = color;

    colorList.appendChild(option);
  });
  // change CANVAS background color
  colorList.onchange = () => {
    var selection = colorList.options[colorList.selectedIndex];
    CANVAS.style.backgroundColor = selection.value;
  };
}
