import { updateBall } from './_ball.js';

function animate(gl, STOPPED, OBJECTS, shaderprogram) {
    if (STOPPED) {
        return true;
    }

    requestAnimationFrame(() => animate(gl, STOPPED, OBJECTS, shaderprogram));

    // CLEAR NOW BEFORE ANY DRAWING
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // TODO Part 4
    for (var o = 0; o < OBJECTS.length; o++) {
        var current = OBJECTS[o];

        var v_buffer = current[0];
        var i_buffer = current[1];
        var COLOR = current[2];
        var OFFSET = current[3];
        var VERTEXCOUNT = current[4];
        var PRIMITIVE = current[5];

        // CONNECT SHADER WITH GEOMETRY
        gl.bindBuffer(gl.ARRAY_BUFFER, v_buffer);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i_buffer);

        // find the attribute in the shader source
        var a_position = gl.getAttribLocation(shaderprogram, "position");
        gl.vertexAttribPointer(a_position, 3, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(a_position);

        var u_color = gl.getUniformLocation(shaderprogram, "color");
        gl.uniform4fv(u_color, new Float32Array(COLOR));

        var u_offset = gl.getUniformLocation( shaderprogram, 'offset' );
        //gl.uniform3fv( u_offset, new Float32Array( OFFSET ) );
        
        var u_transform = gl.getUniformLocation(shaderprogram, "transform");
        var x = OFFSET[0];
        var y = OFFSET[1];
        var current_transform = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, 0, 1,
        ]);
        gl.uniformMatrix4fv(u_transform, false, current_transform);
        
        if (o == 1) {
            STOPPED = updateBall(gl, OBJECTS);

            if (STOPPED) {
                break;
            }
        }

        // DRAW!
        gl.drawElements(PRIMITIVE, VERTEXCOUNT, gl.UNSIGNED_BYTE, 0);
    }
    
    return STOPPED
}

export default animate;