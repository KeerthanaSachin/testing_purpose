import * as THREE from 'three';

// Define colors and positions
const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // Four colors
const cubeSize = 1;
const initialPositions = [
    { x: -2, y: 2 }, { x: 2, y: 2 },
    { x: -2, y: 0 }, { x: 2, y: 0 }
];
const targetPositions = [
    { x: -2, y: -2 }, { x: 2, y: -2 },
    { x: -2, y: -4 }, { x: 2, y: -4 }
];

let selectedCube = null;
let offset = new THREE.Vector3();
let originalPosition = null;
const cubes = [];
const targets = [];

let scene, camera, renderer, raycaster, mouse;

function createCube(color, x, y) {
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 0);
    cube.userData = { color: color }; // Store color in userData
    return cube;
}

function addCube(color, x, y) {
    const cube = createCube(color, x, y);
    scene.add(cube);
    return cube;
}

function initializeScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('scene-container').appendChild(renderer.domElement);

    // Add basic lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5).normalize();
    scene.add(directionalLight);

    // Create cubes with matching colors
    colors.forEach(color => {
        initialPositions.splice(0, 1).forEach(pos => {
            cubes.push(addCube(color, pos.x, pos.y));
        });
    });

    // Create targets with corresponding colors
    colors.forEach(color => {
        targetPositions.splice(0, 1).forEach(pos => {
            targets.push(addCube(color, pos.x, pos.y));
        });
    });

    camera.position.z = 10;

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Optional: Add a grid helper if you want to visualize the grid
    const gridHelper = new THREE.GridHelper(10, 10);
    //scene.add(gridHelper);

    animate();
}

function onMouseDown(event) {
    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cubes);

    if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.geometry instanceof THREE.BoxGeometry && object.userData.color) {
            selectedCube = object;
            originalPosition = selectedCube.position.clone();
            const intersectPoint = intersects[0].point;
            offset.copy(intersectPoint).sub(selectedCube.position);
        }
    }
}

function onMouseMove(event) {
    if (selectedCube) {
        event.preventDefault();

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects([selectedCube]);

        if (intersects.length > 0) {
            const intersectPoint = intersects[0].point;
            selectedCube.position.copy(intersectPoint.sub(offset));
        }
    }
}

function onMouseUp(event) {
    if (selectedCube) {
        let closestTarget = null;
        let minDistance = Infinity;

        // Find the closest target cube with the same color
        targets.forEach(target => {
            if (target.userData.color === selectedCube.userData.color) {
                const distance = selectedCube.position.distanceTo(target.position);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTarget = target;
                }
            }
        });

        // Check if the cube color matches the target color
        if (closestTarget && minDistance < cubeSize) {
            selectedCube.position.set(closestTarget.position.x, closestTarget.position.y, 0);
        } else {
            selectedCube.position.copy(originalPosition);
        }

        selectedCube = null;
        originalPosition = null;
    }
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

export function startPuzzleScene() {
    initializeScene();
    document.getElementById('scene-container').style.display = 'block';
    document.getElementById('back-button').style.display = 'block'; // Show back button
}
