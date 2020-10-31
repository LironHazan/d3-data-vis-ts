// node types

export enum NodeType {
    first_level= 'first_level',
    second_level = 'second_level',
}

interface CommonNodeAttributes {
    id?: string;
    size: number; // if there's no levelIntersection equals to outerCircleSize
    shape: 'circle';
    type: NodeType;
    links: Link[];
    children: any[];
    parent: Node | null;
}

export interface FirstLevelNode {
    levelIntersection: boolean; // if the second node levels are visible
    intersectionColor: string;
    outerCircleSize: number;
    outerCircleColor: string;
    innerCircleSize: number;
    innerCircleColor: string;
    innerCircleStroke: string;
}

export interface SecondLevelNode {
    circleColor: string;
    circleStroke: string;
}

export interface DisconnectedNode {

}

export type Node = CommonNodeAttributes & (FirstLevelNode | SecondLevelNode );

// link types

export interface Link {
    id?:  string;
    source: string;
    target: string;
}

export interface ExpModel<N, L>  {
    nodes: N[];
    links: L[];
}
