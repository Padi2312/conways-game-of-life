interface IViewEvents {
    onClearClick: () => void
    onStartStopClick: () => void
    onResetClick: () => void
    onStepClick: () => void
    onItersChange: (iterations: number) => void
    onFieldSizeChange: (fieldSize: number) => void
}