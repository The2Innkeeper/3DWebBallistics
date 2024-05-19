// TutorialManager.ts

export interface TutorialStep {
    element: string;
    text: string;
}

export class TutorialManager {
    private steps: TutorialStep[];
    private currentStep: number;

    constructor(steps: TutorialStep[]) {
        this.steps = steps;
        this.currentStep = 0;
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        document.getElementById("tutorial-next")!.addEventListener("click", () => this.nextStep());
        document.getElementById("tutorial-prev")!.addEventListener("click", () => this.prevStep());
        document.getElementById("tutorial-button")!.addEventListener("click", () => this.toggleTutorial());
    }

    private showStep(stepIndex: number): void {
        const overlay = document.getElementById("tutorial-overlay")!;
        const highlight = document.getElementById("tutorial-highlight")!;
        const popup = document.getElementById("tutorial-popup")!;
        const text = document.getElementById("tutorial-text")!;

        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            overlay.style.display = "none";
            return;
        }

        const step = this.steps[stepIndex];
        const targetElement = document.querySelector(step.element)!;

        if (!targetElement) {
            console.error(`Element not found: ${step.element}`);
            return;
        }

        const rect = targetElement.getBoundingClientRect();

        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.top = `${rect.top}px`;
        highlight.style.left = `${rect.left}px`;

        text.textContent = step.text;
        popup.style.top = `${rect.bottom + 10}px`;
        popup.style.left = `${rect.left}px`;

        overlay.style.display = "flex";
    }

    public nextStep(): void {
        if (this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    public prevStep(): void {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    public close(): void {
        const overlay = document.getElementById("tutorial-overlay")!;
        overlay.style.display = "none";
        const tutorialButton = document.getElementById("tutorial-button")!;
        const tutorialControls = document.getElementById("tutorial-controls")!;
        tutorialButton.textContent = "Start Tutorial";
        tutorialControls.style.display = "none";
    }

    public start(): void {
        this.currentStep = 0;
        this.showStep(this.currentStep);
        const tutorialButton = document.getElementById("tutorial-button")!;
        const tutorialControls = document.getElementById("tutorial-controls")!;
        tutorialButton.textContent = "Close Tutorial";
        tutorialControls.style.display = "flex";
    }

    public toggleTutorial(): void {
        const tutorialButton = document.getElementById("tutorial-button")!;
        if (tutorialButton.textContent === "Start Tutorial") {
            this.start();
        } else {
            this.close();
        }
    }
}

export const tutorialSteps: TutorialStep[] = [
    { element: "#menu-toggle", text: "Click here to toggle the menu." },
    { element: "#vectorTypeSelector", text: "Select the parameters to adjust." },
    { element: "#spawn-target", text: "Click here to spawn a new target." },
    { element: "#fire-projectile", text: "Click here to fire a projectile. The projectile does not fire if there is no available target. If it does fire, it tracks the oldest spawned target." },
    { element: "#gameParameters", text: "Adjust the game parameters here." }
];

export function setupTutorial(): void {
    const tutorialManager = new TutorialManager(tutorialSteps);
    document.getElementById("tutorial-button")!.addEventListener("click", () => {
        tutorialManager.toggleTutorial();
    });
}