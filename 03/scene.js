import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var renderer, controls, scene, camera, CURR_TORUS, TORUS_SCENE = []; 
const knot = new THREE.TorusKnotGeometry(10, 3, 100, 16)
window.onload = function () {

  // Three.js code goes here
  scene = new THREE.Scene();

  // setup the camera
  var fov = 75;
  var ratio = window.innerWidth / window.innerHeight;
  var zNear = 1;
  var zFar = 10000;
  camera = new THREE.PerspectiveCamera(fov, ratio, zNear, zFar);
  camera.position.set(0, 0, 100);

  // create renderer and setup the canvas
  renderer = new THREE.WebGLRenderer({ 
    antialias: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  renderer.domElement.onmousedown = function (e) {
    var pixel_coords = new THREE.Vector2(e.clientX, e.clientY);
    console.log('Pixel coords', pixel_coords);
    
    var vp_coords = new THREE.Vector2(
      (pixel_coords.x / window.innerWidth) * 2 - 1,  // X
      -(pixel_coords.y / window.innerHeight) * 2 + 1 // Y
    );
    console.log('Viewport coords', vp_coords);
    
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vp_coords, camera);
    var intersects = raycaster.intersectObject(invisible_plane);
    
    if (e.shiftKey) {
      controls.enabled = false
      var geometry = new THREE.TorusKnotGeometry(10, 3, 64, 16)
      var material = new THREE.MeshStandardMaterial({ 
        color: 0xff69b4,
        wireframe: false 
      })
      var new_torus = new THREE.Mesh(geometry, material)
      new_torus.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z)
      
      scene.add(new_torus)
      console.log(scene)

      CURR_TORUS = new_torus
      TORUS_SCENE.push(new_torus)
    }
  };

  renderer.domElement.onmouseup = function (e) {
    controls.enabled = true
  }

  renderer.domElement.onmousemove = function(e) {
    
    if (!controls.enabled) {
      // negative > green
      if (CURR_TORUS.scale.x > 0 && CURR_TORUS.scale.x + e.movementY <= 0) { 
        CURR_TORUS.material.color.set(0x7cfc00);
      }
      // positive > pink 
      if (CURR_TORUS.scale.x < 0 && CURR_TORUS.scale.x + e.movementY >= 0) { 
        CURR_TORUS.material.color.set(0xff69b4);
      }

      CURR_TORUS.scale.set(
        CURR_TORUS.scale.x + e.movementY,
        CURR_TORUS.scale.y + e.movementY,
        CURR_TORUS.scale.z + e.movementY
      )
    }
  }

  document.addEventListener('keypress', (e) => {
    if (e.key === 'w') {
      for (let i = 0; i < TORUS_SCENE.length; i++) {
        TORUS_SCENE[i].material.wireframe = !TORUS_SCENE[i].material.wireframe
      }
      console.log(TORUS_SCENE)
      console.log(scene)
    } 
  })


  var ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight(0xffffff, 5.0);
  light.position.set(10, 100, 10);
  scene.add(light);
 
  var planeGeometry = new THREE.BoxGeometry(20, 20, 20);
  var material = new THREE.MeshStandardMaterial({ 
    color: 0xd23232, 
    wireframe: false 
  });

  var torusKnot = new THREE.Mesh(knot, material);

  scene.add(torusKnot);

  planeGeometry = new THREE.PlaneGeometry(10000, 10000);
  material = new THREE.MeshBasicMaterial({
    visible: false
  });

  var invisible_plane = new THREE.Mesh(planeGeometry, material);

  scene.add(invisible_plane);

  controls = new OrbitControls(camera, renderer.domElement);
  animate();

};

function animate() {

  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);

}; 