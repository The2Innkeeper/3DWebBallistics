import { camera, renderer } from './sceneSetup.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const controls = new OrbitControls(camera, renderer.domElement);
controls.update();