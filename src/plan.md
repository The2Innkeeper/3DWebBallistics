```
src/
  ├── index.ts
  ├── simulation/
  │   ├── Simulator.ts
  │   ├── Shooter.ts
  │   ├── Target.ts
  │   ├── Projectile.ts
  │   ├── physics/
  │   │   ├── PhysicsEngine.ts
  │   │   └── BallisticsModel.ts
  │   └── aimbot/
  │       ├── AimbotSystem.ts
  │       └── TargetPredictor.ts
  └── ui/
      ├── UIManager.ts
      ├── SceneRenderer.ts
      ├── ControlPanel.ts
      └── components/
          ├── Button.ts
          └── ToggleSwitch.ts
```

Key components and their responsibilities:

1. `Simulator.ts`: The main class that orchestrates the simulation, managing the shooter, target, projectiles, and physics engine.

2. `Shooter.ts`: Represents the fixed shooter at the origin, responsible for firing projectiles.

3. `Target.ts`: Represents the moving target, with properties for initial conditions and movement behavior.

4. `Projectile.ts`: Represents the projectiles fired by the shooter, with properties like velocity and trajectory.

5. `PhysicsEngine.ts`: Handles the physics calculations for the simulation, including projectile motion and collisions.

6. `BallisticsModel.ts`: Implements the specific ballistics model used for calculating projectile trajectories.

7. `AimbotSystem.ts`: Manages the aimbot functionality, determining when and how to automatically aim at the target.

8. `TargetPredictor.ts`: Implements algorithms to predict the future position of the moving target for the aimbot system.

9. `UIManager.ts`: Manages the user interface, handling user interactions and updating the UI based on simulation state.

10. `SceneRenderer.ts`: Responsible for rendering the 3D scene using Three.js, including the shooter, target, and projectiles.

11. `ControlPanel.ts`: Represents the control panel UI component, with buttons and input fields for controlling the simulation.

12. `Button.ts` and `ToggleSwitch.ts`: Reusable UI components for buttons and toggle switches.

Features to include:

1. Fixed shooter at the origin that can fire projectiles when the "Shoot" button is clicked.

2. Moving target with customizable initial conditions (position, velocity) set through the UI.

3. "Run" button to start the simulation and update the target's position based on its movement behavior.

4. Physics engine that accurately simulates projectile motion and detects collisions between projectiles and the target.

5. Aimbot system that can be toggled on/off using a switch in the UI. When enabled, it automatically calculates the optimal firing angle to hit the moving target.

6. Modular ballistics model that can be easily replaced or extended to experiment with different physics implementations.

7. Clear separation between the simulation logic (Simulator, Shooter, Target, Projectile, physics) and the UI logic (UIManager, SceneRenderer, ControlPanel, UI components).

8. Real-time rendering of the 3D scene using Three.js, showing the shooter, moving target, and fired projectiles.

9. User-friendly control panel with intuitive buttons and input fields for interacting with the simulation.

10. Extensible architecture that allows for easy addition of new features or modifications to the physics and aimbot systems.

## Logic
/ballistics-simulator
|-- /src
|   |-- /interfaces
|   |   |-- IMovable.ts              # Interface for any movable object
|   |-- /events
|   |   |-- EventBus.ts              # Central event handling for communication
|   |-- /models
|   |   |-- Projectile.ts            # Handles projectile behavior, including event emission
|   |   |-- Target.ts                # Target behavior with properties like position and radius
|   |-- /services
|   |   |-- SimulationService.ts     # Core logic for running and managing the simulation
|   |   |-- ExplosionHandler.ts      # Handles explosion effects upon receiving collision events
|   |-- /utils
|   |   |-- VectorUtils.ts           # Utility functions for vector calculations, etc.
|   |-- /physics
|   |   |-- CollisionDetection.ts    # Logic to detect collisions between objects like projectiles and targets
|   |-- app.ts                       # Main application logic that ties all components together
|-- /assets
|   |-- /textures                    # Textures for graphical representations
|   |-- /models                      # 3D models used in the simulation
|-- /styles
|   |-- main.css                     # CSS styles for the application UI
|-- /dist                            # Compiled files from TypeScript to JavaScript
|-- /node_modules                    # Dependencies and libraries
|-- index.html                       # Main HTML document for the web application
|-- tsconfig.json                    # TypeScript configuration
|-- package.json                     # Project metadata and dependencies management

## UI
/ballistics-simulator
|-- /src
|   |-- /ui
|   |   |-- /components             # Reusable UI components
|   |   |   |-- ControlPanel.ts     # Controls for simulation parameters
|   |   |   |-- Dashboard.ts        # Displays real-time data and results
|   |   |   |-- Button.ts           # Custom button component
|   |   |   |-- Slider.ts           # Custom slider component for input
|   |   |-- /styles                 # CSS files specific to components
|   |   |   |-- control-panel.css   # Styles for the ControlPanel
|   |   |   |-- dashboard.css       # Styles for the Dashboard
|   |   |   |-- button.css          # Styles for the Button
|   |   |   |-- slider.css          # Styles for the Slider
|   |   |-- /layouts                # Layout definitions
|   |   |   |-- main-layout.css     # Main layout styles
|   |   |-- /pages                  # Specific page UI implementations
|   |   |   |-- home-page.ts        # Home page component
|   |   |   |-- about-page.ts       # About page component
|   |-- /utils
|   |-- app.ts                      # Main application bootstrap
|-- /public
|-- /styles
|   |-- main.css                    # Global styles
|-- /dist
|-- /node_modules
|-- index.html
|-- tsconfig.json
|-- package.json

