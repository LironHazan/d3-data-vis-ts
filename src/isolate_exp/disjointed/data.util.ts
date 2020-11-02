import {Link, Node, NodeType} from './exp-model';
import {MapperFactory, MapType} from './mapper_factory';

function hasConnections(node: any, target: string, source: string): boolean {
    return node.id === target || node.id === source;
}

function mapNodesById(nodes: Node[]):  MapperFactory {
    const idToNode = MapperFactory.getInstance(MapType.id, nodes);
    for (const node of nodes) {
        idToNode.setNodeById(node.id, node);
    }
    return idToNode;
}

function appendConnection(node: Node, links: Link[]) {
    for (const link of links) {
        if (hasConnections(node, link.target, link.source)) {
            node.links.push(link);
        }
    }
}

function appendChildNode(nodesMap: MapperFactory, node: Node) {
    for (const link of node.links) {
        // As target
        const linkedTarget = nodesMap.getNodeById(link.target);
        if (linkedTarget.id !== node.id) { // not self
            if (!isFirstLevel(linkedTarget)) {
                linkedTarget.parentId = node.id;
                node.childrenIds.push(linkedTarget.id);
            }
        }
        // As source
        const linkedSource = nodesMap.getNodeById(link.source);
        if (linkedSource.id !== node.id) { // not self
            if (!isFirstLevel(linkedSource)) {
                linkedSource.parentId = node.id;
                node.childrenIds.push(linkedSource.id);
            }
        }

    }
}

// set pointers to virtual children (by level)
function appendConnections(nodes: Node[], links: Link[]): { nodes: any, links: any } {
    const idToNode = mapNodesById(nodes);
    for (const node of nodes) {
        appendConnection(node, links);
        appendChildNode(idToNode, node);
    }
    return { nodes, links };
}

function isFirstLevel(node: Node): boolean {
    return node.type === NodeType.first_level;
}

function flatten(nodesMap: any, nestedNodes: Node[]): Node[] {
    return nestedNodes.reduce((acc: Node[], node: Node) => {
        if (!acc.find(n => n.id === node.id)) {
            acc.push(node);
        }
        for (const child of node.childrenIds) {
            if (!acc.find(n => n.id === child)) {
                acc.push(nodesMap.getNodeById(child));
            }
        }
        return acc;
    }, []);
}

// filter graph by virtual trees
export function filterSecondLevel(nodes: Node[], links: Link[], count: number = 6): { nodes: any, links: any }  {
    const map  = MapperFactory.getInstance(MapType.id, nodes);
    const graphData = appendConnections(nodes, links);
    // sort children by X and then split
    const nested = graphData.nodes.filter((node: Node) => node.type === NodeType.first_level);
    for (const node of nested) {
        if ( node.childrenIds.length >= count) {
            node.childrenIds = [...node.childrenIds.slice(0, count)] || [];
        }
    }
    graphData.nodes = flatten(map, nested).sort((a: Node, b: Node) => b.links.length - a.links.length);
    const nodesMap = mapNodesById(graphData.nodes);

    graphData.links =  links.filter((link: Link) => nodesMap.getNodeById(link.source) && nodesMap.getNodeById(link.target));
    return graphData;
}
