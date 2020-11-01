import {ExpModel, Link, Node, NodeType} from './exp-model';
import * as d3 from 'd3';
// @ts-ignore
import * as d3tile from 'd3-tile';
import {Layout} from './layout';
import { Subject } from 'rxjs';

export enum Breakpoint {
    sm,
    md
}

export class Drawer {
    public static notifier$: Subject<Breakpoint> = new Subject();

    static drawNodes(mainGroup: any, nodes: Node[], childrenCount: number): d3.Selection<any, any, any, any> {
        const node = mainGroup.append('g')
            // .attr('stroke', (d: any) => {
            //     return '#000';
            // })
            .attr('stroke-width', 1)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
           // .filter((d: any) => (d.type === NodeType.first_level))
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
            }).attr('stroke-width', (d: any) => {
            if (d.type === NodeType.first_level) {
                return 3;
            }})
            .attr('fill', (d: any) => {
                if (d.type === NodeType.second_level) {
                    return '#DBDFFF';
                }
                if (d.type === NodeType.first_level) {
                    return '#3E95FE';
                }
                return 'transparent';
            });
            // .on('wheel', (d: Node) => {
            //     this.notifier$.next(d);
            // });

        node.on('click', (d: any) => {
            console.log(nodes[d.index]);
        });

        node.append('title')
            .text((d: { id: string | number | boolean; }) => d.id);
        return node;
    }

    static drawLinks(mainGroup: any, links: Link[]): d3.Selection<any, any, any, any> {
        return  mainGroup.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(links)
            .join('line');
        // .attr('stroke-width', (d: { value: number; }) => Math.sqrt(d.value));
    }

    static drawGraph(data: ExpModel<any, any>, breakpoint: Breakpoint = Breakpoint.sm,  width = 680, height = 680, count: number = 6 ) {

        let transform = d3.zoomIdentity;
        const tiler = d3tile.tile().extent([[0, 0], [width, height]]);

        const svg = Layout.setSvgSelector(width, height);

        const mainGroup = svg.append('g').attr('class', 'main-group');

        const links = data.links.map((d: object) => Object.create(d));
        const nodes = data.nodes.map((d: object) => Object.create(d));

        const simulation = Layout.initSimulation(nodes, links);

        Drawer.updateGraph(simulation, mainGroup, links, nodes, count);

        const zoom = d3.zoom().scaleExtent([0.8, 3]).on('zoom', (event: any) => zoomed(event.transform));

        mainGroup.call(zoom).call(zoom.translateTo, 0, 0);

        function zoomed(transform: any) {

            const tiles = tiler(transform);
            mainGroup.attr('transform', `scale(${tiles.scale})  translate(${tiles.translate.join(',')})`);
            console.log(tiles);

            if (tiles.scale >= 1.2 && breakpoint !== Breakpoint.md) {
                console.log('remove');
                svg.remove();
                Drawer.notifier$.next(Breakpoint.md);
            }
            else if (tiles.scale <= 0.9 && breakpoint !== Breakpoint.sm) {
                    svg.remove();
                    Drawer.notifier$.next(Breakpoint.sm);
            }
        }

        return svg.node();
    }

    static updateGraph(simulation: { on: (arg0: string, arg1: () => void) => void; }, mainGroup: any, links: Link[], nodes: Node[], count: number) {
        let link = Drawer.drawLinks(mainGroup, links);
        let node = Drawer.drawNodes(mainGroup, nodes, count);

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

    }
}
