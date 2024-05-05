// events/VectorClearEvent.ts
import { VectorType } from '../types/VectorType';

export class VectorClearEvent {
    constructor(public vectorType: VectorType) {}
}