import * as d3 from 'd3';
import { HierarchyNode } from 'd3-hierarchy';
import {Positions, TreemapUtils} from './treemapUtils';
import {ScaleOrdinal} from 'd3';

// todo: canvas:
// https://observablehq.com/@pstuffa/canvas-treemap

// export class TreemapInteractive {
//
// }

function hierarchyDataLayer<T extends { total: any }>(data: T): HierarchyNode<T> {
    return d3.hierarchy(data)
        .sum(d => d.total)
        .sort((a: HierarchyNode<T> , b: HierarchyNode<T> ) => b.height - a.height || b.value - a.value);
}

function treemapVisLayout<T>(root: HierarchyNode<T>, width: number, height: number) {
    d3.treemap()
        .tile(d3.treemapResquarify.ratio(height / width * 0.5 * (1 + Math.sqrt(5))))
        .size([width, height])
        .paddingTop(15)
        .paddingRight(20)
        .paddingInner(10)
        .paddingOuter(25)
        // .round(true)
        (root);
}

export async function loadZoomable() {
    d3.json('./data/hidden/wanted.json').then(res => {
        const { data } = res;
        main(data);
        // update(data);
    });
}

function main(data2: any) {
    // Dimensions
        const { width, height, margin, x, y } = TreemapUtils.getRectBounding();
        // Range ord todo: change colors
        const color = d3.scaleOrdinal()
        .range(d3.schemeDark2.map(function(c: any) { c = d3.rgb(c); c.opacity = 0.6; return c; }));

        let svg = d3.select('#treemap-container')
          .append('svg')
            .attr('width', width - margin.left - margin.right)
            .attr('height', height - margin.bottom - margin.top)
            .style('margin-left', -margin.left + 'px')
            .style('margin.right', -margin.right + 'px')
          .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .style('shape-rendering', 'crispEdges');

        let rootLevelSelector = svg
          .append('g')
            .attr('class', 'root-level');

        rootLevelSelector
          .append('rect')
            .attr('y', -margin.top)
            .attr('width', width)
            .attr('height', margin.top);

        rootLevelSelector
          .append('text')
            .attr('x', 6)
            .attr('y', 6 - margin.top)
            .attr('dy', '.75em');

    const root = hierarchyDataLayer(data2);
    initialize(root, width, height);
    accumulate(root);
    layout(root);
    treemapVisLayout(root, width, height);
    render(root, svg, rootLevelSelector, { x, y }, color);
}

// Aggregate the values for internal nodes. This is normally done by the
// treemap layout, but not here because of our custom implementation.
// We also take a snapshot of the original children (_children) to avoid
// the children being overwritten when when layout is computed.
function accumulate(d: any) {
    return (d._children = d.children)
        ? d.value = d.children.reduce(function<T, V>(p: T, v: V) { return p + accumulate(v); }, 0) : d.value;
}

// Compute the treemap layout recursively such that each group of siblings
// uses the same size (1×1) rather than the dimensions of the parent cell.
// This optimizes the layout for the current zoom state. Note that a wrapper
// object is created for the parent node for each group of siblings so that
// the parent’s dimensions are not discarded as we recurse. Since each group
// of sibling was laid out in 1×1, we must rescale to fit using absolute
// coordinates. This lets us use a viewport to zoom.
function layout(node: any) {
    if (node._children) {
        for (const child of node._children) {
            child.x0 = node.x0 + child.x0 * node.x1;
            child.y0 = node.y0 + child.y0 * node.y1;
            child.x1 *= (node.x1 - node.x0);
            child.y1 *= (node.y1 - node.y0);
            child.parent = node;
            layout(child);
        }
    }
}

function render(node: any,
                svg: any,
                rootLevel: any,
                { x, y }: Positions,
                color: ScaleOrdinal<string, unknown>) {
    let transitioning: boolean;

    rootLevel
        .datum(node.parent)
        .on('click', transition)
        .select('text')
        .text(node.ancestors().reverse().map((d: any) => d.data.name).join('/'));

    const firstDepth = svg.insert('g', '.root-level')
        .datum(node)
        .attr('class', 'depth');

    const g = firstDepth.selectAll('g')
        .data(node._children)
        .enter().append('g');

    g.filter(function(d: any) { return d._children; })
        .classed('children', true)
        .on('click', transition);

    const children = g.selectAll('.child')
        .data(function(d: any) { return d._children || [d]; })
        .enter().append('g');

    children.append('rect')
        .attr('class', 'child')
        .call(rect, {x , y})
        .append('title')
        .text(function(d: any) { return d.data.name + ' (' + d.data.total + ')'; });

    children.append('text')
        .attr('class', 'ctext')
        .text(function(d: any) { return d.data.name; })
        .call(text2, {x , y});

    g.append('rect')
        .attr('class', 'parent')
        .call(rect, {x , y});

    const t = g.append('text')
        .attr('class', 'ptext')
        .attr('dy', '.75em');

    t.append('tspan')
        .text(function(d: any) { return d.data.name; });

    t.append('tspan')
        .attr('dy', '1.0em')
        .text(function(d: any) { return d.data.total; });

    t.call(text, {x , y});

    g.selectAll('rect')
        .style('fill', function(d: any) { return color(d.data.name); });

    function transition(d: any) {
        if (transitioning || !d) return;
        transitioning = true;
        const g2 = render(d, svg, rootLevel, { x, y }, color),
            t1 = firstDepth.transition().duration(750),
            t2 = g2.transition().duration(750);

        // Update the domain only after entering new elements.
        x.domain([d.x0, d.x0 + (d.x1 - d.x0)]);
        y.domain([d.y0, d.y0 + (d.y1 - d.y0)]);

        // Enable anti-aliasing during the transition.
        svg.style('shape-rendering', null);

        // Draw child nodes on top of parent nodes.
        svg.selectAll('.depth').sort(function(a: any, b: any) {
            return a.depth - b.depth; });

        // Fade-in entering text.
        g2.selectAll('text').style('fill-opacity', 0);

        // Transition to the new view.
        t1.selectAll('.ptext').call(text, {x , y}).style('fill-opacity', 0);
        t2.selectAll('.ptext').call(text, {x , y}).style('fill-opacity', 1);
        t1.selectAll('.ctext').call(text2, {x , y}).style('fill-opacity', 0);
        t2.selectAll('.ctext').call(text2, {x , y}).style('fill-opacity', 1);
        t1.selectAll('rect').call(rect, {x , y});
        t2.selectAll('rect').call(rect, {x , y});

        // Remove the old node when the transition is finished.
        t1.remove().on('end', function() {
            svg.style('shape-rendering', 'crispEdges');
            transitioning = false;
        });
    }
    return g;
}

function text(text: any, { x, y }: Positions) {
    text.selectAll('tspan')
        .attr('x', function(d: any) { return x(d.x0) + 6; });

    text.attr('x', function(d: any) { return x(d.x0) + 6; })
        .attr('y', function(d: any) { return y(d.y0) + 3; })
        .style('opacity', function(d: any) {
            const w = x(d.x1) - x(d.x0);
            return this.getComputedTextLength() < w - 6 ? 1 : 0; });
}

function text2(text: any, { x, y }: Positions) {
    text.attr('x', function(d: any) {
        return x(d.x1) - this.getComputedTextLength() - 6;
    }).attr('y', function(d: any) { return y(d.y1) - 6; })
      .style('opacity', function(d: any) {
        const w = x(d.x1) - x(d.x0);
        return this.getComputedTextLength() < w - 6 ? 1 : 0;
    });
}

function initialize(root: any, width: number, height: number) {
    root.x = root.y = 0;
    root.x1 = width;
    root.y1 = height;
    root.depth = 0;
}

function rect(rect: any, {x , y}: Positions) {
    rect.attr('x', function(d: any) { return x(d.x0); })
        .attr('y', function(d: any) { return y(d.y0); })
        .attr('width', function(d: any) {
            return x(d.x1) - x(d.x0);
        })
        .attr('height', function(d: any) {
            return y(d.y1) - y(d.y0);
        });
}
