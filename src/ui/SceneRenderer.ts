import { Shooter } from '.././models/Shooter';
import { spawnRandomTarget } from '.././services/TargetSpawner';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class SceneRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;

  constructor() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.shadowMap.enabled = true;

      const sceneContainer = document.getElementById('scene-container');
      if (sceneContainer) {
          sceneContainer.appendChild(this.renderer.domElement);
      } else {
          console.error('Unable to find the scene container element!');
      }

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);

      this.initializeScene();
      const shooter: Shooter = new Shooter([new THREE.Vector3(0, 0, 0)]);
      shooter.addToScene(this.scene);
      spawnRandomTarget(this.scene);
      this.animate();
  }

  private initializeScene(): void {
      this.scene.background = new THREE.Color('skyblue');

      // Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.set(5, 5, 5);
      light.castShadow = true;
      this.scene.add(light);
      this.scene.add(new THREE.AmbientLight(0x404040)); // Soft ambient light
      
      // Camera
      const cameraDistance = 5;
      const cameraZoom = 0.2;

      this.camera.position.z = cameraDistance;
      this.camera.zoom = cameraZoom;
  }

  private animate(): void {
      requestAnimationFrame(() => this.animate());
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    }
}

export default SceneRenderer;