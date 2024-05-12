import { UIVectorType } from "../types/VectorType";

// UIVectorRemoveUpdate.ts
export class UIVectorRemoveEvent {
    constructor(
        public vectorType: UIVectorType,
        public index: number
    ) {}
}