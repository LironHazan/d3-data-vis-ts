import * as d3 from 'd3';
import { MITER_ACTIONS } from '../data/mitre-actions-model';
import { HierarchyNode } from 'd3';

interface MiterAction {
    id: number;
    action: string;
    data: MiterAction;
    children: MiterAction[];
}

function update <T>(group: T, classSelector: string, title: string) {

    function mouseover() {
        const node: any = d3.select(this).data()[0];
        const { action } = node.data;
        const actionType  = node.parent.data.action;
        const tip = d3.select('.tooltip');
        tip.style('top', `${d3.event.clientY + 5}px`)
            .style('left', `${d3.event.clientX + 10}px`)
            .style('opacity', 0.8)
            .transition();
        tip.select('.action-group')
            .html(`${actionType}:`);
        tip.select('.action')
            .html(action);
    }

    function mousemove() {
        d3.select('.tooltip')
            .style('top', `${d3.event.clientY + 5}px`)
            .style('left', `${d3.event.clientX + 10}px`);
    }

    function mouseout() {
        d3.select('.tooltip')
            .style('opacity', 0)
            .transition();
    }

    // Set dimensions.
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const width = 500 - margin.right - margin.left;
    const height = 400 - margin.top - margin.bottom;

    const root: HierarchyNode<T> = d3.hierarchy(group)
        .sum((d: any) => d.id); // Must use sum in order to get the radius properly

    // Circle pack layout.
    const packLayout = d3
        .pack()
        .size([width, height])
        .padding(10);

    packLayout(root);

    // Draw
    const svgElement = d3.select('.container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .node();

    const svg = d3.select(svgElement)
        .attr('class', classSelector);

    svg.append('text')
        .text(title)
        .attr('y', 15)
        .attr('x', 0)
        .attr('font-size', 16)
        .attr('font-family', 'monospace')
        .attr('fill', 'black');

    const leaf = svg.selectAll('g')
        .data(root.leaves())
        .enter()
        .append('g')
        .attr('transform', (d: any) => `translate(${d.x + 1},${d.y + 1})`);

    const circle = leaf.append('circle')
        .attr('r',  (d: any) => d.r + 4) // dynamic radius
        .attr('fill', d => 'black')
        .on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseout', mouseout);
    //
    // leaf.append('text')
    //     .attr('dx', (d: any) =>  - 20)
    //     .attr('fill', d => 'yellow')
    //     .text((d: any) =>  d.data.action );
}

export function loadBubble() {
    const groupOne = { ...MITER_ACTIONS };
    groupOne.children = [groupOne.children[0]];

    const groupTwo = { ...MITER_ACTIONS };
    groupTwo.children = [groupTwo.children[1]];

    update(groupOne, 'group-1', groupOne.children[0].action);
    update(groupTwo, 'group-2', groupTwo.children[0].action);

}
