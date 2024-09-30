import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var renderer, controls, scene, camera; 
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
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // document.addEventListener('keydown', (e) => {
  //   toggler = true
  //   // rotate camera while toggler
  // })
  // document.addEventListener('keyup', (e) => {
  //   toggler = false
  // })

  renderer.domElement.onclick = function (e) {
    if (!e.shiftKey) {
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
   
        if (intersects.length > 0) {
          var point = intersects[0].point;
          console.log('Intersection point', point);
  
          var cube_geometry = new THREE.BoxGeometry(20, 20, 20);
          var cube_material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });
          var new_cube = new THREE.Mesh(cube_geometry, cube_material);
   
          new_cube.position.set(point.x, point.y, point.z);
          scene.add(new_cube);
        }
    }
  };

 
  var ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight(0xffffff, 5.0);
  light.position.set(10, 100, 10);
  scene.add(light);
 
  var geometry = new THREE.BoxGeometry(20, 20, 20);
  var material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });

  var cube = new THREE.Mesh(geometry, material);

  scene.add(cube);

  geometry = new THREE.PlaneGeometry(10000, 10000);
  material = new THREE.MeshBasicMaterial({
    visible: false
  });

  var invisible_plane = new THREE.Mesh(geometry, material);

  scene.add(invisible_plane);

  controls = new OrbitControls(camera, renderer.domElement);
  animate();

};

function animate() {

  requestAnimationFrame(animate);

  // and here..
  controls.update();
  renderer.render(scene, camera);

};