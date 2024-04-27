import { Target } from "../../../../simulation/entities/implementations/Target";

export class TargetExpiredEvent {
    constructor(
        public readonly target: Target,
        public readonly reason: 'lifetime' | 'distance'
    ) {}
}