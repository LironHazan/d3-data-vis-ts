import * as d3 from 'd3';
import { MITER_ACTIONS } from '../data/mitre-actions-model';
import { HierarchyNode } from 'd3';
import {svgToPng} from '../utils/export-to-png';

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

    svg.append('foreignObject')
        .append('xhtml:body')
        .append('div')
        .html(`<h1>fooo</h1>`);

        svg.append('image')
            .attr('xlink:href', 'https://cdn4.iconfinder.com/data/icons/seo-and-data/500/magnifier-data-128.png')
            .attr('width', 100)
            .attr('height', 100);

    const icon = `M12.1450213,20.7196596 C11.0175263,20.7196596 10.0411956,20.4623004 9.216,19.9475745 C8.39080438,19.4328485 7.75761923,18.7343023 7.31642553,17.8519149 C6.87523184,16.9695275 6.55251166,16.0340475 6.34825532,15.0454468 C6.14399898,14.0568461 6.04187234,12.990644 6.04187234,11.8468085 C6.04187234,10.9971021 6.09497819,10.1841741 6.20119149,9.408 C6.30740479,8.63182591 6.50348793,7.84340826 6.78944681,7.0427234 C7.07540569,6.24203855 7.44306158,5.54757741 7.89242553,4.95931915 C8.34178948,4.37106089 8.93003892,3.89310822 9.65719149,3.52544681 C10.3843441,3.1577854 11.2136124,2.97395745 12.1450213,2.97395745 C13.2725163,2.97395745 14.2488469,3.23131658 15.0740426,3.74604255 C15.8992382,4.26076853 16.5324233,4.95931474 16.973617,5.84170213 C17.4148107,6.72408952 17.7375309,7.65956953 17.9417872,8.64817021 C18.1460436,9.6367709 18.2481702,10.702973 18.2481702,11.8468085 C18.2481702,12.6965149 18.1950644,13.5094429 18.0888511,14.285617 C17.9826378,15.0617911 17.7824696,15.8502088 17.4883404,16.6508936 C17.1942113,17.4515785 16.8265554,18.1460396 16.3853617,18.7342979 C15.944168,19.3225561 15.3600036,19.8005088 14.6328511,20.1681702 C13.9056985,20.5358316 13.0764302,20.7196596 12.1450213,20.7196596 Z M14.245196,13.9469832 C14.8285807,13.3635984 15.1202688,12.6635472 15.1202688,11.8468085 C15.1202688,11.0300698 14.8358729,10.3300186 14.2670728,9.74663382 C13.6982726,9.16324904 12.9909292,8.87156103 12.1450213,8.87156103 C11.2991134,8.87156103 10.5917699,9.16324904 10.0229698,9.74663382 C9.45416961,10.3300186 9.1697738,11.0300698 9.1697738,11.8468085 C9.1697738,12.6635472 9.45416961,13.3635984 10.0229698,13.9469832 C10.5917699,14.530368 11.2991134,14.822056 12.1450213,14.822056 C12.9909292,14.822056 13.6909804,14.530368 14.245196,13.9469832 Z M12,24 C18.627417,24 24,18.627417 24,12 C24,5.372583 18.627417,0 12,0 C5.372583,0 0,5.372583 0,12 C0,18.627417 5.372583,24 12,24 Z`;
    // check and convert
    // svg.append('path')
    //         .attr('fill', '#999')
    //         .attr('d', icon);

    const exportbtn: HTMLButtonElement  = document.querySelector('.export');
    exportbtn.onclick = () => {
        svgToPng(svgElement, 900, 9000).then((result) => {
            console.log(result);
        });
    };
}

export function loadBubble() {
    const groupOne = { ...MITER_ACTIONS };
    groupOne.children = [groupOne.children[0]];

    const groupTwo = { ...MITER_ACTIONS };
    groupTwo.children = [groupTwo.children[1]];

    update(groupOne, 'group-1', groupOne.children[0].action);
    update(groupTwo, 'group-2', groupTwo.children[0].action);

}

