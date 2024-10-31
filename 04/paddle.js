function createPaddle(gl, color, offset) {
    //************************************************************//
    //
    // CREATE GEOMETRY
    //
    var vertices = new Float32Array( 
        [
            -0.1,  0.05, 0.0,    // V0 // 0
            -0.1, -0.05, 0.0,   // V1, V4 // 1
             0.1,  0.05, 0.0,     // V2, V3 // 2
             0.1, -0.05, 0.0     // V5 // 3
        ] 
    );

    // now use indices
    var indices = new Uint8Array( [ 0, 1, 2, 2, 1, 3 ] ); // 6 bytes

    var v_buffer = gl.createBuffer(); // create
    gl.bindBuffer( gl.ARRAY_BUFFER, v_buffer ); // bind
    gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW ); // put data in
    gl.bindBuffer( gl.ARRAY_BUFFER, null ); // unbind

    var i_buffer = gl.createBuffer(); // create
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, i_buffer ); // bind
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW ); // put data in
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null ); // unbind


    return [v_buffer, i_buffer, color, offset, 6, gl.TRIANGLES];
};

export default createPaddle;