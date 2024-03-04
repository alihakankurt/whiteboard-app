import { useLayoutEffect, useState, MouseEvent } from "react"

import rough from 'roughjs'
import { ShapeKind, Shape, Line, Rectangle } from "./Shapes";

export interface Props {
    Width: number,
    Height: number,
}

export default function Board(props: Props) {
    const generator = rough.generator();

    const [shapes, setShapes] = useState<Shape[]>([]);
    const [mouseDown, setMouseDown] = useState<boolean>(false);

    useLayoutEffect(() => {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;

        const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, props.Width, props.Height);

        const canvas = rough.canvas(canvasElement);
        shapes.forEach((shape) => canvas.draw(shape.Drawable));
    })

    function generateLine(x1: number, y1: number, x2: number, y2: number): Line {
        const drawable = generator.line(x1, y1, x2, y2);
        return { Drawable: drawable, Kind: ShapeKind.Line, Start: { X: x1, Y: y1 }, End: { X: x2, Y: y2 } } as Line;
    }

    function generateRectangle(x1: number, y1: number, x2: number, y2: number): Rectangle {
        const drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
        return { Drawable: drawable, Kind: ShapeKind.Rectangle, Position: { X: x1, Y: y1 }, Size: { X: x2 - x1, Y: y2 - y1 } } as Rectangle;
    }

    function handleMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(true);

        const { clientX, clientY } = event;
        const line = generateRectangle(clientX, clientY, clientX, clientY);
        setShapes([...shapes, line]);
    }

    function handleMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(false);
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!mouseDown) return;

        const { clientX, clientY } = event;

        const index = shapes.length - 1;
        const shape = shapes[index] as Rectangle;

        const shapesCopy = [...shapes];
        shapesCopy[index] = generateRectangle(shape.Position.X, shape.Position.Y, clientX, clientY);

        setShapes(shapesCopy);
    }

    return (
        <canvas id="canvas"
            width={props.Width}
            height={props.Height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove} />
    )
}