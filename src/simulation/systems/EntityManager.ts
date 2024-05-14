import { eventBus } from '../../communication/EventBus';
import { ProjectileExpiredEvent } from '../../communication/events/entities/expiry/ProjectileExpiredEvent';
import { TargetExpiredEvent } from '../../communication/events/entities/expiry/TargetExpiredEvent';
import { Projectile } from '../entities/implementations/Projectile';
import { BaseMovable } from '../entities/implementations/classes/BaseMovable';
import { TargetSpawnedEvent } from '../../communication/events/entities/spawning/TargetSpawnedEvent';
import { ProjectileSpawnedEvent } from '../../communication/events/entities/spawning/ProjectileSpawnedEvent';
import { CollisionEvent } from '../../communication/events/entities/CollisionEvent';

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
        eventBus.subscribe(ProjectileSpawnedEvent, this.onProjectileSpawned.bind(this));
        eventBus.subscribe(TargetSpawnedEvent, this.onTargetSpawned.bind(this));
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
        if (index === -1) { return; }

        target.dispose();
        this.targetSpawnOrder.splice(index, 1);
        if (index < this.projectileSpawnOrder.length) {
            let projectile = this.projectileSpawnOrder[index];
            projectile.dispose();
        }
    }

    private addProjectile(projectile: Projectile): void {
        this.projectileSpawnOrder.push(projectile);
    }

    private removeProjectile(projectile: Projectile): void {
        const index = this.projectileSpawnOrder.indexOf(projectile);
        if (index === -1) { return; }

        projectile.dispose();
        this.projectileSpawnOrder.splice(index, 1);
        if (index < this.targetSpawnOrder.length) {
            let target = this.targetSpawnOrder[index];
            target.dispose();
        }
    }

    private onCollision(event: CollisionEvent): void {
        const projectile = event.projectile;
        this.removeProjectile(projectile);
    }
    
    private onProjectileExpired(event: ProjectileExpiredEvent): void {
        const expiredProjectile = event.projectile;
        console.log('Removing expired projectile:', expiredProjectile);
        this.removeProjectile(expiredProjectile);
    }

    private onTargetExpired(event: TargetExpiredEvent): void {
        const expiredTarget = event.target;
        console.log('Removing expired target:', expiredTarget);
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