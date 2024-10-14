function createBrick(gl, color, offset, score) {
    //************************************************************//
    //
    // CREATE GEOMETRY
    //

    var vertices = new Float32Array([
        -0.095,
        0.05,
        0.0, // V0      // 0
        -0.095,
        -0.05,
        0.0, // V1, V4  // 1
        0.095,
        0.05,
        0.0, // V2, V3  // 2
        0.095,
        -0.05,
        0.0, // V5      // 3
    ]);

    var indices = new Uint8Array([
        0,
        1,
        2, // Triangle 1
        2,
        1,
        3,
    ]); // Triangle 2

    var v_buffer = gl.createBuffer(); // create
    gl.bindBuffer(gl.ARRAY_BUFFER, v_buffer); // bind
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // put data in
    gl.bindBuffer(gl.ARRAY_BUFFER, null); // unbind

    var i_buffer = gl.createBuffer(); // create
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, i_buffer); // bind
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW); // put data in
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null); // unbind

    // TODO Part 2
    return [v_buffer, i_buffer, color, offset, 6, gl.TRIANGLES, score];
}

function createBricks(gl) {
    var offset_x = -0.8
    var offset_y = 0.9
    var OBJS = []

    var color = [
        [Math.random(), Math.random(), Math.random(), 1],
        [Math.random(), Math.random(), Math.random(), 1],
        [Math.random(), Math.random(), Math.random(), 1],
        [Math.random(), Math.random(), Math.random(), 1],
    ]
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 9; j++) {
            OBJS.push(createBrick(gl, color[i], [offset_x, offset_y, 0], 4 - i))
            offset_x += 0.2
        }
        offset_x = -0.8
        offset_y -= 0.14
    }
    return OBJS
}

export default createBricks;