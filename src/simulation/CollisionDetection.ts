// CollisionDetection.ts
import * as THREE from 'three';
import { Projectile } from '../models/Projectile';
import { Target } from '../models/Target';

export function checkCollision(projectile: Projectile, target: Target, buffer: number = 0): boolean {
    const distance = projectile.position.distanceTo(target.position);
    return distance <= (projectile.radius + target.radius) + buffer;
}
