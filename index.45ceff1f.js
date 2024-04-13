// Setup scene, camera, renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);
// Create a sphere
const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshPhongMaterial({
    color: 0xff0000
});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);
// Ground plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    side: THREE.DoubleSide
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);
// Grid helper
const gridHelper = new THREE.GridHelper(100, 100);
scene.add(gridHelper);

//# sourceMappingURL=index.45ceff1f.js.map
