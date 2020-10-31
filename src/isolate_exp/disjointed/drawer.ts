import {Link, Node, NodeType} from './exp-model';

export class Drawer {

    static drawNodes(mainGroup: any, nodes: Node[], childrenCount: number): d3.Selection<any, any, any, any> {
        const node = mainGroup.append('g')
            // .attr('stroke', (d: any) => {
            //     return '#000';
            // })
            .attr('stroke-width', 1)
            .selectAll('circle')
            .data(nodes)
            .join('circle')
             .filter((d: any) =>  (d.type === NodeType.first_level) || (d.parent && d.parent.children.length >= childrenCount))
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
            })
            .on('wheel', (d: Node) => {
                //console.log(nodes[d.index]);
                // console.log(d);
            });
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
            .attr('stroke-opacity', 0)
            .selectAll('line')
            .data(links)
            .join('line');
        // .attr('stroke-width', (d: { value: number; }) => Math.sqrt(d.value));
    }
}
