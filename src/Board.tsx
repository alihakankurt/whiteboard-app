import { useLayoutEffect } from "react"
import rough from 'roughjs'

export interface Props {
    Width: number,
    Height: number,
}

export default function Board(props: Props) {
    useLayoutEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const context = rough.canvas(canvas);

        context.rectangle(10, 20, 110, 120);
    })

    return (
        <canvas id="canvas" width={props.Width} height={props.Height}></canvas>
    )
}