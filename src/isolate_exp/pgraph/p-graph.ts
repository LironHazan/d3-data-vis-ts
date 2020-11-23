import * as d3 from 'd3';
import { drag } from 'd3';

function draw(dataset: any, {height, width, margin}: {height: number, width: number, margin: any}) {
    // let simulation = d3.forceSimulation()
    //     .force('link', d3.forceLink() // This force provides links between nodes
    //         .id((d: any) => d.id) // This sets the node id accessor to the specified function. If not specified, will default to the index of a node.
    //     )
    //     .force('charge', d3.forceManyBody().strength(-500)) // This adds repulsion (if it's negative) between nodes.
    //     .force('center', d3.forceCenter(width / 2, height / 2));

    const simulation = d3.forceSimulation(dataset.nodes)
        .force('link', d3.forceLink(dataset.links).id((d: any) => d.id).distance(10).strength(1))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    const svg = d3.select('.container')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    console.log('dataset is ...', dataset);

    // Initialize the links
    const link = svg.append('g')
        .attr('class', 'links')
        .selectAll('line')
        .data(dataset.links)
        .enter().append('line');

    // Initialize the nodes
    // @ts-ignore
    const node = svg.append('g')
        .attr('class', 'nodes')
        .selectAll('circle')
        .data(dataset.nodes)
        .enter().append('circle')
        .attr('r', 20)
        .call(drag()  // sets the event listener for the specified typenames and returns the drag behavior.
            // @ts-ignore
            .on('start', dragstarted) // start - after a new pointer becomes active (on mousedown or touchstart).
            // @ts-ignore
            .on('drag', dragged)      // drag - after an active pointer moves (on mousemove or touchmove).
            // @ts-ignore
            .on('end', dragended)     // end - after an active pointer becomes inactive (on mouseup, touchend or touchcancel).
        );

    // Text to nodes
    const text = svg.append('g')
        .attr('class', 'text')
        .selectAll('text')
        .data(dataset.nodes)
        .enter().append('text')
        .text((d: any) => d.id);

    simulation
        .nodes((dataset as any).nodes)// sets the simulation’s nodes to the specified array of objects, initializing their positions and velocities, and then re-initializes any bound forces;
        .on('tick', ticked); // use simulation.on to listen for tick events as the simulation runs.
    simulation.force('link');

    function ticked() {
        link.attr('x1', (d: any) => d.source.x)
            .attr('y1', (d: any) => d.source.y)
            .attr('x2', (d: any)  => d.target.x)
            .attr('y2', (d: any) => d.target.y);

        node.attr('cx', (d: any) => d.x)
            .attr('cy', (d: any) => d.y);

        text.attr('x', (d: any) => d.x - 5) // position of the lower left point of the text
            .attr('y', (d: any) => d.y + 5); // position of the lower left point of the text
    }


    function dragstarted(event: { active: any; }, d: { fy: any; y: any; fx: any; x: any; }) {
        if (event.active) simulation.alphaTarget(0.3).restart(); // sets the current target alpha to the specified number in the range [0,1].
        d.fy = d.y; // fx - the node’s fixed x-position. Original is null.
        d.fx = d.x; // fy - the node’s fixed y-position. Original is null.
    }

    function dragged(event: { x: any; y: any; }, d: { fx: any; fy: any; }) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event: { active: any; }, d: { fx: any; fy: any; }) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        console.log('dataset after dragged is ...', dataset);
    }
}

export function loadPGraph() {
    // create dummy data
    const dataset =  {
        nodes: [
            {id: 1},
            {id: 2},
            {id: 3},
            {id: 4},
            {id: 5},
            {id: 6}
        ],
        links: [
            {source: 1, target: 5},
            {source: 4, target: 5},
            {source: 4, target: 6},
            {source: 3, target: 2},
            {source: 5, target: 2},
            {source: 1, target: 2},
            {source: 3, target: 4}
        ]
    };
    draw(dataset, {height: 600, width: 600, margin: {top: 10, right: 10, bottom: 10, left: 10}});
}
