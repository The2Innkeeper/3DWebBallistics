import { IMovable } from "../../../simulation/entities/interfaces/IMovable";

export class CollisionEvent {
    constructor(
        public obj1: IMovable,
        public obj2: IMovable,
    ) {}
}