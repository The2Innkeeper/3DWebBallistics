export class MenuToggle {
    constructor(private menuToggle: HTMLElement, private interfaceContainer: HTMLElement) {
        this.initialize();
    }

    private initialize(): void {
        const initialInterfaceWidth = this.interfaceContainer.classList.contains('interface-hidden') ? 0 : this.interfaceContainer.offsetWidth;
        this.menuToggle.style.transform = `translateX(${initialInterfaceWidth}px)`;

        this.menuToggle.addEventListener('click', this.toggleMenu.bind(this));
    }

    private toggleMenu(): void {
        this.interfaceContainer.classList.toggle('interface-hidden');
        const isInterfaceHidden = this.interfaceContainer.classList.contains('interface-hidden');
        
        requestAnimationFrame(() => {
            const interfaceWidth = isInterfaceHidden ? 0 : this.interfaceContainer.offsetWidth;
            const transitionTime = '250ms';
            
            this.interfaceContainer.style.transition = `transform ${transitionTime}`;
            this.menuToggle.style.transition = `transform ${transitionTime}`;

            this.menuToggle.style.transform = isInterfaceHidden ? 'translateX(0)' : `translateX(${interfaceWidth}px)`;
        });
    }
}