import {ExpModel, Link, NodeType} from './exp-model';

export function transformToGraphModel<N  extends { group: string, id: string }, L extends { target: any, source: any}>(data: ExpModel<N, L>): ExpModel<any, Link> {
    const nodes = data.nodes
        .map( (node: any) => {
            node.size = 2;
            node.shape = 'circle';
            node.type = node.group === 'Cited Works' ? NodeType.first_level : NodeType.second_level;
            switch (node.type) {
                case NodeType.first_level:
                    node.levelIntersection = false;
                    node. intersectionColor = '';
                    node.innerCircleColor = '';
                    node.innerCircleSize = 5;
                    node.innerCircleStroke = '';
                    node.outerCircleColor = '';
                    node.outerCircleSize = 5;
                    break;
                case NodeType.second_level:
                    node.circleColor =  '';
                    node.circleStroke = '';
            }
            return node;
        });

    const links: Link[] = data.links.map( (link) => ({
        source: link.source,
        target: link.target
    }));
    return { nodes, links };
}
