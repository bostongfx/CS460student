import createBricks from './_brick.js';

var BOTTOM_PADDLE_WIDTH = 0.2;
var BOTTOM_PADDLE_LEFT;
var BOTTOM_PADDLE_RIGHT;

var BRICK_OFFSET_X;
var BRICK_OFFSET_Y;

var BALLDIRECTION

function resetBall(OBJECTS) {
    OBJECTS[1][3][0] = 0; // SET TO CENTER
    OBJECTS[1][3][1] = 0;

    BALLDIRECTION = Math.PI / 8 + Math.random();
    BALLDIRECTION *= -1;
    return OBJECTS;
}

function updateBall(gl, OBJECTS) {
    var BALL_X = OBJECTS[1][3][0];
    var BALL_Y = OBJECTS[1][3][1];

    var BOTTOM_PADDLE_X = OBJECTS[0][3][0];
    var BOTTOM_PADDLE_Y = OBJECTS[0][3][1];
    BOTTOM_PADDLE_WIDTH = 0.2;
    BOTTOM_PADDLE_LEFT;
    BOTTOM_PADDLE_RIGHT;

    BRICK_OFFSET_X;
    BRICK_OFFSET_Y;
    //BALLDIRECTION = Math.PI / 8 + Math.random();

    var score_num = 0;

    if (BALL_X >= 0.95) {
        // RIGHT WALL
        BALLDIRECTION = Math.PI - BALLDIRECTION;
    } else if (BALL_X <= -0.95) {
        // LEFT WALL
        BALLDIRECTION = Math.PI - BALLDIRECTION;
    } else if (BALL_Y >= 0.96) {
        // TOP WALL
        BALLDIRECTION = - BALLDIRECTION;
    } else if (BALL_Y >= 0.2) {
        // TOP BRICKS
        for (let i = 2; i < OBJECTS.length; i++) {
            BRICK_OFFSET_X = OBJECTS[i][3][0];
            BRICK_OFFSET_Y = OBJECTS[i][3][1];
            if (BALL_X > BRICK_OFFSET_X - 0.095 &&
                BALL_X < BRICK_OFFSET_X + 0.095 &&
                BALL_Y > BRICK_OFFSET_Y - 0.05 &&
                BALL_Y < BRICK_OFFSET_Y + 0.05) {
                
                BALLDIRECTION = - BALLDIRECTION;
                score_num = OBJECTS[i][6];
                OBJECTS.splice(i, 1);
                
                OBJECTS = score(gl, score_num, OBJECTS);
                
                var audio = new Audio('375115__sgossner__glass_break-glass_break.wav');
                audio.play()
            }
        }
    } else if (BALL_Y <= -0.82) {
        // BOTTOM 
        BOTTOM_PADDLE_LEFT = BOTTOM_PADDLE_X - BOTTOM_PADDLE_WIDTH / 1.8;
        BOTTOM_PADDLE_RIGHT = BOTTOM_PADDLE_X + BOTTOM_PADDLE_WIDTH / 1.8;

        // LET'S CHECK IF A PADDLE IS THERE
        if (BALL_X >= BOTTOM_PADDLE_LEFT && BALL_X <= BOTTOM_PADDLE_RIGHT) {
            // YES, REFLECT
            BALLDIRECTION = -BALLDIRECTION;
            var audio = new Audio('70058__robinhood76__af003-metal-cowbell1-med.wav');
            audio.play();
            //UPDATE STEP ON BOUNCE TO INCREASE SPEED
        } else {
            // LOSE LIFE
            var STOPPED = loseLife();
            OBJECTS = resetBall(OBJECTS);
            return STOPPED;
        }
    }
    
    // UPDATE BALL POSITION
    var score_ = parseInt(document.getElementById("score").innerText);

    OBJECTS[1][3][0] += Math.cos(BALLDIRECTION) * (0.005 + score_ / 4000);
    OBJECTS[1][3][1] += Math.sin(BALLDIRECTION) * (0.005 + score_ / 4000);
}

function score(gl, score_value, OBJECTS) {

    var old_score = document.getElementById("score").innerText;
    document.getElementById("score").innerText = parseInt(old_score) + score_value;
    if (OBJECTS.length == 2) { // IF ALL BLRICKS DESTROYED CREATE MORE
        OBJECTS.push(...createBricks(gl));
    }
    return OBJECTS;
}

function loseLife() {
    var STOPPED = false; 
    var old_life = document.getElementById("lives").innerText;
    document.getElementById("lives").innerText = parseInt(old_life) - 1;
    if (old_life == 1) {
        STOPPED = true;
        document.getElementById("overlay").style.display = "block";
        document.getElementById("game_over").style.display = "block";
    }
    return STOPPED;
}

function createBall(gl, color, offset) {
    //************************************************************//
    //
    // CREATE GEOMETRY
    //
    var vertices = new Float32Array( 
        [
            0., 0., 0.,
        ] 
    );

    // now use indices
    var indices = new Uint8Array( [ 0 ] );

    var v_buffer = gl.createBuffer(); // create
    gl.bindBuffer( gl.ARRAY_BUFFER, v_buffer ); // bind
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW ); // put data in
    gl.bindBuffer( gl.ARRAY_BUFFER, null ); // unbind

    var i_buffer = gl.createBuffer(); // create
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, i_buffer ); // bind
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW ); // put data in
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null ); // unbind


    return [v_buffer, i_buffer, color, offset, 1, gl.POINTS];
}


export { createBall, resetBall, updateBall };