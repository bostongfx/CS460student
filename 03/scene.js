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
      //
    }

    console.log('Yay! We clicked!');

    var pixel_coords = new THREE.Vector2(e.clientX, e.clientY);

    console.log('Pixel coords', pixel_coords);

    var vp_coords = new THREE.Vector2(
      (pixel_coords.x / window.innerWidth) * 2 - 1,  //X
      -(pixel_coords.y / window.innerHeight) * 2 + 1) // Y

    console.log('Viewport coords', vp_coords);

    var vp_coords_near = new THREE.Vector3(vp_coords.x, vp_coords.y, 0);


    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(vp_coords_near, camera);
    var intersects = raycaster.intersectObject(invisible_plane);

    console.log('Ray to Invisible Plane', intersects[0].point);

    // update cube position
    cube.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);

  };


  // setup lights
  var ambientLight = new THREE.AmbientLight();
  scene.add(ambientLight);

  var light = new THREE.DirectionalLight(0xffffff, 5.0);
  light.position.set(10, 100, 10);
  scene.add(light);

  // configure cube
  var geometry = new THREE.BoxGeometry(20, 20, 20);
  var material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: true });

  var cube = new THREE.Mesh(geometry, material);

  scene.add(cube);



  //
  // The invisible plane
  //
  geometry = new THREE.PlaneGeometry(10000, 10000);
  material = new THREE.MeshBasicMaterial({
    visible: false
  });

  var invisible_plane = new THREE.Mesh(geometry, material);

  scene.add(invisible_plane);
  //
  //
  //



  // interaction
  controls = new OrbitControls(camera, renderer.domElement);

  // call animation/rendering loop
  animate();

};

function animate() {

  requestAnimationFrame(animate);

  // and here..
  controls.update();
  renderer.render(scene, camera);

};