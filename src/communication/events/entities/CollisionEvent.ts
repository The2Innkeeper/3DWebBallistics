import { Projectile } from "../../../simulation/entities/implementations/Projectile";
import { BaseMovable } from "../../../simulation/entities/implementations/classes/BaseMovable";

export class CollisionEvent {
    constructor(
        public projectile: Projectile,
        public target: BaseMovable,
    ) {}
}