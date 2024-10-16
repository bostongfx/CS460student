import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let LASTOBJECT = null;
let DELTA = null;
let swapColor = false;
let wasPositive = true;
window.mouseDown = false;
let wireframe = false;

var renderer, controls, scene, camera, invisiblePlane;

window.onload = function () {
  // Three.js code goes here
  scene = new THREE.Scene();
  window.scene = scene;

  // setup camera
  var fov = 75;
  var ratio = window.innerWidth / window.innerHeight;
  var zNear = 1;
  var zFar = 10000;
  camera = new THREE.PerspectiveCamera(fov, ratio, zNear, zFar);
  camera.position.set(0, 0, 100);

  // create renderer and setup the canvas
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // setup lights
  var ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight(0xffffff, 5.0);
  light.position.set(10, 100, 10);
  scene.add(light);

  // configure torus knot
  var geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  var material = new THREE.MeshStandardMaterial({
    color: 0x098842,
    wireframe: false,
  });

  var torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  // invisible plane
  geometry = new THREE.PlaneGeometry(10000, 10000);
  material = new THREE.MeshBasicMaterial({ visible: false });

  invisiblePlane = new THREE.Mesh(geometry, material);
  scene.add(invisiblePlane);

  // interaction
  controls = new OrbitControls(camera, renderer.domElement);
  window.controls = controls;

  // setup controls
  setupControls();

  // call animation/rendering loop
  animate();
};

function animate() {
  requestAnimationFrame(animate);

  // and here..
  renderer.render(scene, camera);
}

function createGeometry() {
  // configure torus knot
  var geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  var material = new THREE.MeshStandardMaterial({
    color: 0xfe76c0,
    wireframe: false,
  });

  var torusKnot = new THREE.Mesh(geometry, material);
  return torusKnot;
}

function handleMouseEvents(e) {
  switch (e.type) {
    case "mousedown": // setup geometry placement on click
      if (e.shiftKey) {
        controls.enabled = false;
        window.mouseDown = true;
        var pixel_coords = new THREE.Vector2(e.clientX, e.clientY);

        console.log("Pixel coords", pixel_coords);

        var vp_coords = new THREE.Vector2(
          (pixel_coords.x / window.innerWidth) * 2 - 1, //X
          -(pixel_coords.y / window.innerHeight) * 2 + 1
        ); // Y

        console.log("Viewport coords", vp_coords);

        var vp_coords_near = new THREE.Vector3(vp_coords.x, vp_coords.y, 0);

        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(vp_coords_near, camera);
        var intersects = raycaster.intersectObject(invisiblePlane);

        console.log("Ray to Invisible Plane", intersects[0].point);

        LASTOBJECT = createGeometry();
        // update geometry position
        LASTOBJECT.position.set(
          intersects[0].point.x,
          intersects[0].point.y,
          intersects[0].point.z
        );
        scene.add(LASTOBJECT);
      }
      break; // exit if shift key not pressed

    case "mouseup": // reset controls
      controls.enabled = true;
      window.mouseDown = false;
      break;

    case "mousemove": // scale geometry
      if (window.mouseDown) {
        DELTA = e.movementY;
        LASTOBJECT.scale.set(
          LASTOBJECT.scale.x + DELTA,
          LASTOBJECT.scale.y + DELTA,
          LASTOBJECT.scale.z + DELTA
        );
        console.log(LASTOBJECT.scale);

        // Check if the current scale is positive or negative
        let isPositive =
          LASTOBJECT.scale.x > 0 &&
          LASTOBJECT.scale.y > 0 &&
          LASTOBJECT.scale.z > 0;

        if (wasPositive !== isPositive) {
          swapColor = !swapColor;

          if (swapColor) {
            LASTOBJECT.material.color.set(0x7cfc00);
          } else {
            LASTOBJECT.material.color.set(0xfe76c0);
          }
        }

        wasPositive = isPositive;
      }
      break;

    default:
      console.log("Unhandeled event: " + e.type);
  }
}

function handleKeyEvents(e) {
  switch (e.code) {
    case "KeyW":
      wireframe = !wireframe;

      // wireframe toggle
      scene.traverse(function (object) {
        if (object.isMesh && object.geometry) {
          object.material.wireframe = wireframe;
        }
      });
      break;
    case "KeyC":
      clearScene();
      break;
  }
}

function setupControls() {
  // add event listeners for mouse controls
  renderer.domElement.addEventListener("mousedown", handleMouseEvents);
  renderer.domElement.addEventListener("mousemove", handleMouseEvents);
  renderer.domElement.addEventListener("mouseup", handleMouseEvents);

  // add event listeners for keyboard controls
  window.addEventListener("keydown", handleKeyEvents);
}

function clearScene() {
  var objectsToRemove = [];
  scene.traverse(function (object) {
    if (object.isMesh) {
      if (object.geometry) object.geometry.dispose();
      if (object.material) {
        if (Array.isArray(object.material)) {
          // If material is an array, dispose all materials
          object.material.forEach((mat) => mat.dispose());
        } else {
          // Single material
          object.material.dispose();
        }
      }
      objectsToRemove.push(object);
      // Remove the object from the scene
    }
  });

  objectsToRemove.forEach((object) => scene.remove(object));
}
