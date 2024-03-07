import { Drawable } from "roughjs/bin/core";

export type Point = {
    X: number,
    Y: number,
}

export enum ShapeKind {
    Line,
    Rectangle,
}

export interface Shape {
    Drawable: Drawable,
    Kind: ShapeKind,
}

export interface Line extends Shape {
    Kind: ShapeKind,
    Start: Point,
    End: Point,
}

export interface Rectangle extends Shape {
    Kind: ShapeKind,
    TopLeft: Point,
    BottomRight: Point,
}

export enum Tool {
    Line,
    Rectangle,  
}
