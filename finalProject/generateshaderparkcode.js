// import { 

// } from '';


export function generateshaderparkcode(default_shader)  {
  // Put your Shader Park Code here
  if (default_shader) {
    return `
    let size = input()
    rotateY(mouse.x * PI / 2 + time)
    rotateX(mouse.y * PI / 2 + time)
    metal(.5)
    color(getRayDirection()+.2)
    rotateY(getRayDirection().y*4+time)
    boxFrame(vec3(size), size/2)
    shine(.4)
    expand(.02)
    blend(nsin(time*1.5)*0.5 + 0.1)
    sphere(size/2)

    `;
  } else {
    // Helper functions for randomization
  const randomFloat = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
  const randomVec3 = () => `[${randomFloat(-1, 1)}, ${randomFloat(-1, 1)}, ${randomFloat(-1, 1)}]`;
  const randomColor = () => `[${randomFloat(0, 1)}, ${randomFloat(0, 1)}, ${randomFloat(0, 1)}]`;
  const randomShape = () => {
    const shapes = ["sphere", "box", "cylinder", "torus"];
    return shapes[Math.floor(Math.random() * shapes.length)]; 
  };
    return `
      let size = input()
      shape(() => {
        // Random transformations
        translate(${randomVec3()});
        scale(${randomFloat(0.5, 1.5)});
        rotateY(${randomFloat(0, Math.PI * 2)});
        rotateX(${randomFloat(0, Math.PI * 2)});
        
        // Random color and shape
        color(${randomColor()});
        ${randomShape()}();
      } 
    `;
  }
  
};

//
// let size = input();
// rotateY(mouse.x * PI / 2 + time*.5)
// rotateX(mouse.y * PI / 2 + time*.5)
// rotateZ(mouse.x - mouse.y * PI / 2 + time*.5)
// metal(.5)
// color(getRayDirection()+.2)
// rotateY(getRayDirection().y*4+time)
// boxFrame(vec3(size), size/2)
// shine(.4)
// expand(.02)
// blend(nsin(time)*.6)
// sphere(size/2)