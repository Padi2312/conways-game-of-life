export class Field {

    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D

    private _cellSize: number = 5
    private _onFieldClickCallback: (row: number, col: number) => void

    constructor(canvas: HTMLCanvasElement, onFieldClickCallback: (row: number, col: number) => void) {
        this.canvas = canvas
        const ctx = this.canvas?.getContext("2d")
        if (ctx == null)
            throw Error("Canvas context not found. Make sure the canvas element is in the DOM.\n")
        this.ctx = ctx

        this._onFieldClickCallback = onFieldClickCallback
        this.canvas.onclick = (event) => this.onClickCanvas(event)
    }

    update(cellStates: number[][]) {
        for (let x = 0; x < cellStates.length; x++) {
            for (let y = 0; y < cellStates[x].length; y++) {
                this.setCell(x, y, cellStates[y][x])
            }
        }
    }

    clearField() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setupField(size: number) {
        // Initally resize the canvas to get the biggest lenght of a side
        this.resizeCanvas()
        this.clearField()

        const width = this.canvas.width
        const height = this.canvas.height

        const smallestSize = width > height ? height : width
        this._cellSize = smallestSize / size

        // Neccessary to resize the canvas to match the field size
        // Otherwise the canvas would be bigger than what we're actually seeing 

        this.canvas.style.width = `auto`
        this.canvas.style.height = `auto`
        this.canvas.height = smallestSize
        this.canvas.width = smallestSize

        this.ctx.strokeStyle = 'gray'; // Set the grid line color
        this.ctx.lineWidth = 2

        // Draw vertical lines
        for (let x = 0; x <= size; x++) {
            const currentX = x * this._cellSize
            this.ctx.beginPath()
            this.ctx.moveTo(currentX, 0)
            this.ctx.lineTo(currentX, smallestSize)
            this.ctx.stroke()
        }

        // Draw horizontal lines
        for (let y = 0; y <= size; y++) {
            const currentY = y * this._cellSize
            this.ctx.beginPath()
            this.ctx.moveTo(0, currentY)
            this.ctx.lineTo(smallestSize, currentY)
            this.ctx.stroke()
        }

    }

    resizeCanvas() {
        this.canvas.style.width = `100%`
        this.canvas.style.height = `100%`
        this.canvas.width = this.canvas.offsetWidth
        this.canvas.height = this.canvas.offsetHeight
    }

    setCell(col: number, row: number, fill: number) {
        const pad = 2
        const x = col * this._cellSize + pad
        const y = row * this._cellSize + pad
        const width = this._cellSize - 2 * pad
        const height = this._cellSize - 2 * pad

        this.ctx.fillStyle = 'black'
        if (!fill) {
            this.ctx.clearRect(x, y, width, height)
        }
        else {
            this.ctx.fillRect(x, y, width, height)
        }
    }

    private onClickCanvas = (event: MouseEvent) => {
        // Get the click coordinates relative to the canvas
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left
        const clickY = event.clientY - rect.top

        // Calculate the row and column of the clicked square
        const column = Math.floor(clickX / this._cellSize)
        const row = Math.floor(clickY / this._cellSize)
        this._onFieldClickCallback(row, column)
    }
}