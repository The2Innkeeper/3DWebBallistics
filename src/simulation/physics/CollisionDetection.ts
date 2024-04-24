// CollisionDetection.ts
import * as THREE from 'three';
import { Projectile } from '../entities/Projectile';
import { Target } from '../entities/Target';

export function checkCollision(projectile: Projectile, target: Target, buffer: number = 0): boolean {
    const squaredDistance = projectile.position.distanceToSquared(target.position);
    const collisionDistance = projectile.radius + target.radius + buffer;
    return squaredDistance <= (collisionDistance * collisionDistance);
}
