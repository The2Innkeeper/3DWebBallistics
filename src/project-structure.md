```mermaid
graph TD
    subgraph Core["Core Simulation"]
        Physics
        ExplosionHandler
        GameLoop["Game Loop"]
    end

    subgraph Entities["Entities"]
        Shooter
        Target
        Projectile
    end

    subgraph Rendering["Rendering"]
        SceneRenderer
    end

    subgraph UI["User Interface"]
        UIComponents["UI Components"]
    end

    subgraph Communication["Communication"]
        EventBus
    end

    Physics <--> GameLoop
    GameLoop <--> EventBus
    EventBus <--> ExplosionHandler
    EventBus <--> Shooter
    EventBus <--> Target
    EventBus <--> Projectile
    EventBus <--> SceneRenderer
    EventBus <--> UIComponents
```

```mermaid
sequenceDiagram
    GameLoop->>EventBus: Update Event
    EventBus->>Shooter: Update Event
    EventBus->>Target: Update Event
    EventBus->>Projectile: Update Event
    Shooter->>EventBus: State Change Event
    Target->>EventBus: State Change Event
    Projectile->>EventBus: State Change Event
    EventBus->>ExplosionHandler: State Change Event
    ExplosionHandler->>EventBus: Explosion Event
    GameLoop->>EventBus: Render Event
    EventBus->>SceneRenderer: Render Event
    SceneRenderer->>EventBus: Retrieve Entity States
    EventBus->>UIComponents: UI Update Event
    UIComponents->>EventBus: User Input Event
```

```
src/
  ├── core/
  │   ├── physics/
  │   │   ├── CollisionDetection.ts
  │   │   └── ExplosionHandler.ts
  │   └── GameLoop.ts
  │
  ├── entities/
  │   ├── Shooter.ts
  │   ├── Target.ts
  │   └── Projectile.ts
  │
  ├── rendering/
  │   └── SceneRenderer.ts
  │
  ├── ui/
  │   └── components/
  │       └── UIComponents.ts
  │
  ├── communication/
  │   └── EventBus.ts
  │
  ├── types/
  │   └── index.ts
  │
  ├── utils/
  │   └── /* utility functions */
  │
  ├── assets/
  │   ├── images/
  │   ├── models/
  │   └── /* other asset files */
  │
  ├── styles/
  │   └── /* CSS or SCSS files */
  │
  ├── index.html
  └── app.ts
```