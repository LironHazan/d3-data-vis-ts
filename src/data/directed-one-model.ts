// Node: either A (physical) | B (virtual)
// Link: either C (direct) | D (virtual) | E (self)
export const DIRECTED_ONE =  {
    nodes: [{
        id: 'n1',
        fill: '#000',
        stroke: '#fff',
        name: 'root',
        type: 'A',
        parentId: '0',
        childrenIds: ['n2', 'n3'],
        expandedChildId: 'n2',
        TypeC_connections: ['n2', 'n3'],
        TypeD_connections: ['n4'],
        TypeE_connections: ['n5'],
    },
        {
            id: 'n2',
            fill: '#000',
            stroke: '#fff',
            name: 'roots child',
            type: 'A',
            parentId: 'n1',
            childrenIds: ['n4', 'n5'],
            expandedChildId: 'n4',
            TypeC_connections: ['n4', 'n5'],
            TypeD_connections: ['n6'],
            TypeE_connections: [],
        }],
    links: [{
       id: 'l1',
        fill: '#000',
        type: 'C',
       sourceId: 'n1',
       targetId: 'n2',
       name: 'L1 direct'
    },
        {
            id: 'l2',
            fill: '#000',
            type: 'E',
            sourceId: 'n2',
            targetId: 'n2',
            name: 'L2 self'
        },
        {
            id: 'l3',
            fill: '#000',
            type: 'E',
            sourceId: 'n2',
            targetId: 'n4',
            name: 'L3 direct'
        }]
};
