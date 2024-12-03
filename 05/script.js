
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';      
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnaglyphEffect } from 'three/addons/effects/AnaglyphEffect.js';
import { VertexNormalsHelper } from 'three/addons/helpers/VertexNormalsHelper.js';
import {Pane} from 'https://cdn.jsdelivr.net/npm/tweakpane@4.0.5/dist/tweakpane.min.js';

var renderer, controls, scene, camera, FLAG, loader, effect, helper1, helper2, stats;
window['SCENE'] = {
    'anaglyph': false,
    'poly1': null,
    'poly2': null,
    'rotate_poly': false,
    'do_rotate_poly': function () {
        window['SCENE']['rotate_poly'] = !window['SCENE']['rotate_poly'];
    },
    'poly2_old_material': null,
    'change_material': function () {
        // Check if the material has already been changed
        if (!window['SCENE']['poly2_old_material']) {
            // Save the current material and set a new MeshNormalMaterial
            window['SCENE']['poly2_old_material'] = window['SCENE']['poly2'].material.clone();
            window['SCENE']['poly2'].material = new THREE.MeshNormalMaterial();
        } else {
            // Restore the original material
            window['SCENE']['poly2'].material = window['SCENE']['poly2_old_material'].clone();
            window['SCENE']['poly2_old_material'] = null;
        }
    },
    
};

window.onload = function () {

    var pane = new Pane();
    var sceneui = pane.addFolder({ title: 'Scene' });
    sceneui.addBinding(window['SCENE'], 'anaglyph');

    // Three.js setup
    scene = new THREE.Scene();

    // Setup the camera
    var fov = 75;
    var ratio = window.innerWidth / window.innerHeight;
    var zNear = 1;
    var zFar = 10000;
    camera = new THREE.PerspectiveCamera(fov, ratio, zNear, zFar);
    camera.position.set(0, 0, 100);

    // Create renderer and setup canvas
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    // stats.js widget
    stats = new Stats();
    document.body.appendChild( stats.domElement );

    // Anaglyph effect
    effect = new AnaglyphEffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    var polyui;
    loader = new GLTFLoader();

    // Front model
    loader.load('assets/portrait.glb', function (gltf) {
        scene.add(gltf.scene);
        var poly = gltf.scenes[0].children[0];
        poly.scale.set(100, 100, 100);
        poly.quaternion.set(0, 0, 0, 1);

        poly.translateY(-20);
        poly.translateX(20);
        poly.translateZ(40);

        // Assign to poly1
        window['SCENE'].poly1 = poly;
        polyui = pane.addFolder({ title: 'Poly1' });
        polyui.addBinding(window.SCENE.poly1.material, 'wireframe');

        // Add normals helper
        helper1 = new VertexNormalsHelper(poly, 1, 'blue');
        helper1.visible = false;
        scene.add(helper1);
        polyui.addBinding(helper1, 'visible', { label: 'Show normals!' });
    });

    // Back model
    loader.load('assets/portrait.glb', function (gltf) {
        scene.add(gltf.scene);
        var poly = gltf.scenes[0].children[0];
        poly.scale.set(100, 100, 100);
        poly.quaternion.set(0, 0, 0, 1);
        poly.translateY(-20);
        poly.translateX(-20);
        poly.translateZ(-40);

        poly.material.wireframe = true;

        // Assign to poly2
        window['SCENE'].poly2 = poly;

        // Add Poly2 controls
        polyui = pane.addFolder({ title: 'Poly2' });
        polyui.addBinding(window.SCENE.poly2.material, 'wireframe');
        polyui.addButton({ title: 'rotate!' }).on('click', () => {
            window.SCENE.do_rotate_poly();
        });

        // Add Change Material button
        polyui.addButton({ title: 'Change Material!' }).on('click', () => {
            window.SCENE.change_material();
        });

        // Add normals helper
        helper2 = new VertexNormalsHelper(poly, 1, 'blue');
        helper2.visible = false;
        scene.add(helper2);
        polyui.addBinding(helper2, 'visible', { label: 'Show normals!' });
    });

    window['SCENE'].helper_update = function () { 
        helper2.update();
        helper1.update();
    } 

    // Interaction
    controls = new OrbitControls(camera, renderer.domElement);

    // Setup lights
    var ambientLight = new THREE.AmbientLight(0x404040, 100.0);
    scene.add(ambientLight);
    var light1 = new THREE.DirectionalLight(0xff0000, 10.0);
    light1.position.set(-10, 0, 100);
    scene.add(light1);
    var light2 = new THREE.DirectionalLight(0xffffff, 10.0);
    light2.position.set(0, 0, 100);
    scene.add(light2);
    var light3 = new THREE.DirectionalLight(0x0000ff, 10.0);
    light3.position.set(10, 0, 100);
    scene.add(light3);

    // Light controls
    var lightui = pane.addFolder({ title: 'Lights' });
    lightui.addBinding(light2.position, 'x', { min: -300, max: 300 });
    lightui.addBinding(light2.position, 'y', { min: -300, max: 300 });
    lightui.addBinding(light2.position, 'z', { min: -300, max: 300 });
    lightui.addBinding(light2, 'intensity', { min: 0, max: 10 });
    lightui.addBinding(ambientLight, 'color');

    // Animation loop
    animate();
};

function animate() {
    requestAnimationFrame(animate);

    // Update controls
    controls.update();
    stats.update();

    // Handle rotation
    if (window.SCENE.poly2) {
        if (window.SCENE.rotate_poly) {
            var q = new THREE.Quaternion();
            q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
            window.SCENE.poly2.quaternion.slerp(q, 0.01);
            window.SCENE.helper_update()
        } else {
            var q = new THREE.Quaternion();
            q.set(0, 0, 0, 1);
            window.SCENE.poly2.quaternion.slerp(q, 0.01);
            window.SCENE.helper_update()
        }
    }

    // Render
    if (window['SCENE'].anaglyph) {
        effect.render(scene, camera);
    } else {
        renderer.render(scene, camera);
    }

}



/* 
var glitchState = null;
var glitchTimeout = null;

function triggerGlitch() {
    glitchState = Math.random() > 0.5 ? 'wireframe' : 'anaglyph';

    clearTimeout(glitchTimeout);
    glitchTimeout = setTimeout(() => {
        glitchState = null;
    }, 200);
}

function controlGlitch() {
    if (glitchState === 'wireframe') {
        if (window['SCENE'].poly2) {
            window['SCENE'].poly2.scale.set(110, 110, 110);
            window['SCENE'].poly2.material.wireframe = true;
        }
        renderer.render(scene, camera);
    } else if (glitchState === 'anaglyph') {
        if (window['SCENE'].poly2) {
            window['SCENE'].poly2.scale.set(100, 100, 100);
            window['SCENE'].poly2.material.wireframe = false;
        }
        effect.render(scene, camera);
    } else {
        // Normal
        if (window['SCENE'].poly2) {
            window['SCENE'].poly2.scale.set(100, 100, 100);
            window['SCENE'].poly2.material.wireframe = false;
        }
        renderer.render(scene, camera);
    }

    if (Math.random() < 0.03) {
        triggerGlitch();
    }
}*/