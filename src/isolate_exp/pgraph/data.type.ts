export enum PType {
    storyline = 'storyline',
    os = 'os'
}
export interface PNode {
    id: string;
    type: PType;
    name: string;
    badgeICClass: string;
    icClass: string;
    strokeColor: string;
    bgColor: string;
    children: PNode[];
}
export interface PLink {
    id: string;
    source: string;
    target: string;
    type: PType;
}
export interface PGraph {
    nodes: PNode[];
    links: PLink[];
}
