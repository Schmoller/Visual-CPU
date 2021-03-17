module 'svg-path-generator' {
    function Path(): PathBuilder

    export interface PathBuilder {
        moveTo(x: number, y: number): this
        lineTo(x: number, y: number): this
        horizontalLineTo(x: number): this
        verticalLineTo(y: number): this
        curveTo(x1: number, y1: number, x2: number, y2: number, x: number, y: number): this
        smoothCurveTo(x2: number, y2: number, x: number, y: number): this
        bezierCurveTo(x1: number, y1: number, x: number, y: number): this
        smoothBezierCurveTo(x: number, y: number): this
        ellipticalArc(
            rx: number,
            ry: number,
            xAxisRotation: number,
            largeArcFlag: number,
            sweepFlag: number,
            x: number,
            y: number,
        ): this
        close()

        relative(): this

        end(): string
        toString(): string
    }

    export = Path
}
