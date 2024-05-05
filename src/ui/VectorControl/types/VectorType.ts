// vectorTypes.ts
export const VectorTypes = {
    Target: 'target',
    Shooter: 'shooter',
    Projectile: 'projectile'
} as const;

// Define a type based on the const object values
export type VectorType = typeof VectorTypes[keyof typeof VectorTypes];