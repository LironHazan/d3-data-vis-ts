import {ExpModel, Link, Node, NodeType} from './exp-model';
import * as d3 from 'd3';
// @ts-ignore
import * as d3tile from 'd3-tile';
import {Layout} from './layout';
import { Subject } from 'rxjs';
import {MapperFactory, MapType} from './mapper_factory';
import {select} from 'd3';

export enum Breakpoint {
    sm,
    md
}

export class Drawer {
    public static notifier$: Subject<Breakpoint> = new Subject();

    static drawNodes(simulation: any, mapper: MapperFactory, mainGroup: any, nodes: Node[], firstOnly: boolean = true): Selection {
        const node = mainGroup.append('g')
            .attr('class', 'node-g')
            .attr('stroke-width', 1)
            .selectAll('circle')
            .data(nodes)
            .join((enter: any) => {
                    return enter.append('circle')
                        .attr('id', (d: any) => d.id)
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
                            return 'transparent';
                        })
                        .on('wheel', (event: WheelEvent, d: any) => {
                            // console.log(mapper.getNodeByIndex(d.index));
                            // console.log(d.index);
                            this.notifier$.next(d.id);
                            return d;
                        });
            }
            );

        function hide(ids: string[]) {
            // update nodes
            const indexes = ids.map((id: string) => {
                const index = mapper.getNodeById(id).index;
                return index;
            });
            nodes = nodes.filter((node) => !indexes.find((n) => n === node.index));

            node.data(nodes, (d: any) => d.id)
                .join((enter: any) => {
                        return enter.append('circle')
                            .attr('id', (d: any) => d.id)
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
                                return 'transparent';
                            })
                            .on('wheel', (event: WheelEvent, d: any) => {
                                // console.log(mapper.getNodeByIndex(d.index));
                                // console.log(d.index);
                                this.notifier$.next(d.id);
                                return d;
                            });
                    }
                );
            simulation.alpha(0).restart();

            // node.filter((d: any) => {
            //     console.log(d);
            //   //  return !ids.find(d.id);
            // });
        }

        node.on('click', function (event: MouseEvent, d: any) {
            const node  = mapper.getNodeByIndex(d.index);
            // const children = node.childrenIds.reduce(())
            hide(node.childrenIds);
            select(this).attr('stroke', 'hotpink');
             console.log('map', this);
            // console.log('d', d.index);
        });

        node.append('title').text((d: { id: string }) => d.id);

        return node;
    }

    static drawLinks(mainGroup: any, links: Link[], firstOnly = true): d3.Selection<any, any, any, any> {
        return  mainGroup.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.7)
            .selectAll('line')
            .data(links)
            .join('line');
        // .attr('stroke-width', (d: { value: number; }) => Math.sqrt(d.value));
    }

    static update(simulation: any, firstOnly = true, svg: any = null, mainGroup: any = null, data: ExpModel<any, any>, breakpoint: Breakpoint = Breakpoint.sm, width = 680, height = 680, count: number = 6) {
        const tiler = d3tile.tile().extent([[0, 1], [width, height]]);

        svg = Layout.setSvgSelector(width, height);
        mainGroup = svg.append('g').attr('class', 'main-group');

        const mapper =  MapperFactory.getInstance(MapType.id, data.nodes);
        data.nodes.map((node: Node, i) => mapper.setNodeByIndex(i, node));

        const links = data.links.map((d: object) => Object.create(d));
        const nodes = data.nodes.map((d: object) => Object.create(d));

       simulation =  Layout.initSimulation(nodes, links);
       // Update the indexed nodes with coordinates info
       simulation.nodes().forEach((node: Node, index: number) => {
           mapper.setNodeByIndex(index, {...mapper.getNodeByIndex(index), ...node});
           mapper.setNodeById(node.id, {...mapper.getNodeById(node.id), ...node});
       });

        let link = Drawer.drawLinks(mainGroup, links, firstOnly);
        let node: any = Drawer.drawNodes(simulation, mapper, mainGroup, nodes, firstOnly);

        // node.on('click', (event: any, d: any) => {
        //     simulation.alpha(1).restart();
        // });

        simulation && Drawer.updateSimulation(simulation, link, node, links, nodes, firstOnly);

        const zoom = d3.zoom().scaleExtent([0.6, 1.2])
            .on('zoom', (event: any) => zoomed(event.transform));
        mainGroup.call(zoom).call(zoom.translateTo, 0, 0);

        function zoomed(transform: any) {
            const tiles = tiler(transform);
            console.log(tiles);
          mainGroup.attr('transform', `scale(${tiles.scale})  translate(${tiles.translate.join(',')})`);

            if (tiles.scale >= 1.1 && breakpoint !== Breakpoint.md) {
                simulation.alpha(1).restart();
                Drawer.notifier$.next(Breakpoint.md);
            }
            else if (tiles.scale <= 0.9 && breakpoint !== Breakpoint.sm) {
                Drawer.notifier$.next(Breakpoint.sm);
            }
        }

        return { svg, mainGroup, simulation };
    }

    static updateSimulation(simulation: any, link: any, node: any, links: Link[], nodes: Node[], firstOnly: boolean = true) {
        simulation.on('tick', () => {
            link
                .attr('x1', (d: { source: { x: string | number | boolean; }; }) => d.source.x)
                .attr('y1', (d: { source: { y: string | number | boolean; }; }) => d.source.y)
                .attr('x2', (d: { target: { x: string | number | boolean; }; }) => d.target.x)
                .attr('y2', (d: { target: { y: string | number | boolean; }; }) => d.target.y);

            node
                .attr('cx', (d: { index: number; x: number; }) => d.x)
                .attr('cy', (d: { y: string | number | boolean; }) => d.y);
        });

        simulation.nodes(nodes);
        simulation.force('link').links(links);
        simulation.alphaTarget(-1).restart();
    }
}
