import * as d3 from 'd3';
import {ExpModel, Link, Node, NodeType} from './exp-model';
import {transformToGraphModel} from './utils';
import {filterSecondLevel} from './data.util';
import {Layout} from './layout';
import {Drawer} from './drawer';

function drawGraph(data: ExpModel<any, any>, width = 680, height = 680, count: number = 6 ) {

    let transform = d3.zoomIdentity;

    const svg = d3.select('.container')
        .append('svg')
        // @ts-ignore
        .attr('viewBox', [- width / 2, - height / 2, width, height]);

    const mainGroup = svg.append('g').attr('class', 'main-group');

    const links = data.links.map((d: object) => Object.create(d));
    const nodes = data.nodes.map((d: object) => Object.create(d));

    const simulation = Layout.initSimulation(nodes, links);

    function update ():  { link: any, node: any } {
        const link = Drawer.drawLinks(mainGroup, links);

        const node = Drawer.drawNodes(mainGroup, nodes, count);
        node.on('click', (d: any) => {
            console.log(nodes[d.index]);
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
        return { link, node };
    }

    const { link, node } = update();

    const zoom = d3.zoom()
        .scaleExtent([1, 1.2])
        .on('zoom', zoomed);

    mainGroup.call(zoom).call(zoom.translateTo, 0, 0);

    function zoomed() {
        transform = d3.event.transform;
        node.attr('transform', d3.event.transform);
        link.attr('transform', d3.event.transform);
        if (transform.k > 1.19) {
            console.log(transform.k);
            svg.remove();
            drawGraph(data, width, height, 2);
        }
    }

    return svg.node();
}

export function loadGraph() {
    d3.json('../data/graph.json').then(data => {
        const t = transformToGraphModel(data);
        const filtered = filterSecondLevel(t.nodes, t.links);
        drawGraph(filtered);
    });
}

