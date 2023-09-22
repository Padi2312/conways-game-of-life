import { View } from "./View";
import { Field } from "./Field";
import { State } from "./State";

export class Game implements IViewEvents {

    private stepsPerSecond: number = 2
    private fieldSize: number = 10

    private ticker: number | null = null

    private field: Field
    private state: State
    private view: View


    constructor(view: View) {
        this.view = view
        // Binds the functions of `IViewEvents` inside this class to the actual events
        this.view.eventListener(this)
        // Initally set the default steps per second
        this.view.setStepsPerSecond(this.stepsPerSecond)
        this.view.setFieldSize(this.fieldSize)

        this.state = new State(this.fieldSize)
        this.field = new Field(view.canvas, this.onFieldClick)

        // Creates the game field
        this.field.setupField(this.fieldSize)
    }



    onFieldClick = (row: number, col: number) => {
        this.state.toggleCell(row, col)
        this.field.update(this.state.cellStates)
    }


    //#region ViewEvent Callbacks
    onStartStopClick = () => {
        if (this.ticker == null) {
            this.startAutoEvolve()
            this.view.updateStartStopButtonText("Stop")
        }
        else {
            this.view.updateStartStopButtonText("Start")
            clearInterval(this.ticker)
            this.ticker = null
        }
    }
    onResetClick = () => {
        if (this.ticker)
            clearInterval(this.ticker)

        this.state.reset()
        this.field.update(this.state.cellStates)
        this.view.updateStepCountText(this.state.currentStep)
        this.view.updateStartStopButtonText("Start")
    }

    onClearClick = () => {
        if (this.ticker)
            clearInterval(this.ticker)

        this.state.clear()
        this.field.setupField(this.fieldSize)
        this.view.updateStepCountText(this.state.currentStep)
        this.view.updateStartStopButtonText("Start")
    }

    onStepClick = () => {
        this.forwardCells()
    }

    onItersChange = (stepsPerSecond: number) => {
        this.stepsPerSecond = stepsPerSecond
        this.startAutoEvolve()
    }

    onFieldSizeChange = (fieldSize: number) => {
        this.fieldSize = fieldSize
        this.state.resizeField(fieldSize)
        this.field.setupField(this.fieldSize)
        this.field.update(this.state.cellStates)
    }
    //#endregion ViewEvent Callbacks

    private startAutoEvolve() {
        if (this.ticker)
            clearInterval(this.ticker)
        this.ticker = setInterval(() => this.forwardCells(), 1000 / this.stepsPerSecond)
    }

    private forwardCells = () => {
        const newGrid = this.state.stepForward()
        this.field.update(newGrid)
        this.view.updateStepCountText(this.state.currentStep)
    }

}