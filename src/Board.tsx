import { useLayoutEffect, useState, MouseEvent } from "react"

import rough from 'roughjs'
import { Tool, ShapeKind, Shape, Line, Rectangle } from "./Core";
import ToolMenu from "./ToolMenu";

export interface Props {
    Width: number,
    Height: number,
}

export default function Board(props: Props) {
    const generator = rough.generator();

    const [tool, setTool] = useState<Tool>(Tool.Line);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const [mouseDown, setMouseDown] = useState<boolean>(false);

    useLayoutEffect(() => {
        const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;

        const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, props.Width, props.Height);

        const canvas = rough.canvas(canvasElement);
        shapes.forEach((shape) => canvas.draw(shape.Drawable));
    })

    function generateShape(x1: number, y1: number, x2: number, y2: number): Shape {
        let drawable = undefined;
        switch (tool) {
            case Tool.Line:
                drawable = generator.line(x1, y1, x2, y2);
                return { Kind: ShapeKind.Line, Start: { X: x1, Y: y1 }, End: { X: x2, Y: y2 }, Drawable: drawable } as Line;
            case Tool.Rectangle:
                drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
                return { Kind: ShapeKind.Rectangle, TopLeft: { X: x1, Y: y1, }, BottomRight: { X: x2, Y: y2 }, Drawable: drawable } as Rectangle;
        }
    }

    function updateShape(shape: Shape, x: number, y: number): Shape {
        let drawable = undefined;
        switch (shape.Kind) {
            case ShapeKind.Line:
                const line = shape as Line;
                drawable = generator.line(line.Start.X, line.Start.Y, x, y);
                return { ...line, End: { X: x, Y: y }, Drawable: drawable } as Line;
            case ShapeKind.Rectangle:
                const rectangle = shape as Rectangle;
                drawable = generator.rectangle(rectangle.TopLeft.X, rectangle.TopLeft.Y, x - rectangle.TopLeft.X, y - rectangle.TopLeft.Y);
                return { ...rectangle, BottomRight: { X: x, Y: y }, Drawable: drawable } as Rectangle;
        }
    }

    function handleMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (mouseDown) return;

        setMouseDown(true);

        const { clientX, clientY } = event;
        const shape = generateShape(clientX, clientY, clientX, clientY);
        setShapes([...shapes, shape]);
    }

    function handleMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(false);
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!mouseDown) return;

        const { clientX, clientY } = event;

        const index = shapes.length - 1;
        const shapesCopy = [...shapes];
        shapesCopy[index] = updateShape(shapes[index], clientX, clientY);
        setShapes(shapesCopy);
    }

    return (
        <div>
            <ToolMenu selectTool={setTool} />
            <canvas id="canvas"
                width={props.Width}
                height={props.Height}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove} />
        </div>
    )
}