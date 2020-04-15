import * as d3 from 'd3';
// canvas:
// https://observablehq.com/@pstuffa/canvas-treemap

function update<T extends { count: any }>(res: T) {
  // Set dimensions.
  let container: any = d3.select('body').node();
  let { width, height }: DOMRect = container.getBoundingClientRect();
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };
  width = width - margin.right - margin.left;
  height = height - margin.top - margin.bottom;

  const root = d3.hierarchy(res)
      .sum(d => d.count)
      .sort((a, b) => b.value - a.value);


  // Treemap layout.
  const layout = d3
    .treemap()
    .size([width, height])
     .paddingTop(15)
     .paddingRight(20)
     .paddingInner(10)
     .paddingOuter(25)
     // .round(true)
    (root);

  const nodes = root.descendants();

  // Draw base.
  const svg = d3
    .select('.treemap-container')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


  const filter = svg.append('defs')
      .append('filter')
      .attr('id', 'glowness');

  // const color = d3.scaleOrdinal()
  //     .domain(['data', 'analytics', 'animate'])
  //     .range([ '#402D54', '#D18975', '#8FD175']);

  const opacity = d3.scaleLinear()
      .domain([1, 600])
      .range([.4, 1]);

  filter
  .append('feGaussianBlur')
  .attr('class', 'blur')
  .attr('stdDeviation', '1');

  const node = svg.append('g')
    .attr('filter', 'url(#glowness)')
    // .join('foreignObject')
    .selectAll('rect')
    .data(nodes)
    .join('rect');


    node
    .attr('class', 'node')
    .attr('stroke', (d: any) => {
      if (!d.data.color) {
        return 'red';
      } else if (d.data.color) {
        return 'green';
  }})
    .attr('x', (d: any) => d.x0)
    .attr('y', (d: any) => d.y0)
    .attr('width', (d: any) => {
      d.data.width = d.x1 - d.x0;
      return d.x1 - d.x0;
    })
    .attr('height', (d: any) => {
      d.data.height = (d.y1 - d.y0) / 3;
      return d.y1 - d.y0;
    })
    .style('fill', (d: any) => {
      if (!d.parent) {
        return '#1F033D';
      } else return 'rgb(255, 255, 255)';
    })
    .style('opacity', (d: any) => opacity(d.data.count));


  node.filter((d: any) => d === root ? d.parent : d.children)
      .attr('cursor', 'pointer')
      .on('click', (d: any) => {
        return d === root ? update(d) : console.log('in');
      });

    const fo = svg.selectAll('foreignObject')
      .data(nodes)
      .enter()
      .append('foreignObject')
      .attr('y', function(d: any) { return d.y0; })
      .attr('x', function(d: any) { return d.x0; })
     // .attr('width', function(d: any) { return d.data.width; })
     // .attr('height', function(d: any) { return d.data.height; })
      .append('xhtml:body')
        .append('div')
      .attr('width', function(d: any) { return d.data.width; })
      .attr('height', function(d: any) { return d.data.width; })
      .html((d: any) => `<div> 4444 </div>`);

        // There's an issue with drwing inside the generated context need to investigate
      // .append('canvas')
      // .attr('id', 'glowingCanvas')
      // .attr('width', function(d: any) { return d.data.width; })
      // .attr('height', function(d: any) { return d.data.width; })
      // .html((d: any) => {
      //   const canvas: any = d3.select('#glowingCanvas').node();
      //   const ctx = canvas.getContext('2d');
      //   purpleNeonRect(ctx, d.x0, d.y0, 20, 20);
      //   return canvas;
      // });



}

// Load data.
export function loadTreemap() {
  d3.json('./data/data.json').then(res => {
    update(res);
  });
}

