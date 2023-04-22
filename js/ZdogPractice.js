//<script src="zdog-demo.js"></script>

// create illo
const TAU = Zdog.TAU;
const illo = new Zdog.Illustration({
    // set canvas with selector
    element: '.finn',
    dragRotate: true,
    rotate: {x: -TAU/8, y: 5},
  });

const hips = new Zdog.Shape({
    addTo: illo,
    path: [ { x: -12}, { x: 12}],
    stroke: 16,
    color: '#0047AB',
    rotate: { x: TAU/8},
    translate: { y: 8},

});

const ground = new Zdog.Anchor({
    addTo: hips,
    rotate: {x: TAU/8},
  });


const leg = new Zdog.Shape({
    addTo: hips,
    path: [ { y: 0}, {y: 18}],
    translate: {x: -12},
    rotate: { x: TAU/4},
    color: '#0047AB',
    stroke: 16,
});
const calve = new Zdog.Shape({
    addTo: leg,
    path: [{y: 18}, {y: 46}],
    color: '#E9DAC4',
    stroke: 16,
});
const sock = new Zdog.RoundedRect({
    addTo: calve,
    width: 7,
    height: 4,
    cornerRadius: 4,
    stroke: 18,
    translate: { y: 46},
    //path: [{y: 46}, {y: 48}],
    color: '#FFFF',
    //stroke: 18,
});


const foot = new Zdog.RoundedRect({
    addTo: leg,
    width: 8,
    height: 16,
    cornerRadius: 1,
    translate: { y: 56, z: 8},
    color: '#000',
    fill: true,
    stroke: 16,
    rotate: { x: TAU/4},

});

leg.copyGraph({
    translate: { x: 12},
    rotate: {x: -TAU/8},
});

const chest = new Zdog.RoundedRect({
    addTo: hips,
    width: 20,
  height: 40,
  stroke: 25,
  fill: true,
    // path: [{ x: -6}, { x: 6}, {y: -4}, {y: 4}],
     translate: { y:-40 },
    // stroke: 40,
    color: '#89CFF0',
});

const upperArm = new Zdog.Shape({
    addTo: chest,
    path: [ {y: 0}, {y: 24}],
    translate: { x: -20, y: -8},
    color: '#E9DAC4',
    stroke: 16,
    rotate: { x: -TAU/ 4},
});

const forearm = new Zdog.Shape({
    addTo: upperArm,
    path: [ {y: 0}, {y: 40}],
    translate: { y:24},
    color: '#E9DAC4',
    stroke: 16,
    rotate: { x: TAU/8},
});

// const hand = new Zdog.Shape({
//     addTo: forearm,
//     translate: { y: 24, z: 4},
//     stroke: 24,
//     color: '#E9DAC4',
// });

upperArm.copyGraph({
    translate: { x:20, y: -8},
    rotate: {x: TAU/4},
});

const head = new Zdog.RoundedRect({
    addTo: chest,
    width: 30,
    height: 20,
    cornerRadius: 30,
   // path: [ {x: 3}, {x: 21}],
    stroke:4,
    fill: true,
    translate: { y: -38, z: 16},
    color: "#E9DAC4",
    backface: false,
    

});
const hat = new Zdog.Shape({
    addTo: chest,
    path: [ {y: 0}, {y: 10}],
    stroke:50,
    translate: { y: -40},
    color: "#FFFFFF",
    

});
const ear = new Zdog.Shape({
    addTo: hat,
    diameter: 8,
    quarters: 2,
    path: [ {x: 0}, {x:10}],
    translate: {y: -14, x: 19, z: 2},
    rotate: {z: -TAU/4 },
    stroke: 7,
    color: '#FFFFFF',
    backface: false,
});

ear.copy({
    translate: {y: -14, x: -19, z: 2},

});

const eye = new Zdog.Shape({
    addTo: head,
    diameter: 8,
    quarters: 2,
    translate: {y: -5, x: 9, z: 2},
    rotate: {z: -TAU/4 },
    stroke: 2,
    color: '#636',
    backface: false,
});

eye.copy({
    translate: {y: -5, x: -10, z: 2},
});

const smile = new Zdog.Ellipse({
    addTo: head,
    diameter: 12,
    quarters: 2,
    translate: {y: 2, x: 0, z: 2},
    rotate: {z: TAU/4 },
    closed: false,
    color: '#636',
    stroke: 2,
    backface: false,
});

const jake = new Zdog.Illustration({
    // set canvas with selector
    element: '.jake',
    dragRotate: true,
    rotate: {x: -TAU/8, y: 5},
  });

  const body = new Zdog.Shape({
    addTo: jake,
    path: [ {y: 0}, {y: 30}],
    stroke:70,
    translate: { y: -40},
    color: "#FAD02C",
});
const jakeEye = new Zdog.Ellipse({
    addTo: body,
    diameter: 12,
    quarters: 4,
    fill: true,
    color: '#FFFF',
    stroke: 5,
    backface: false,

})



function animate(){
    illo.rotate.y += 0.03;
    //illo.rotate.x += 0.05;
    jake.updateRenderGraph()
    illo.updateRenderGraph()

    requestAnimationFrame(animate)
}

animate()
  