// events/VectorRandomizeEvent.ts
import { VectorType } from '../types/VectorType';

export class VectorRandomizeEvent {
    constructor(public vectorType: VectorType) {}
}