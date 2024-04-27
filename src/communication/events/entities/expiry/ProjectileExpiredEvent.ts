import { Projectile } from "../../../../simulation/entities/implementations/Projectile";

export class ProjectileExpiredEvent {
    constructor(
        public readonly projectile: Projectile,
        public readonly reason: 'lifetime' | 'distance'
    ) {}
}