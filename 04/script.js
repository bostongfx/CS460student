import animate from './animate.js';
import { createBall, resetBall } from './ball.js';
import createBricks from './brick.js';
import createPaddle from './paddle.js';


var c, gl, v_shader, f_shader, shaderprogram;
var STOPPED = false;
var OBJECTS = [];


window.onkeydown = function (e) {
    if (STOPPED) {
        // restart the game
        window.location.reload();
    }
    // TODO Part 3
    var score_ = parseInt(document.getElementById("score").innerText);

    switch (e.key) {
        case "ArrowLeft":
            if (OBJECTS[0][3][0] > -0.9) {
                OBJECTS[0][3][0] -= (0.1 + score_ / 4000);
            }
            break;
        case "ArrowRight":
            if (OBJECTS[0][3][0] < 0.9) {
                OBJECTS[0][3][0] += (0.1 + score_ / 4000);
            }
            break;
    }

};

window.onload = function () {
    var audio = new Audio('244679__insidebeat__dictadrum.wav');
    audio.volume = 0.1; 
    audio.play();


    //************************************************************//
    //
    // INITIALIZE WEBGL
    //
    c = document.getElementById("c"); // setup canvas
    gl = c.getContext("webgl"); // setup GL context
    gl.viewport(0, 0, c.width, c.height);

    //************************************************************//
    //
    // SHADERS
    //
    v_shader = gl.createShader(gl.VERTEX_SHADER);
    f_shader = gl.createShader(gl.FRAGMENT_SHADER);

    // compile vertex shader
    gl.shaderSource(
        v_shader,
        document.getElementById("vertexshader").innerText
    );
    gl.compileShader(v_shader);
    if (!gl.getShaderParameter(v_shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(v_shader));
    } else {
        console.log("Vertex Shader compiled!");
    }

    // compile fragment shader
    gl.shaderSource(
        f_shader,
        document.getElementById("fragmentshader").innerText
    );
    gl.compileShader(f_shader);
    if (!gl.getShaderParameter(f_shader, gl.COMPILE_STATUS)) {
        console.log(gl.getShaderInfoLog(f_shader));
    } else {
        console.log("Fragment Shader compiled!");
    }

    // attach and link the shaders
    shaderprogram = gl.createProgram();
    gl.attachShader(shaderprogram, v_shader);
    gl.attachShader(shaderprogram, f_shader);

    gl.linkProgram(shaderprogram);

    gl.useProgram(shaderprogram);

    STOPPED = false;

    OBJECTS = [];
    OBJECTS.push(createPaddle(gl, [0, 0, 1, 1], [0, -0.9, 0])); // BOTTOM PADDLE
    OBJECTS.push(createBall(gl, [1, 0, 0, 1], [0, 0, 0])); // BALL
    OBJECTS.push(...createBricks(gl, OBJECTS)); // ADD BRICKS

    resetBall(OBJECTS);

    STOPPED = animate(gl, STOPPED, OBJECTS, shaderprogram);
};

