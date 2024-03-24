import { useLayoutEffect, useState, MouseEvent } from "react"
import rough from 'roughjs'
import { Drawable } from "roughjs/bin/core";
import { RoughCanvas } from "roughjs/bin/canvas";
import { Tool, ShapeKind, Shape, Line, Rectangle, Color } from "./Core";

export interface Props {
    Width: number,
    Height: number,
}

export default function Board(props: Props) {
    const generator = rough.generator();

    const [tool, setTool] = useState<Tool>(Tool.Line);
    const [color, setColor] = useState<Color>(Color.Black);
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
                drawable = generator.line(x1, y1, x2, y2, { stroke: color as string });
                return { Kind: ShapeKind.Line, Start: { X: x1, Y: y1 }, End: { X: x2, Y: y2 }, Drawable: drawable } as Line;
            case Tool.Rectangle:
                drawable = generator.rectangle(x1, y1, x2 - x1, y2 - y1, { stroke: color as string });
                return { Kind: ShapeKind.Rectangle, Start: { X: x1, Y: y1, }, End: { X: x2, Y: y2 }, Drawable: drawable } as Rectangle;
        }
    }

    function updateShape(shape: Shape, x: number, y: number): Shape {
        let drawable: Drawable;
        switch (shape.Kind) {
            case ShapeKind.Line:
                const line: Line = shape as Line;
                drawable = generator.line(line.Start.X, line.Start.Y, x, y, { stroke: color as string });
                return { ...line, End: { X: x, Y: y }, Drawable: drawable } as Line;

            case ShapeKind.Rectangle:
                const rectangle: Rectangle = shape as Rectangle;
                drawable = generator.rectangle(rectangle.Start.X, rectangle.Start.Y, x - rectangle.Start.X, y - rectangle.Start.Y, { stroke: color as string });
                return { ...rectangle, End: { X: x, Y: y }, Drawable: drawable } as Rectangle;
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
                    const minX: number = Math.min(rectangle.Start.X, rectangle.End.X);
                    const maxX: number = Math.max(rectangle.Start.X, rectangle.End.X);
                    const minY: number = Math.min(rectangle.Start.Y, rectangle.End.Y);
                    const maxY: number = Math.max(rectangle.Start.Y, rectangle.End.Y);
                    return minX > x || x > maxX || minY > y || y > maxY;
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
            <div className='center'>
                <div className='tool-menu'>
                    <label><input type='radio' className='tool-button' checked={tool === Tool.Erase} onClick={() => setTool(Tool.Erase)} />Erase</label>
                    <label><input type='radio' className='tool-button' checked={tool === Tool.Line} onClick={() => setTool(Tool.Line)} />Line</label>
                    <label><input type='radio' className='tool-button' checked={tool === Tool.Rectangle} onClick={() => setTool(Tool.Rectangle)} />Rectangle</label>
                    <select className='color-select' onChange={(event) => setColor(event.target.value as Color)}>
                        <option key={Color.Black} value={Color.Black}>Black</option>
                        <option key={Color.Red} value={Color.Red}>Red</option>
                        <option key={Color.Green} value={Color.Green}>Green</option>
                        <option key={Color.Blue} value={Color.Blue}>Blue</option>
                    </select>
                </div>
            </div>
            <canvas id='canvas'
                width={props.Width}
                height={props.Height}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove} />
        </div>
    )
}