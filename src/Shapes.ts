import { Drawable } from "roughjs/bin/core";

export interface Vector2D {
    X: number,
    Y: number,
}

export enum ShapeKind {
    Line,
    Rectangle
}

export interface Shape {
    Drawable: Drawable,
    Kind: ShapeKind,
}

export interface Line extends Shape {
    Start: Vector2D,
    End: Vector2D,
}

export interface Rectangle extends Shape {
    Position: Vector2D,
    Size: Vector2D,
}
