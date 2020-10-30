import * as d3 from 'd3';
import {ExpModel, FirstLevelNode, Link, Node, NodeType, SecondLevelNode} from './exp-model';

function graph(data: ExpModel<any, any>, width = 680, height = 680, ) {

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
        .attr('stroke-opacity', 0)
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
        })
        // parents only
       // .filter((d: any) => d.type === NodeType.first_level);


    //todo:
   //  Cited Works
    // Citing Patents
    // first state filter all Citing Patents
    // onClick / zoom in will add that certain
    // future model - lower layer domain agnostic with
    // and higher level transforms from domain to domain agnostic

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

function transformToGraphModel<N  extends { group: string, id: string }, L extends { target: any, source: any}>(data: ExpModel<N, L>): ExpModel<any, Link> {
    const nodes = data.nodes
        .map( (node: any) => {
        node.size = 2;
        node.shape = 'circle';
        node.type = node.group === 'Cited Works' ? NodeType.first_level : NodeType.second_level;
       switch (node.type) {
           case NodeType.first_level:
               node.levelIntersection = false;
               node. intersectionColor = '';
               node.innerCircleColor = '';
               node.innerCircleSize = 5;
               node.innerCircleStroke = '';
               node.outerCircleColor = '';
               node.outerCircleSize = 5;
               break;
           case NodeType.second_level:
                node.circleColor =  '';
                node.circleStroke = '';
       }
        return node;
    });

    const links: Link[] = data.links.map( (link) => ({
        source: link.source,
        target: link.target
    }));
    return { nodes, links };
}

export function loadGraph() {
    d3.json('../data/graph.json').then(data => {
        const tdata = transformToGraphModel(data);
        graph(tdata);
    });
}

