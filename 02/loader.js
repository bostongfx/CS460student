// Global list to store multiple camera views
var CAMERAS = [];
var cameraLoop;
var currentCameraIndex = 0;

// Function to download the scene and camera information as a JSON file
function download() {
    // get all cubes
    ALL_CUBES = [];

    for (var i = 0; i < r.Ha.length; i++) {
        // note: r.Ha are all objects in the scene
        var color = r.Ha[i].color;
        var matrix = r.Ha[i].transform.matrix;
        ALL_CUBES.push([color, matrix]);
    }

    // create JSON object
    var out = {};
    out['cubes'] = ALL_CUBES;
    out['camera'] = r.camera.view;  // Current camera view
    out['cameras'] = CAMERAS;       // All saved camera views

    // from https://stackoverflow.com/a/30800715
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(out));

    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "scene.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// Function to upload the scene and restore saved cubes and camera positions
function upload(scene) {
    var req = new XMLHttpRequest();
    req.responseType = 'json';
    req.open('GET', scene, true);
    req.onload = function() {
        loaded = req.response;

        // parse cubes
        for (var cube in loaded['cubes']) {
            cube = loaded['cubes'][cube];

            var color = cube[0];
            var matrix = cube[1];

            var loaded_cube = new X.cube();
            loaded_cube.color = color;
            loaded_cube.transform.matrix = new Float32Array(Object.values(matrix));
            loaded_cube.lengthX = loaded_cube.lengthY = loaded_cube.lengthZ = CUBE_SIDELENGTH;

            r.add(loaded_cube);
        }

        // restore first camera position and saved camera views
        if (loaded['camera']) {
            r.camera.view = new Float32Array(Object.values(loaded['camera']));
        }
        if (loaded['cameras'] && loaded['cameras'].length > 0) {
            CAMERAS = loaded['cameras'];
            r.camera.view = new Float32Array(Object.values(CAMERAS[0])); // Set the first camera view
        }
    };
    req.send(null);
}

// Event listener to save the current camera view when 'C' is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'C') {
        // Store current camera position
        CAMERAS.push(r.camera.view.slice());  // Save a copy of the current camera view matrix
        console.log("Camera position saved. Total cameras: " + CAMERAS.length);
    }
});

// Event listener to toggle camera loop when 'V' is pressed
document.addEventListener('keydown', function(event) {
    if (event.key === 'V') {
        if (cameraLoop) {
            clearInterval(cameraLoop);  // Stop the camera loop
            cameraLoop = null;
            console.log("Camera loop stopped.");
        } else {
            cameraLoop = setInterval(function() {
                if (CAMERAS.length > 0) {
                    // Switch to the next camera in the list
                    currentCameraIndex = (currentCameraIndex + 1) % CAMERAS.length;
                    r.camera.view = new Float32Array(Object.values(CAMERAS[currentCameraIndex]));
                    console.log("Switched to camera: " + currentCameraIndex);
                }
            }, 1000);  // Switch camera every 1 second
            console.log("Camera loop started.");
        }
    }
});
