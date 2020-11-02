import {Node} from './exp-model';

export enum MapType {
   'index',
    'id'
}
export class MapperFactory {
    readonly nodesByIndex: Map<number, Node> = new Map<number, Node>();
    readonly nodesById: Map<string, Node> = new Map<string, Node>();

    static getInstance(type: MapType, nodes: Node[]): MapperFactory {
        const mapInstance = new MapperFactory();
        switch (type) {
            case MapType.id:
                for (const node of nodes) {
                    mapInstance.setNodeById(node.id, node);
                }
                return mapInstance;
            case MapType.index:
                for (const node of nodes) {
                    mapInstance.setNodeByIndex(node.index, node);
                }
                return mapInstance;
        }
    }

    setNodeByIndex(index: number, node: Node)  {
        this.nodesByIndex.set(index,  node);
    }

    getNodeByIndex(index: number): Node  {
        return this.nodesByIndex.get(index);
    }

    setNodeById(id: string, node: Node)  {
        this.nodesById.set(id,  node);
    }

    getNodeById(id: string): Node  {
        return this.nodesById.get(id);
    }

}
