import { 
  Scene, 
  SphereGeometry, 
  Vector2,
  Vector3, 
  PerspectiveCamera, 
  WebGLRenderer, 
  Color, 
  MeshBasicMaterial, 
  Mesh, 
  Clock, 
  AudioListener, 
  Audio,
  AudioLoader, 
  AudioAnalyser,
  TextureLoader, 
  CineonToneMapping,
  LinearToneMapping
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createSculptureWithGeometry } from 'https://unpkg.com/shader-park-core/dist/shader-park-core.esm.js';
import { generateshaderparkcode } from './generateshaderparkcode.js';
import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js'
import {RenderPass} from 'three/addons/postprocessing/RenderPass'
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer'
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass'

//////////////////////
///GLOBAL VARIABLES///
//////////////////////
{
  window['scene'] = null;
  window['shader'] = null;
  window['renderer'] = null;
  window['composer'] = null;
  window['camera'] = null;
  window['controls'] = null;
  window['clock'] = null;
  window['analyser'] = null;
  window['audio'] = null;
  window['toneMapping'] = {
    EXPOSURE : 1.5,
  };
  window['bloom'] = {
    STRENGTH : 1.0,
    RADIUS : 1.0,
    THRESHOLD : 1.0,
    ENABLED : true,
  }
  window['bloompass'] = new UnrealBloomPass(
    bloom.STRENGTH, 
    bloom.RADIUS,
    bloom.THRESHOLD
  )
  window['state'] = {
    mouse : new Vector3(),
    currMouse : new Vector3(),
    size : 0.0,
    //pointerDown: 0.0,
    //currPointerDown: 0.0,
    currAudio: 0.0,
    time : 0.0,
    audio : 0.0,
    MINIMIZING_FACTOR : 1.0,
    POWER_FACTOR : 8.0,
    BASE_SPEED : 0.2,
    EASING_SPEED : 0.2,
    ROTATE_TOGGLE : true,
  }
}

////////////////
/// THREE JS ///
////////////////
{
  // setup scene
  {
    // initialize scene
    scene = new Scene();

    // initialize camera
    camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
    camera.position.z = 5.5;

    // initialize renderer
    renderer = new WebGLRenderer({ antialias: true, transparent: true });
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor( new Color(1, 1, 1), 0);
    document.body.appendChild( renderer.domElement );

    // initialize clock
    clock = new Clock();

    // Add mouse controlls
    controls = new OrbitControls( camera, renderer.domElement, {
      enableDamping : true,
      dampingFactor : 0.25,
      zoomSpeed : 0.5,
      rotateSpeed : 0.5
    } );
    controls.autoRotate = state.ROTATE_TOGGLE;

    
    // add mouse event listeners
    window.addEventListener( 'pointermove', (event) => {
      state.currMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      state.currMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    }, false );

    window.addEventListener( 'pointerdown', (event) => state.currPointerDown = 1.0, false );
    window.addEventListener( 'pointerup', (event) => state.currPointerDown = 0.0, false );

    // setup post processing effects
    const renderScene = new RenderPass(scene, camera)
    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloompass);
    renderer.toneMapping = LinearToneMapping;
    renderer.toneMappingExposure = toneMapping.EXPOSURE;
  }
  // generate shader
  {
    shader = generateshaderparkcode(true); // true == use_default
  }

  // create the visualizer
  {
    var geometry  = new SphereGeometry(6, 60, 60);
    var mesh = createSculptureWithGeometry(geometry, shader, () => {
      return {
        time : state.time,
        size : state.size,
        //pointerDown: state.pointerDown,
        mouse: state.mouse,
        //audio : state.audio
        _scale: 3.0
      }
    })
    scene.add(mesh);
  }

  // create a skybox
  {
    geometry = new SphereGeometry(800, 60, 40);
    geometry.scale(-1, 1, 1);
    let texture = new TextureLoader().load("0i2jFBOV.png");
    let material = new MeshBasicMaterial({map: texture});
    mesh = new Mesh(geometry, material);
    scene.add(mesh);
  }

  // setup ui elements
  {
    const pane = new Pane();

    // visualizer ui
    var vizui = pane.addFolder({title: 'Visualizer'}); 
    vizui.addBinding(state, 'MINIMIZING_FACTOR', {min:1.0, max:2.0, label:'MOD 1'});
    vizui.addBinding(state, 'POWER_FACTOR', {min:1.0, max:10.0, label:'MOD 2'});
    vizui.addBinding(state, 'BASE_SPEED', {min: 0.1, max: 0.9, label: 'Base Speed'})
    vizui.addBinding(state, 'EASING_SPEED', {min: 0.1, max: 1.0, label: 'Easing Speed' })
    vizui.addBinding(state, 'ROTATE_TOGGLE').on('change', (ev) => {
      controls.autoRotate = !controls.autoRotate;
    })

    // bloom ui
    var bloomui = pane.addFolder({title: 'Bloom Settings'}).on('change', (ev) => {
      composer.removePass(bloompass);
      bloompass = new UnrealBloomPass(
        1.6, 
        bloom.RADIUS,
        bloom.THRESHOLD
      )
      renderer.toneMappingExposure = toneMapping.EXPOSURE;
      composer.addPass(bloompass);
    });
    bloomui.addBinding(bloom, 'ENABLED');
    bloomui.addBinding(bloom, 'RADIUS', {min: 0.0, max: 10.0, label: 'Radius' });
    bloomui.addBinding(bloom, 'THRESHOLD', {min: 0.0, max: 10.0, label: 'Threshold' });
    bloomui.addBinding(toneMapping, 'EXPOSURE')

    // camera ui
    var camui = pane.addFolder({title: 'Camera Settings'}).on('change', (ev) => {
      camera.updateProjectionMatrix();
    });
    camui.addBinding(camera, 'fov', {min: 75, max: 150, label: 'FOV'});
  }

  // animation loop
  function animate() {
    requestAnimationFrame( animate );
    state.time += clock.getDelta();

    // use easing and linear interpolation to smoothly animate mouse effects
    state.pointerDown = .1 * state.currPointerDown + .9 * state.pointerDown;
    state.mouse.lerp(state.currMouse, .05 );

    if (audio != null) {
      let analysis = Math.pow((analyser.getFrequencyData()[2]/255)*state.MINIMIZING_FACTOR, state.POWER_FACTOR);
      //console.log(analysis)
      state.currAudio = analysis + clock.getDelta() * state.BASE_SPEED;
    } else {
      state.currAudio = clock.getDelta() * state.BASE_SPEED;
    }

    state.size = state.EASING_SPEED * state.currAudio + (1-state.EASING_SPEED) * state.size;
    //console.log(state.size)
    if (state.ROTATE_TOGGLE) {
      controls.autoRotate = true;
    } else {
      controls.autoRotate = false;
    }

    controls.update();

    if (bloom.ENABLED) {
      composer.render();
    } else {
      renderer.render( scene, camera );
    }
  };

  // begin animation
  animate();

}

/////////////////////////////
/// WINDOW EVENT HANDLERS ///
/////////////////////////////
{
function handleFiles(event) {
  var files = event.target.files;
  $("#src").attr("src", URL.createObjectURL(files[0]));
  document.getElementById("audio").load();

  /////////////
  /// AUDIO ///
  /////////////

  // create an AudioListener and add it to the camera
  const listener = new AudioListener();
  camera.add( listener );
    
  // create an Audio source
  audio = new Audio( listener );
    
  // load a sound and set it as the Audio object's buffer
  audio.setMediaElementSource(document.getElementById("audio"))
    
  // create an AudioAnalyser, passing in the sound and desired fftSize
  analyser = new AudioAnalyser( audio, 32 );
    
  // get the average frequency of the sound
  const data = analyser.getAverageFrequency();
}
document.getElementById("upload").addEventListener("change", handleFiles, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener( 'resize', onWindowResize );

}


function GenerateRandomScene() {
  // let base_parameters = [state.size, state.percentage];
  
  // return { 
  //   base_parameters, 

  // }
}



// let SCENE = GenerateRandomScene();

// console.log(SCENE.base_parameters.length)

// for (var i = 1; i < SCENE.base_parameters.length; i++) {
//   console.log(SCENE.base_parameters[i]);
//   sceneui.addBinding(SCENE.base_parameters[i], '');
// }