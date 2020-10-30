import * as d3 from 'd3';
import {ExpModel, Link, Node, NodeType} from './exp-model';
import {transformToGraphModel} from './utils';
import {link} from 'fs';

function drawGraph(data: ExpModel<any, any>, width = 680, height = 680 ) {

    const links = data.links.map((d: object) => Object.create(d));
    const nodes = data.nodes.map((d: object) => Object.create(d));

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(15))
        .force('charge', d3.forceManyBody().strength(-30).distanceMax(900))
        .force('x', d3.forceX().strength(0.1))
        .force('y', d3.forceY().strength(0.1));

    const svg = d3.select('.container')
        .append('svg')
        // @ts-ignore
        .attr('viewBox', [- width / 2, - height / 2, width, height]);

    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.7)
        .selectAll('line')
        .data(links)
        .join('line');
        // .attr('stroke-width', (d: { value: number; }) => Math.sqrt(d.value));

    const node = svg.append('g')
        // .attr('stroke', (d: any) => {
        //     return '#000';
        // })
        .attr('stroke-width', 1)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', (d: any) => {
            if (d.type === NodeType.second_level) {
                return 10;
            }
            return 10;
        })
        .attr('stroke', (d: any) => {
        if (d.type === NodeType.first_level) {
            return 'pink';
        }
    }).attr('stroke-width', (d: any) => {
            if (d.type === NodeType.first_level) {
                return 8;
            }})
        .attr('fill', (d: any) => {
            if (d.type === NodeType.second_level) {
                return '#DBDFFF';
            }
            return '#3E95FE';
        });
        // parents only
       // .filter((d: any) => d.type === NodeType.first_level);


    node.on('click', (d: any) => {
        console.log(d);
    });

    node.append('title')
        .text((d: { id: string | number | boolean; }) => d.id);

    simulation.on('tick', () => {
        link
            .attr('x1', (d: { source: { x: string | number | boolean; }; }) => d.source.x)
            .attr('y1', (d: { source: { y: string | number | boolean; }; }) => d.source.y)
            .attr('x2', (d: { target: { x: string | number | boolean; }; }) => d.target.x)
            .attr('y2', (d: { target: { y: string | number | boolean; }; }) => d.target.y);

        node
            .attr('cx', (d: { x: string | number | boolean; }) => d.x)
            .attr('cy', (d: { y: string | number | boolean; }) => d.y);
    });

    return svg.node();
}

function hasConnections(node: any, target: string, source: string): boolean {
    return node.id === target || node.id === source;
}

function mapNodesById(nodes: Node[]):  Map<string, Node> {
    const idToNode = new Map<string, Node>();
    for (const node of nodes) {
        idToNode.set(node.id, node);
    }
    return idToNode;
}

function appendConnection(node: Node, links: Link[]) {
    for (const link of links) {
        if (hasConnections(node, link.target, link.source)) {
            node.links.push(link);
        }
    }
}

function appendChildNode(nodesMap: Map<string, Node>, node: Node) {
    for (const link of node.links) {
       // As target
        const linkedTarget = nodesMap.get(link.target);
        if (linkedTarget.id !== node.id) { // not self
            if (!isFirstLevel(linkedTarget)) {
                node.children.push(linkedTarget);
            }
        }
      // As source
        const linkedSource = nodesMap.get(link.source);
        if (linkedSource.id !== node.id) { // not self
            if (!isFirstLevel(linkedSource)) {
                node.children.push(linkedSource);
            }
        }

    }
}

// set pointers to virtual children (by level)
function appendConnections(nodes: Node[], links: Link[]): { nodes: any, links: any } {
    const idToNode = mapNodesById(nodes);
    for (const node of nodes) {
        appendConnection(node, links);
        appendChildNode(idToNode, node);
    }
    return { nodes, links };
}

function isFirstLevel(node: Node): boolean {
    return node.type === NodeType.first_level;
}

function flatten(nestedNodes: Node[]): Node[] {
    return nestedNodes.reduce((acc: Node[], node: Node) => {
        if (!acc.find(n => n.id === node.id)) {
            acc.push(node);
        }
        for (const child of node.children) {
            if (!acc.find(n => n.id === child.id)) {
                acc.push(child);
            }
        }
        return acc;
    }, []);
}

function filterSecondLevel(nodes: Node[], links: Link[], count: number = 6): { nodes: any, links: any }  {
    const graphData = appendConnections(nodes, links);
    // sort children by something and then split
    for (const node of graphData.nodes) {
        if ( node.children.length >= count) {
            node.children = node.children.slice(0, count) || [];
            console.log(node.children);
        }
    }
    return graphData;
}

export function loadGraph() {
    d3.json('../data/graph.json').then(data => {
        const t = transformToGraphModel(data);
        const filtered = filterSecondLevel(t.nodes, t.links);
        t.nodes = flatten(filtered.nodes);
        console.log(t);
        drawGraph(transformToGraphModel(t));
    });
}

