import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import {camera, renderer} from "./sceneSetup.js";

// Add orbit controls
export const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(0, 5, 30);
controls.update();