export class State {

    private _rootCellStates: number[][] = []
    private _cellStates: number[][] = []
    get cellStates() {
        return this._cellStates
    }

    private _currentStep: number = 0
    get currentStep() {
        return this._currentStep
    }

    private fieldSize: number

    constructor(fieldSize: number) {
        this.fieldSize = fieldSize
        this._cellStates = this.initCellStates()
        this._rootCellStates = this.initCellStates()
    }

    reset = () => {
        this._cellStates = this._rootCellStates
        this._currentStep = 0
    }

    clear = () => {
        this._cellStates = this.initCellStates()
        this._currentStep = 0
    }

    toggleCell = (row: number, col: number) => {
        // XOR operator ^ for toggling cell state
        // I.e.: 1 ^= 1 => 0  and 0 ^= 1 => 1
        this._cellStates[row][col] ^= 1
    }

    resizeField(newFieldSize: number) {
        const newArray = new Array(newFieldSize).fill(null).map(() => new Array(newFieldSize).fill(0));
        const sizeToCopy = Math.min(this.fieldSize, newFieldSize);
        for (let row = 0; row < sizeToCopy; row++) {
            for (let col = 0; col < sizeToCopy; col++) {
                newArray[row][col] = this._cellStates[row][col];
            }
        }
        // Update the field size and cell states
        this.fieldSize = newFieldSize;
        this._cellStates = newArray;
    }

    stepForward = (): number[][] => {
        if (this.currentStep == 0)
            this._rootCellStates = this._cellStates

        const newGrid: number[][] = []
        for (let row = 0; row < this.fieldSize; row++) {
            newGrid[row] = []
            for (let col = 0; col < this.fieldSize; col++) {
                const currentCell = this._cellStates[row][col]
                // Check neighbours of current cell
                const neighbourCount = this.countNeighbors(row, col)

                if (currentCell && (neighbourCount < 2 || neighbourCount > 3)) {
                    // cell dies
                    newGrid[row][col] = 0
                }
                else if (!currentCell && neighbourCount == 3) {
                    // cell gets alive 
                    newGrid[row][col] = 1
                }
                else {
                    // cell remains 
                    newGrid[row][col] = currentCell
                }
            }
        }
        this._cellStates = newGrid
        this._currentStep++

        return this._cellStates
    }

    private initCellStates = () => {
        const array = new Array(this.fieldSize)
        for (let i = 0; i < this.fieldSize; i++) {
            array[i] = new Array(this.fieldSize).fill(0)
        }
        return array;
    }

    private countNeighbors(x: number, y: number): number {
        let count = 0;
        // Loop over x-coordinates
        for (let i = -1; i <= 1; i++) {
            // Loop over y-coordinates
            for (let j = -1; j <= 1; j++) {
                // Uses modulo to squeeze the new index in valid range
                const newX = (x + i + this.fieldSize) % this.fieldSize
                const newY = (y + j + this.fieldSize) % this.fieldSize
                count += this._cellStates[newX][newY]
            }
        }
        // Remove cell itself from counting
        count -= this._cellStates[x][y]
        return count
    }
}