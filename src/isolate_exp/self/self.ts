// import * as d3 from 'd3';
//
// const width = 960,
//     height = 500;
//
// const radius =  d3.scaleLinear()
//     // .domain([1, 600])
//     .range([0, 6]);
//
// const svg = d3.select('body').append('svg')
//     .attr('width', width)
//     .attr('height', height);
//
//
//     d3.forceSimulation()
//     // @ts-ignore
//     .force('link', d3.forceLink().id((d: any) => { return radius(d.source.size) + radius(d.target.size) + 20; }).distance(10).strength(1))
//     .force('charge', d3.forceManyBody().strength(-400));
//     // .size([width, height])
//    // .linkDistance(function(d: any) { return radius(d.source.size) + radius(d.target.size) + 20; });
//
// const graph = {
//     'nodes': [
//         {'size': 12},
//         {'size': 12},
//         {'size': 12}
//     ],
//     'links': [
//         {'source': 0, 'target': 1},
//         {'source': 1, 'target': 2},
//         {'source': 2, 'target': 2}
//     ]
// };
//
// const drawGraph = function(graph: { nodes: any; links: any; }) {
//     force
//         .nodes(graph.nodes)
//         // @ts-ignore
//         .links(graph.links)
//         .on('tick', tick)
//         .start();
//     const link = svg.selectAll('.link')
//         .data(graph.links)
//         .enter().append('path')
//         .attr('class', 'link');
//
//     const node = svg.selectAll('.node')
//         .data(graph.nodes)
//         .enter().append('g')
//         .attr('class', 'node');
//       //  .call(force.drag);
//
//     node.append('circle')
//         .attr('r', function(d: any) { return radius(d.size); })
//         .style('fill', function(d: any) { return 'hot-pink'; });
//
//     function tick() {
//         simulation.on('tick', () => {
//             link.attr('x1', (d: { source: { x: string | number | boolean; }; }) => d.source.x)
//                 .attr('y1', (d: { source: { y: string | number | boolean; }; }) => d.source.y)
//                 .attr('x2', (d: { target: { x: string | number | boolean; }; }) => d.target.x)
//                 .attr('y2', (d: { target: { y: string | number | boolean; }; }) => d.target.y)
//                 .attr('d', function(d: any) {
//                     let x1 = d.source.x,
//                         y1 = d.source.y,
//                         x2 = d.target.x,
//                         y2 = d.target.y,
//                         dx = x2 - x1,
//                         dy = y2 - y1,
//                         dr = Math.sqrt(dx * dx + dy * dy),
//
//                         // Defaults for normal edge.
//                         drx = dr,
//                         dry = dr,
//                         xRotation = 0, // degrees
//                         largeArc = 0, // 1 or 0
//                         sweep = 1; // 1 or 0
//
//                     // Self edge.
//                     if ( x1 === x2 && y1 === y2 ) {
//                         // Fiddle with this angle to get loop oriented.
//                         xRotation = -45;
//
//                         // Needs to be 1.
//                         largeArc = 1;
//
//                         // Change sweep to change orientation of loop.
//                         // sweep = 0;
//
//                         // Make drx and dry different to get an ellipse
//                         // instead of a circle.
//                         drx = 30;
//                         dry = 20;
//
//                         // For whatever reason the arc collapses to a point if the beginning
//                         // and ending points of the arc are the same, so kludge it.
//                         x2 = x2 + 1;
//                         y2 = y2 + 1;
//                     }
//
//                     return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
//                 });
//
//             node
//                 .attr('cx', (d: { index: number; x: number; }) => d.x)
//                 .attr('cy', (d: { y: string | number | boolean; }) => d.y);
//         });
//     }
// };
//
// export function loadSelf() {
//     drawGraph(graph);
// }
