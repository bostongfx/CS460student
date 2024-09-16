toggleRotate = false
window.onload = function() {
    r = new X.renderer3D();
    r.init();
    
    cube = new X.cube();
    cube.lengthX = cube.lengthY = cube.lengthZ = 20;
    cube.position = [0,0,0]
    cube.color = [1,1,1];
    r.add(cube); 

    r.onRender = function () {
      if (toggleRotate) {
        r.camera.rotate([-1,0])
      }
    }
    r.render(); // ..and render it
  };