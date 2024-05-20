function getMaxZIndex(): number {
    const elements = document.getElementsByTagName('*');
    let maxZIndex = 0;

    for (let i = 0; i < elements.length; i++) {
        const zIndex = parseInt(window.getComputedStyle(elements[i]).zIndex);
        if (!isNaN(zIndex)) {
            maxZIndex = Math.min(Math.max(maxZIndex, zIndex), 10000); // Limit max z-index
        }
    }

    return maxZIndex;
}

export interface TutorialStep {
    element: string;
    text: string;
}

class TutorialManager {
    private steps: TutorialStep[];
    private currentStep: number;
    private originalZIndexes: Map<HTMLElement, string>;

    constructor(steps: TutorialStep[]) {
        this.steps = steps;
        this.currentStep = 0;
        this.originalZIndexes = new Map();
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
        const overlayId = "dynamic-tutorial-overlay";
        let overlay = document.getElementById(overlayId);

        const popup = document.getElementById("tutorial-popup")!;
        const text = document.getElementById("tutorial-text")!;
        const tutorialButton = document.getElementById("tutorial-button")!;
        const tutorialControls = document.getElementById("tutorial-controls")!;

        if (stepIndex < 0 || stepIndex >= this.steps.length) {
            if (overlay) {
                overlay.style.display = "none";
            }
            return;
        }

        const step = this.steps[stepIndex];
        const targetElement = document.querySelector(step.element) as HTMLElement;

        if (!targetElement) {
            console.error(`Element not found: ${step.element}`);
            return;
        }

        // Store the original z-index of the target element
        if (!this.originalZIndexes.has(targetElement)) {
            this.originalZIndexes.set(targetElement, targetElement.style.zIndex);
        }

        // Remove highlight from previous element
        const previousHighlight = document.querySelector('.tutorial-highlight');
        if (previousHighlight) {
            previousHighlight.classList.remove('tutorial-highlight');
        }

        const rect = targetElement.getBoundingClientRect();
        const maxZIndex = getMaxZIndex();

        // Append the overlay to the parent of the target element
        const parentElement = targetElement.parentElement;
        if (parentElement) {
            // Store the original z-index
            if (!this.originalZIndexes.has(parentElement)) {
                this.originalZIndexes.set(parentElement, parentElement.style.zIndex);
            }

            if (!overlay) {
                overlay = document.createElement("div");
                overlay.id = overlayId;
                overlay.className = "tutorial-overlay";
            } else {
                // Remove overlay from previous parent
                overlay.parentElement?.removeChild(overlay);
            }
            
            parentElement.style.zIndex = (maxZIndex + 1).toString();
            parentElement.appendChild(overlay);
            overlay.style.zIndex = (maxZIndex + 2).toString();
            overlay.style.display = "block";
        }

        text.textContent = step.text;
        popup.style.display = "block";
        popup.style.top = `${rect.bottom + 10 + window.scrollY}px`;
        popup.style.left = `${rect.left + window.scrollX}px`;
        popup.style.zIndex = (maxZIndex + 3).toString();

        tutorialButton.style.zIndex = (maxZIndex + 5).toString();
        tutorialControls.style.zIndex = (maxZIndex + 5).toString();

        targetElement.style.zIndex = (maxZIndex + 4).toString();
        // Apply highlight to the current element
        targetElement.classList.add('tutorial-highlight');
    }

    public nextStep(): void {
        if (this.currentStep < this.steps.length - 1) {
            this.restoreOriginalZIndex();
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.close(); // Close the tutorial if it's the last step
        }
    }

    public prevStep(): void {
        if (this.currentStep > 0) {
            this.restoreOriginalZIndex();
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }

    private restoreOriginalZIndex(): void {
        const step = this.steps[this.currentStep];
        const targetElement = document.querySelector(step.element) as HTMLElement;
        const parentElement = targetElement.parentElement;

        // Restore the z-index of the target element
        if (this.originalZIndexes.has(targetElement)) {
            targetElement.style.zIndex = this.originalZIndexes.get(targetElement) || '';
            this.originalZIndexes.delete(targetElement);
        }

        // Restore the z-index of the parent element
        if (parentElement && this.originalZIndexes.has(parentElement)) {
            parentElement.style.zIndex = this.originalZIndexes.get(parentElement) || '';
            this.originalZIndexes.delete(parentElement);
        }
    }

    public close(): void {
        const overlay = document.getElementById("dynamic-tutorial-overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
        const highlightedElement = document.querySelector('.tutorial-highlight');
        if (highlightedElement) {
            highlightedElement.classList.remove('tutorial-highlight');
        }
        const tutorialButton = document.getElementById("tutorial-button")!;
        const tutorialControls = document.getElementById("tutorial-controls")!;
        const popup = document.getElementById("tutorial-popup")!;
        tutorialButton.textContent = "Start Tutorial";
        tutorialControls.style.display = "none";
        popup.style.display = "none";
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