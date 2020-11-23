import {Node, NodeType} from './exp-model';
import * as d3 from 'd3';
// @ts-ignore
import * as d3tile from 'd3-tile';
import {Layout} from './layout';
import {MapperFactory, MapType} from './mapper_factory';
import {Drawer} from './drawer';

export enum Breakpoint {
    sm,
    md
}

export class DrawerUpdateFormat {

    static update(breakpoint: Breakpoint = Breakpoint.sm, width = 680, height = 680) {
        // let transform = d3.zoomIdentity;
        const tiler = d3tile.tile().extent([[0, 0], [width, height]]);

        const svg = Layout.setSvgSelector(width, height);
        const mainGroup =  svg.append('g').attr('class', 'main-group');

        const simulation = d3.forceSimulation()
            .force('link', d3.forceLink().id((d: any) => d.id).distance(18))
            .force('charge', d3.forceManyBody().strength(-40).distanceMax(900))
            .force('x', d3.forceX().strength(0.1))
            .force('y', d3.forceY().strength(0.1))
            .on('tick', ticked);

        let link = mainGroup.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.7)
            .selectAll('line');

        let node = mainGroup.append('g')
            .attr('class', 'node-g')
            .attr('stroke-width', 1)
            .selectAll('circle');

        function ticked() {
            link
                .attr('x1', (d: { source: { x: string | number | boolean; }; }) => d.source.x)
                .attr('y1', (d: { source: { y: string | number | boolean; }; }) => d.source.y)
                .attr('x2', (d: { target: { x: string | number | boolean; }; }) => d.target.x)
                .attr('y2', (d: { target: { y: string | number | boolean; }; }) => d.target.y);

            node
                .attr('cx', (d: { index: number; x: number; }) => d.x)
                .attr('cy', (d: { y: string | number | boolean; }) => d.y);
        }

        const zoom = d3.zoom().scaleExtent([0.8, 3])
            .on('zoom', (event: any) => zoomed(event.transform));
        mainGroup.call(zoom).call(zoom.translateTo, 0, 0);

        function zoomed(transform: any) {

            const tiles = tiler(transform);
            mainGroup.attr('transform', `scale(${tiles.scale})  translate(${tiles.translate.join(',')})`);

            if (tiles.scale >= 1.2 && breakpoint !== Breakpoint.md) {
                Drawer.notifier$.next(Breakpoint.md);
            }
            else if (tiles.scale <= 0.9 && breakpoint !== Breakpoint.sm) {
                Drawer.notifier$.next(Breakpoint.sm);
            }
        }

        return Object.assign(svg.node(), { update: ({ nodes, links }: any) => {

                const mapper =  MapperFactory.getInstance(MapType.id, nodes);
                nodes.map((node: Node, i: number) => mapper.setNodeByIndex(i, node));

                const old = new Map(node.data().map((d: any) => [d.id, d]));
                // links = links.map((d: object) => Object.create(d));
                // nodes = nodes.map((d: object) => Object.create(d));
                nodes = nodes.map((d: { id: any; }) => Object.assign(old.get(d.id) || {}, d));
                links = links.map((d: any) => Object.assign({}, d));

                simulation.nodes().forEach((node, index) => {
                    mapper.setNodeByIndex(index, {...mapper.getNodeByIndex(index), ...node});
                });

                node = node.data(nodes)
                    .join((enter: any) => enter.append('circle')
                        .attr('r', (d: any) => {
                            if (d.type === NodeType.second_level) {
                                return 10;
                            }
                            return 5;
                        })
                        .attr('stroke', (d: any) => {
                            if (d.type === NodeType.first_level) {
                                return '#1A2B59';
                            }
                        })
                        .attr('stroke-width', (d: any) => {
                            if (d.type === NodeType.first_level) {
                                return 3;
                            }
                        })
                        .attr('fill', (d: any) => {
                            if (d.type === NodeType.second_level) {
                                return '#DBDFFF';
                            }
                            if (d.type === NodeType.first_level) {
                                return '#3E95FE';
                            }
                            return '#3E95FE';
                        })
                        .on('wheel', (event: WheelEvent, d: Node) => {}));

                // link.data(links)
                //     .join('line');

                link = link
                    // @ts-ignore
                    .data(links, (d: any) => [d.source, d.target])
                    .join('line');

                simulation.nodes(nodes);
                // @ts-ignore
                simulation.force('link').links(links);
                simulation.alpha(2).restart();
            }});
    }
}
