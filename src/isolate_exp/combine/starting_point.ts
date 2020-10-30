import * as d3 from 'd3';

const _data = { name: 'query', children: [
        {name: 'AggregateExpression', value: 1616},
        {name: 'And', value: 1027},
        {name: 'Arithmetic', value: 3891},
        {name: 'Average', value: 891},
        {name: 'BinaryExpression', value: 2893},
        {name: 'Comparison', value: 5103}
    ]};

function tree(data = _data, width = 600, height = 600) {
    const root = d3.hierarchy(data);
    const links: any = root.links();
    const nodes: any = root.descendants();

    const simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(10).strength(1))
        .force('charge', d3.forceManyBody().strength(-50))
        .force('x', d3.forceX())
        .force('y', d3.forceY());

    const svg = d3.select('.container')
        .append('svg')
        // @ts-ignore
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

    const link = svg.append('g')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line');

    const node = svg.append('g')
        .attr('fill', '#fff')
        .attr('stroke', '#000')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('fill', (d: { children: any; }) => d.children ? null : '#000')
        .attr('stroke', (d: { children: any; }) => d.children ? null : '#fff')
        .attr('r', 5.5);
    // .call(drag(simulation));

    node.append('title')
        .text((d: { data: { name: string | number | boolean; }; }) => d.data.name);

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

export function loadCharts() {
    tree();
}
