/**
 * Initalizes the view.
 */
export class View {

    private readonly _canvas: HTMLCanvasElement
    get canvas() {
        return this._canvas
    }

    private startStopButton: HTMLButtonElement
    private resetButton: HTMLButtonElement
    private stepButton: HTMLButtonElement
    private clearButton: HTMLButtonElement
    private itersPerSecondInput: HTMLInputElement
    private stepCountText: HTMLParagraphElement
    private fieldSizeInput: HTMLInputElement

    constructor() {
        this._canvas = document.getElementById("app") as HTMLCanvasElement

        this.startStopButton = document.getElementById("btn-start-stop") as HTMLButtonElement
        this.resetButton = document.getElementById("btn-reset") as HTMLButtonElement
        this.stepButton = document.getElementById("btn-step") as HTMLButtonElement
        this.clearButton = document.getElementById("btn-clear") as HTMLButtonElement

        this.itersPerSecondInput = document.getElementById("input-steps-per-second") as HTMLInputElement
        this.fieldSizeInput = document.getElementById("input-field-size") as HTMLInputElement
        this.stepCountText = document.getElementById("text-stepcount") as HTMLParagraphElement
    }

    updateStepCountText = (stepCount: number) => this.stepCountText.innerHTML = `Steps: ${stepCount}`

    updateStartStopButtonText = (value: "Start" | "Stop") => this.startStopButton.textContent = value

    setFieldSize = (fieldSize: number) => this.fieldSizeInput.value = String(fieldSize)

    setStepsPerSecond = (stepsPerSecond: number) => this.itersPerSecondInput.value = String(stepsPerSecond)

    eventListener(callbacks: IViewEvents) {
        this.startStopButton.onclick = () => callbacks.onStartStopClick()
        this.resetButton.onclick = () => callbacks.onResetClick()
        this.stepButton.onclick = () => callbacks.onStepClick()
        this.clearButton.onclick = () => callbacks.onClearClick()
        this.itersPerSecondInput.onchange = () => callbacks.onItersChange(parseInt(this.itersPerSecondInput.value))
        this.fieldSizeInput.onchange = () => callbacks.onFieldSizeChange(parseInt(this.fieldSizeInput.value))
    }
}