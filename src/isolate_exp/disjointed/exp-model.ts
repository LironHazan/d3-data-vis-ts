// node types

import {groupBy} from 'rxjs/operators';
import {ScopeAwareRuleWalker} from 'tslint';

export enum NodeType {
    first_level= 'first_level',
    second_level = 'second_level',
}

interface CommonNodeAttributes {
    id: string;
    index: number;
    size: number; // if there's no levelIntersection equals to outerCircleSize
    shape: 'circle';
    type: NodeType;
    links: Link[];
    childrenIds: string[];
    parentId: string;
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

enum Size {
    S,
    M,
    L,
    XL
}

// First map - network level
type Connection = { sourceId: string, targetId: string };
// 1. Fetch aggregated networks
enum NetworkGroup {
    tag,
    state // 'secured' | 'unsecured'
}

interface Networks {
    id: string;
    group: NetworkGroup;
    items: string[]; // network ids
    total: number; // --> for paging?
}

interface Subnet {
    id: string;
    networkId: string;
    totalDevices: number;
    size: Size; // S = 0 to 50 devices? /M 50 to 500 devices? / L 500 to 2000 ?/ XL > 2000 ?
    totalUnsecuredCount: number;
    notReviewedDevicesCount: number;
}

export interface NetworkItem {
    id: string;
    type: 'network' | 'floating';
    totalDevices: number;
    connections: Connection[]; // future
    size: Size; // S = 0 to 50 subnets? /M 50 to 500 subnets? / L 500 to 2000 ?/ XL > 2000 ?
    subnets: Subnet[]; // fetch subnet by net-Id
    totalUnsecuredCount: number;
    notReviewedDevicesCount: number;
}

// Device level --> drill down to subnet --> get list of devices
// get devices by networkItem id
export interface DeviceItem {
    id: string;
    networkId: string;
    seenBy: string [];
    deviceMgmtState: 'secured' | 'unsecured'; // etc..
    connections: Connection[]; // future
}
