function getMaxZIndex(): number {
    const elements = document.getElementsByTagName('*');
    let maxZIndex = 0;

    for (let i = 0; i < elements.length; i++) {
        const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
        if (!isNaN(zIndex)) {
            maxZIndex = Math.max(maxZIndex, zIndex);
        }
    }

    return maxZIndex;
}

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
        window.addEventListener("resize", () => this.updateStepPosition());
        window.addEventListener("scroll", () => this.updateStepPosition());
    }

    private updateStepPosition(): void {
        if (this.currentStep >= 0 && this.currentStep < this.steps.length) {
            this.showStep(this.currentStep);
        }
    }

    private showStep(stepIndex: number): void {
        const overlay = document.getElementById("tutorial-overlay")!;
        const highlight = document.getElementById("tutorial-highlight")!;
        const popup = document.getElementById("tutorial-popup")!;
        const text = document.getElementById("tutorial-text")!;
        const tutorialButton = document.getElementById("tutorial-button")!;
        const tutorialControls = document.getElementById("tutorial-controls")!;

        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            overlay.style.display = "none";
            return;
        }

        const step = this.steps[stepIndex];
        const targetElement = document.querySelector(step.element) as HTMLElement;

        if (!targetElement) {
            console.error(`Element not found: ${step.element}`);
            return;
        }

        const rect = targetElement.getBoundingClientRect();
        const maxZIndex = getMaxZIndex();

        highlight.style.width = `${rect.width}px`;
        highlight.style.height = `${rect.height}px`;
        highlight.style.top = `${rect.top + window.scrollY}px`;
        highlight.style.left = `${rect.left + window.scrollX}px`;
        highlight.style.zIndex = (maxZIndex + 1).toString();

        text.textContent = step.text;
        popup.style.top = `${rect.bottom + 10 + window.scrollY}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.zIndex = (maxZIndex + 2).toString();

        overlay.style.display = "flex";
        overlay.style.zIndex = (maxZIndex + 3).toString();

        tutorialButton.style.zIndex = (maxZIndex + 4).toString();
        tutorialControls.style.zIndex = (maxZIndex + 4).toString();
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
        window.removeEventListener("resize", () => this.updateStepPosition());
        window.removeEventListener("scroll", () => this.updateStepPosition());
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
    { element: "#menuSelector", text: "Select the parameters to adjust." },
    { element: "#spawn-target", text: "Click here to spawn a new target." },
    { element: "#fire-projectile", text: "Click here to fire a projectile. The projectile does not fire if there is no available target. If it does fire, it tracks the oldest spawned target." },
    { element: "#gameParameters", text: "Adjust the game parameters here." }
];

export function setupTutorial(): void {
    const tutorialManager = new TutorialManager(tutorialSteps);
}