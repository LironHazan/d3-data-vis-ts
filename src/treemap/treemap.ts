import * as d3 from 'd3';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { treemap, TreemapLayout} from 'd3-hierarchy';
import {HierarchyNode} from 'd3';

// canvas:
// https://observablehq.com/@pstuffa/canvas-treemap

function update<T extends { value: any }>(res: T) {
  // Set dimensions.
  let container: any = d3.select('body').node();
  let { width }: DOMRect = container.getBoundingClientRect();
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  width = width - margin.right - margin.left;
  const height = 800 - margin.top - margin.bottom;

  const root = d3.hierarchy(res)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);


  // Treemap layout.
  const layout = d3
    .treemap()
    .size([width, height])
    .paddingTop(28)
    .paddingRight(10)
    .paddingInner(5)(root);

  const nodes = root.leaves();

  // Draw base.
  const svg = d3
    .select('.treemap-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  // const filter = svg.append('defs')
  //     .append('filter')
  //     .attr('id', 'brightness');

  const opacity = d3.scaleLinear()
      .domain([10, 30])
      .range([.5, 1]);

  // filter
  // .append('feGaussianBlur')
  // .attr('class', 'blur')
  // .attr('stdDeviation','0.5')
  // .attr('result','coloredBlur')
  // .append('feMerge')
  // .append('feMergeNode')
  // .attr('in','coloredBlur')
  // .append('feMergeNode')
  // .attr('in','SourceGraphic');

  // Draw treemap.
  svg
    .selectAll('.node')
    .data(nodes)
    .join('rect')
    // .attr('filter', 'url(#brightness)')
      .join('foreignObject')

      .attr('class', 'node')
    .attr('x', (d: any) => d.x0)
    .attr('y', (d: any) => d.y0)
    .attr('width', (d: any) => {
      d.data.width = d.x1 - d.x0;
      return d.x1 - d.x0;
    })
    .attr('height', (d: any) => d.y1 - d.y0)
    .style('fill', '#250160')
    .style('opacity', (d: any) => opacity(d.data.revenue));

  svg
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .attr('x', function(d: any) { return d.x0 + 5; })    // +10 to adjust position (more right)
    .attr('y', function(d: any) { return d.y0 + 20; })    // +20 to adjust position (lower)
    .text(function(d: any) { return `Devices: ${d.data.value}` ; })
    .attr('font-size', '11px')
    .attr('fill', 'white');



}

// Load data.
export function loadTreemap() {
  d3.json('./data/data.json').then(res => {
    update(res);
  });
}

