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
    Start: Point,
    End: Point,
}

export enum Tool {
    Erase,
    Line,
    Rectangle,  
}

export enum Color {
    Black = '#000',
    Red = '#e00',
    Green = '#0e0',
    Blue = '#00e',
}
