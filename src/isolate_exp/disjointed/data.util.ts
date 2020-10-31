import {Link, Node, NodeType} from './exp-model';

function hasConnections(node: any, target: string, source: string): boolean {
    return node.id === target || node.id === source;
}

function mapNodesById(nodes: Node[]):  Map<string, Node> {
    const idToNode = new Map<string, Node>();
    for (const node of nodes) {
        idToNode.set(node.id, node);
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

function appendChildNode(nodesMap: Map<string, Node>, node: Node) {
    for (const link of node.links) {
        // As target
        const linkedTarget = nodesMap.get(link.target);
        if (linkedTarget.id !== node.id) { // not self
            if (!isFirstLevel(linkedTarget)) {
                linkedTarget.parent = node;
                node.children.push(linkedTarget);
            }
        }
        // As source
        const linkedSource = nodesMap.get(link.source);
        if (linkedSource.id !== node.id) { // not self
            if (!isFirstLevel(linkedSource)) {
                linkedSource.parent = node;
                node.children.push(linkedSource);
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

function flatten(nestedNodes: Node[]): Node[] {
    return nestedNodes.reduce((acc: Node[], node: Node) => {
        if (!acc.find(n => n.id === node.id)) {
            acc.push(node);
        }
        for (const child of node.children) {
            if (!acc.find(n => n.id === child.id)) {
                acc.push(child);
            }
        }
        return acc;
    }, []);
}

// filter graph by virtual trees
export function filterSecondLevel(nodes: Node[], links: Link[], count: number = 6): { nodes: any, links: any }  {
    const graphData = appendConnections(nodes, links);
    // sort children by something and then split
    const nested = graphData.nodes.filter((node: Node) => node.type === NodeType.first_level);
    for (const node of nested) {
        if ( node.children.length >= count) {
            node.children = [...node.children.slice(0, count)] || [];
        }
    }
    graphData.nodes = flatten(nested).sort((a: Node, b: Node) => b.links.length - a.links.length);
    const nodesMap = mapNodesById(graphData.nodes);

    graphData.links =  links.filter((link: Link) => nodesMap.get(link.source) && nodesMap.get(link.target));
    return graphData;
}
