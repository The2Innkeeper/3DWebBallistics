import * as THREE from 'three';

export class Shooter {
    position: THREE.Vector3;
    private scaledPositionDerivatives: THREE.Vector3[];
    radius: number;
    height: number;
    private mesh: THREE.Mesh;
  constructor(scaledPositionDerivatives: THREE.Vector3[], radius: number = 0.625, height: number = 2, radialSegments: number = 32) {
    this.position = scaledPositionDerivatives[0].clone();
    this.scaledPositionDerivatives = scaledPositionDerivatives.map(derivative => derivative.clone());
    this.radius = radius;
    this.height = height;

    // Cylinder Geometry for Shooter
    const geometry = new THREE.CylinderGeometry(radius, radius, height, radialSegments);
    const material = new THREE.MeshPhongMaterial({ color: 0x555555 }); // Dark gray
    this.mesh = new THREE.Mesh(geometry, material);

    // Initialize base position at origin shifted down by radius
    this.mesh.position.set(0, height / 2 - radius, 0);
  }

  // Method to get the shooter's position derivatives
  getPositionDerivatives(): THREE.Vector3[] {
    return this.scaledPositionDerivatives;
  }

  // Method to add the target to a scene
  addToScene(scene: THREE.Scene): void {
      scene.add(this.mesh);
  }

  // Method to remove the target from a scene
  removeFromScene(scene: THREE.Scene): void {
      scene.remove(this.mesh);
  }
}