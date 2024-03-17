import { useLayoutEffect, useState, MouseEvent } from "react"
import rough from 'roughjs'
import { Drawable } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
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
        const canvasElement: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;

        const context: CanvasRenderingContext2D = canvasElement.getContext("2d") as CanvasRenderingContext2D;
        context.clearRect(0, 0, props.Width, props.Height);

        const canvas: RoughCanvas = rough.canvas(canvasElement);
        shapes.forEach((shape) => canvas.draw(shape.Drawable));
    })

    function generateShape(x1: number, y1: number, x2: number, y2: number): Shape {
        let drawable: Drawable;
        switch (tool) {
            case Tool.Erase:
                throw new Error(`Can't generate shape with tool kind ${Tool.Erase}`);
            case Tool.Line:
                drawable = generator.line(x1, y1, x2, y2);
                return { Kind: ShapeKind.Line, Start: { X: x1, Y: y1 }, End: { X: x2, Y: y2 }, Drawable: drawable } as Line;
            case Tool.Rectangle:
                drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
                return { Kind: ShapeKind.Rectangle, TopLeft: { X: x1, Y: y1, }, BottomRight: { X: x2, Y: y2 }, Drawable: drawable } as Rectangle;
        }
    }

    function updateShape(shape: Shape, x: number, y: number): Shape {
        let drawable: Drawable;
        let x1: number, y1: number, x2: number, y2: number;
        switch (shape.Kind) {
            case ShapeKind.Line:
                const line: Line = shape as Line;
                if (x <= line.Start.X || y <= line.Start.Y) {
                    x1 = x;
                    y1 = y;
                    x2 = line.End.X;
                    y2 = line.End.Y;
                }
                else {
                    x1 = line.Start.X;
                    y1 = line.Start.Y;
                    x2 = x;
                    y2 = y;
                }
                drawable = generator.line(x1, y1, x2, y2);
                return { ...line, Start: { X: x1, Y: y1 }, End: { X: x2, Y: y2 }, Drawable: drawable } as Line;

            case ShapeKind.Rectangle:
                const rectangle: Rectangle = shape as Rectangle;
                if (x <= rectangle.TopLeft.X || y <= rectangle.TopLeft.Y) {
                    x1 = x;
                    y1 = y;
                    x2 = rectangle.BottomRight.X;
                    y2 = rectangle.BottomRight.Y;
                }
                else {
                    x1 = rectangle.TopLeft.X;
                    y1 = rectangle.TopLeft.Y;
                    x2 = x;
                    y2 = y;
                }
                drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1);
                return { ...rectangle, TopLeft: { X: x1, Y: y1 }, BottomRight: { X: x2, Y: y2 }, Drawable: drawable } as Rectangle;
        }
    }

    function eraseShape(x: number, y: number): void {
        setShapes((shapes) => shapes.filter((shape) => {
            switch (shape.Kind) {
                case ShapeKind.Line:
                    const line: Line = shape as Line;
                    const slope: number = (line.End.Y - line.Start.Y) / (line.End.X - line.Start.X);
                    const expectedY: number = (x - line.Start.X) * slope + line.Start.Y;
                    return Math.abs(expectedY - y) > 5;
                case ShapeKind.Rectangle:
                    const rectangle: Rectangle = shape as Rectangle;
                    return rectangle.TopLeft.X > x || rectangle.TopLeft.Y > y || rectangle.BottomRight.X < x || rectangle.BottomRight.Y < y;
            }
        }));
    }

    function handleMouseDown(event: MouseEvent<HTMLCanvasElement>): void {
        if (mouseDown) return;

        setMouseDown(true);
        const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        const x: number = event.clientX - canvas.offsetLeft;
        const y: number = event.clientY - canvas.offsetTop;

        if (tool === Tool.Erase) {
            eraseShape(x, y);
        }
        else {
            const shape: Shape = generateShape(x, y, x, y);
            setShapes([...shapes, shape]);
        }
    }

    function handleMouseUp(event: MouseEvent<HTMLCanvasElement>): void {
        setMouseDown(false);
    }

    function handleMouseMove(event: MouseEvent<HTMLCanvasElement>): void {
        if (!mouseDown) return;

        const canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
        const x: number = event.clientX - canvas.offsetLeft;
        const y: number = event.clientY - canvas.offsetTop;

        if (tool === Tool.Erase) {
            eraseShape(x, y);
        }
        else {
            const index = shapes.length - 1;
            const shapesCopy: Shape[] = [...shapes];
            shapesCopy[index] = updateShape(shapes[index], x, y);
            setShapes(shapesCopy);
        }
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