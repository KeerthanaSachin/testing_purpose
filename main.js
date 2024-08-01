import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//obj loader
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { startPuzzleScene } from './puzzle.js';
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({
    antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(0, 0, 10)

const controls = new OrbitControls(camera, renderer.domElement)
controls.update()

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(0, 10, 0)
scene.add(directionalLight)

// Load the texture of the floor
const floorTexture = new THREE.TextureLoader().load("./textures/wall.jpg");

// Create the floor plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture,
    color: 0xF4C2C2,
    side: THREE.DoubleSide,
});
const floorPlane = new THREE.Mesh(planeGeometry, planeMaterial);
floorPlane.rotation.x = Math.PI / 2;
floorPlane.position.y = -Math.PI;
scene.add(floorPlane);

// Create the walls
const wallGroup = new THREE.Group();
scene.add(wallGroup)

// Texture for walls
const wallTexture = new THREE.TextureLoader().load("./textures/wall.jpg");

// Front wall
const frontWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb })
);
frontWall.position.z = -20;
wallGroup.add(frontWall);

// Left wall
const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb })
);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -25;
wallGroup.add(frontWall, leftWall);

// Right wall
const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(50, 20, 0.001),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb })
);
rightWall.rotation.y = -Math.PI / 2;
rightWall.position.x = 25;
wallGroup.add(frontWall, leftWall, rightWall);

// Loop through each wall and create the bounding box
for (let i = 0; i < wallGroup.children.length; i++) {
    wallGroup.children[i].BBox = new THREE.Box3();
    wallGroup.children[i].BBox.setFromObject(wallGroup.children[i]);
}

// Texture for ceiling
const ceilingTexture = new THREE.TextureLoader().load("./textures/ceiling.jpg");

// Create the ceiling
const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
const ceilingMaterial = new THREE.MeshBasicMaterial({
    //map: ceilingTexture,
    color: 0xF4C2C2,
    side: THREE.DoubleSide,
});
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 10;
scene.add(ceiling);

let butterfly;
const butterflyLoader = new GLTFLoader().setPath('./Models/');
butterflyLoader.load('cartoon_wolf.glb', (gltf) => {
    butterfly = gltf.scene;
    butterfly.position.set(10, -3.5, -10);
    butterfly.scale.set(1, 1, 1);
    butterfly.rotation.set(0, 0, 0)
    scene.add(butterfly);
})

let duck;
const butterflyLoader1 = new GLTFLoader().setPath('./Models/');
butterflyLoader1.load('duck.glb', (gltf) => {
    duck = gltf.scene;
    duck.position.set(0, -3, -10);
    duck.scale.set(0.005, 0.005, 0.005);
    duck.rotation.set(0, 0, 0)
    scene.add(duck);
})

// Load abc cube
let abccube;
const abccubeLoader = new GLTFLoader().setPath('./Models/');
abccubeLoader.load('abc_cube_toy.glb', (gltf) => {
    abccube = gltf.scene;
    abccube.position.set(-10, -3, -8);
    abccube.scale.set(0.03, 0.03, 0.03);
    abccube.rotation.set(0, 0, 0)
    scene.add(abccube);
})

// Load the piano model
let piano;
const pianoLoader = new GLTFLoader().setPath('./Models/');
pianoLoader.load('piano.glb', (gltf) => {
    piano = gltf.scene;
    piano.position.set(-18, -3, -12);
    piano.scale.set(15, 15, 15);
    piano.rotation.set(0, 0, 0)
    scene.add(piano);
})

let treeClone
const duckLoader = new GLTFLoader().setPath('./Models/');
duckLoader.load('duck.glb', (gltf) => {
    const tree = gltf.scene;
    const positions = [
        { x: -10, y: -3, z: 2 },
        { x: -8, y: -3, z: -15 },
        { x: 20, y: -3, z: 0 },
    ];
    positions.forEach(pos => {
    
        const treeClone = tree.clone();
        treeClone.position.set(pos.x, pos.y, pos.z);
        treeClone.scale.set(0.005, 0.005, 0.005);
        scene.add(treeClone);

        //Function to detect click on the duck
  function onMouseClick2(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(duck, true);
    if (intersects.length > 0) {
      duckSound.play();
    }
  }
  window.addEventListener('click', onMouseClick2, false)

  //Audio for duck
const duckSound1 = new THREE.Audio(listener);
const audioLoader3 = new THREE.AudioLoader();
audioLoader3.load('./Audio/duck.mp3', function(buffer) {
  duckSound.setBuffer(buffer);
  duckSound.setLoop(false);
  duckSound.setVolume(0.5);
  });
  
  //Function to detect click on the duck
  function onMouseClick3(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(treeClone, true);
    if (intersects.length > 0) {
      duckSound.play();
    }
  }
  window.addEventListener('click', onMouseClick3, false)
    });
});

// Load a toy model
let toy;
const toyLoader = new GLTFLoader().setPath('./Models/');
toyLoader.load('ring.glb', (gltf) => {
    toy = gltf.scene;
    toy.position.set(-15, -3, -3);
    toy.scale.set(10, 10, 10);
    toy.rotation.set(0, 0, 0)
    scene.add(toy);
})

let bed;
const bedLoader = new GLTFLoader().setPath('./Models/');
toyLoader.load('bed.glb', (gltf) => {
    bed = gltf.scene;
    bed.position.set(18, -3, -8);
    bed.scale.set(3, 3, 3);
    bed.rotation.set(0, Math.PI, 0)
    scene.add(bed);
})

let ring1;
const ringLoader = new GLTFLoader().setPath('./Models/');
ringLoader.load('blocks.glb', (gltf) => {
    ring1 = gltf.scene;
    ring1.position.set(15, -2, 0);
    ring1.scale.set(400, 400, 400);
    ring1.rotation.set(0, 0, 0)
    scene.add(ring1);
})

let table;
const tableLoader = new GLTFLoader().setPath('./Models/');
tableLoader.load('table.glb', (gltf) => {
    table = gltf.scene;
    table.position.set(17, -3, -2);
    table.scale.set(2, 2, 2);
    table.rotation.set(0, 0, 0)
    scene.add(table);
})

let babypack
const babypackLoader = new GLTFLoader().setPath('./Models/');
babypackLoader.load('baby_pack.glb', (gltf) => {
    babypack = gltf.scene;
    babypack.position.set(-10, -3, -2);
    babypack.scale.set(0.1, 0.1, 0.1);
    babypack.rotation.set(0, 0, 0)
    scene.add(babypack);
})

let toytrain;
const toytrainLoader = new GLTFLoader().setPath('./Models/');
toytrainLoader.load('toy_train.glb', (gltf) => {
    toytrain = gltf.scene;
    toytrain.position.set(0, -3, 17);
    toytrain.scale.set(0.5, 0.5, 0.5);
    toytrain.rotation.set(0, 0, 0)
    scene.add(toytrain);
})

let cartoy;
const cartoyLoader = new GLTFLoader().setPath('./Models/');
cartoyLoader.load('car_toy.glb', (gltf) => {
    cartoy = gltf.scene;
    cartoy.position.set(-15, -3, 5);
    cartoy.scale.set(5, 5, 5);
    cartoy.rotation.set(0, 0, 0)
    scene.add(cartoy)
})

let horse;
let mixer; // Declare mixer at the top level
let clock = new THREE.Clock();

const horseLoader = new GLTFLoader().setPath('./Models/');
horseLoader.load('horse.glb', (gltf) => {
    horse = gltf.scene;
    horse.position.set(9, -3, -2);
    horse.scale.set(2, 2, 2);
    horse.rotation.set(0, 0, 0)
    scene.add(horse)

    mixer = new THREE.AnimationMixer(horse); // Initialize mixer with horse model
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
})

// Audio for piano
const listener = new THREE.AudioListener();
camera.add(listener);

const pianoSound = new THREE.Audio(listener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('./Audio/piano.mp3', function(buffer) {
    pianoSound.setBuffer(buffer);
    pianoSound.setLoop(false);
    pianoSound.setVolume(0.5);
});

// Function to detect click on the piano
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(piano, true);
    if (intersects.length > 0) {
        pianoSound.play();
    }
}

window.addEventListener('click', onMouseClick, false);

//Audio for duck
const duckSound = new THREE.Audio(listener);
const audioLoader2 = new THREE.AudioLoader();
audioLoader2.load('./Audio/duck.mp3', function(buffer) {
  duckSound.setBuffer(buffer);
  duckSound.setLoop(false);
  duckSound.setVolume(0.5);
  });
  
  


// Resizing window
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
})

// Function to create paintings
function createPainting(imageURL, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageURL);
  const paintingMaterial = new THREE.MeshBasicMaterial({
      map: paintingTexture,
  });
  const paintingGeometry = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
  painting.position.set(position.x, position.y, position.z);
  return painting;
}

// Add paintings to the scene
const painting1 = createPainting(
  './textures/rainbow.jpg', 10, 5, new THREE.Vector3(0, 4, -19.99)
);

const painting3 = createPainting(
  './textures/paint1.jpg', 10, 5, new THREE.Vector3(-24.99, 4, -10)
);
const painting4 = createPainting(
  './textures/paint2.jpg', 10, 5, new THREE.Vector3(24.99, 4, -10)
);
const painting5 = createPainting(
  './textures/paint2.jpg', 10, 5, new THREE.Vector3(-24.99, 4, 10)
);
const painting6 = createPainting(
  './textures/paint.jpg', 10, 5, new THREE.Vector3(24.99, 4, 10)
);


painting3.rotation.y = Math.PI / 2;
painting4.rotation.y = -Math.PI / 2;
painting5.rotation.y = Math.PI / 2;
painting6.rotation.y = -Math.PI / 2;


scene.add(painting1, painting3, painting4, painting5, painting6);


function createBall() {
  const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(2, -3, 2);
  ball.rotation.z  = Math.PI
  scene.add(ball);

  // Ball throwing logic
  let isThrowing = false;

  window.addEventListener('keydown', (event) => {
      if (event.code === 'Space' && !isThrowing) {
          isThrowing = true;
          const throwDirection = new THREE.Vector3(-1 , 0, 0);
          ball.velocity = throwDirection.multiplyScalar(0.1);

          const ballInterval = setInterval(() => {
              ball.position.add(ball.velocity);

              if (ball.position.x < -4) {
                  clearInterval(ballInterval);
                  scene.remove(ball);
                  isThrowing = false;
              }
          }, 16);
      } 
  }); 
}

createBall();

function createBall1() {
  const ballGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.set(-5, -3, 2);
  ball.rotation.z  = Math.PI
  scene.add(ball);

  // Ball throwing logic
  let isThrowing = false;

  window.addEventListener('keydown', (event) => {
      if (event.code === 'Space ' && !isThrowing) {
          isThrowing = true;
          const throwDirection = new THREE.Vector3(1 , 0, 0);
          ball.velocity = throwDirection.multiplyScalar(0.1);

          const ballInterval = setInterval(() => {
              ball.position.add(ball.velocity);

              if (ball.position.x < 4) {
                  clearInterval(ballInterval);
                  scene.remove(ball);
                  isThrowing = false;
              }
          }, 16);
      } 
  }); 
}

createBall1();




//Axes helper
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);


//load baby model
const loader = new GLTFLoader();
loader.load('./Models/baby1.glb', (gltf) => {
  const baby = gltf.scene; 
  baby.scale.set(0.5, 0.5, 0.5);
  baby.position.set(3, -3, 2);
  baby.rotation.y = Math.PI
  scene.add(baby);
  });


  const loader1 = new GLTFLoader();
loader1.load('./Models/baby1.glb', (gltf) => {
  const baby = gltf.scene;
  baby.scale.set(0.5, 0.5, 0.5);
  baby.position.set(-5 , -3, 2);
  //baby.rotation.y = Math.PI 
  scene.add(baby);
  });

  


  // Show the puzzle scene
function showPuzzleScene() {
    document.body.removeChild(renderer.domElement);
    document.getElementById('scene-container').style.display = 'block';
    document.getElementById('back-button').style.display = 'block'; // Show back button
    startPuzzleScene();
}

// Show the default scene
function showDefaultScene() {
    document.getElementById('scene-container').style.display = 'none';
    document.body.appendChild(renderer.domElement);
    document.getElementById('back-button').style.display = 'none'; // Hide back button
}

// Event listeners
document.getElementById('start-button').addEventListener('click', showPuzzleScene);
document.getElementById('back-button').addEventListener('click', showDefaultScene);

//puzzle


//load the model using url 
const loader4 = new GLTFLoader();
loader4.load(
'https://r5r5ipbebwuzarr8.public.blob.vercel-storage.com/Asian_Boy-ozrZUqPLJNgTzhqsOynsvPmOyIREgg.glb',
(gltf) => {
    const model = gltf.scene;
    model.scale.set(0.5, 0.5, 0.5);
    model.position.set(0, 0, 0);
    scene.add(model);
    })


 








const animate = function () {
    requestAnimationFrame(animate)
    controls.update()
    
    if (mixer) mixer.update(clock.getDelta()); 
    
      renderer.render(scene, camera)
}

animate()


window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});