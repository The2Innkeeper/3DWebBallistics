import { eventBus } from '../../../communication/EventBus';
import { Entity } from '../../entities/implementations/classes/Entity';
import { ProjectileExpiredEvent } from '../../../communication/events/entities/expiry/ProjectileExpiredEvent';
import { TargetExpiredEvent } from '../../../communication/events/entities/expiry/TargetExpiredEvent';
import { Projectile } from '../../entities/implementations/Projectile';
import { BaseMovable } from '../../entities/implementations/classes/BaseMovable';
import { TargetSpawnedEvent } from '../../../communication/events/entities/spawning/TargetSpawnedEvent';
import { ProjectileSpawnedEvent } from '../../../communication/events/entities/spawning/ProjectileSpawnedEvent';
import { CollisionEvent } from '../../../communication/events/entities/CollisionEvent';

export class EntityManager {
    private targetSpawnOrder: BaseMovable[] = [];
    private projectileSpawnOrder: Projectile[] = [];

    constructor() {
        this.subscribeToEvents();
    }

    private subscribeToEvents(): void {
        eventBus.subscribe(CollisionEvent, this.onCollision.bind(this));
        eventBus.subscribe(ProjectileExpiredEvent, this.onProjectileExpired.bind(this));
        eventBus.subscribe(TargetExpiredEvent, this.onTargetExpired.bind(this));
        eventBus.subscribe(TargetSpawnedEvent, this.onTargetSpawned.bind(this));
        eventBus.subscribe(ProjectileSpawnedEvent, this.onProjectileSpawned.bind(this));
    }

    public getOldestUnengagedTarget(): BaseMovable | null {
        const projectileCount = this.projectileSpawnOrder.length;
        return projectileCount in this.targetSpawnOrder ? this.targetSpawnOrder[projectileCount] : null;
    }
    
    private addTarget(target: BaseMovable): void {
        this.targetSpawnOrder.push(target);
    }

    private removeTarget(target: BaseMovable): void {
        const index = this.targetSpawnOrder.indexOf(target);
        if (index !== -1) {
            this.targetSpawnOrder.splice(index, 1);
        }

        if (index in this.projectileSpawnOrder)
        {
            this.projectileSpawnOrder.splice(index, 1);
        }
    }

    private addProjectile(projectile: Projectile): void {
        this.projectileSpawnOrder.push(projectile);
    }

    private removeProjectile(projectile: Projectile): void {
        const index = this.projectileSpawnOrder.indexOf(projectile);
        if (index !== -1) {
            this.projectileSpawnOrder.splice(index, 1);
        }

        if (index in this.targetSpawnOrder)
        {
            this.targetSpawnOrder.splice(index, 1);
        }
    }

    private onProjectileExpired(event: ProjectileExpiredEvent): void {
        const expiredProjectile = event.projectile;
        this.removeProjectile(expiredProjectile);
    }

    private onCollision(event: CollisionEvent): void {
        const projectile = event.projectile;
        this.removeProjectile(projectile);
    }

    private onTargetExpired(event: TargetExpiredEvent): void {
        const expiredTarget = event.target;
        this.removeTarget(expiredTarget);
    }

    private onTargetSpawned(event: TargetSpawnedEvent): void {
        const spawnedTarget = event.target;
        this.addTarget(spawnedTarget);
    }

    private onProjectileSpawned(event: ProjectileSpawnedEvent): void {
        const spawnedProjectile = event.projectile;
        this.addProjectile(spawnedProjectile);
    }
}

export const entityManager = new EntityManager();