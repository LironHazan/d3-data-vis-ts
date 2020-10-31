import * as d3 from 'd3';

type Simulation = d3.Simulation<d3.SimulationNodeDatum, undefined>;
type SimulationNode = d3.SimulationNodeDatum;
type SimulationLink = d3.SimulationLinkDatum<d3.SimulationNodeDatum>;

export class Layout {

    static initSimulation(nodes: SimulationNode[], links: SimulationLink[]): Simulation {
        return d3.forceSimulation(nodes)
            .force('link', d3.forceLink(links).id((d: any) => d.id).distance(15))
            .force('charge', d3.forceManyBody().strength(-30).distanceMax(900))
            .force('x', d3.forceX().strength(0.1))
            .force('y', d3.forceY().strength(0.1));
    }

    static setSvgSelector(width: number, height: number): d3.Selection<any, any, any, any> {
        return d3.select('.container')
            .append('svg')
            // @ts-ignore
            .attr('viewBox', [- width / 2, - height / 2, width, height]);
    }
}
