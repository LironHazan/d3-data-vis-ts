import { PGraph, PLink, PNode, PType } from './data.type';
export const graph: PGraph = {
    nodes: [
        {
            id: '0',
            type: PType.storyline,
            name: 'Node0',
            badgeICClass: '!',
            icClass: '',
            strokeColor: 'purple',
            bgColor: 'purple',
            children: [],
        },
        {
            id: '1',
            type: PType.storyline,
            name: 'Node1',
            badgeICClass: '!',
            icClass: '',
            strokeColor: 'red',
            bgColor: 'red',
            children: [],
        },
        {
            id: '2',
            type: PType.os,
            name: 'Node2',
            badgeICClass: '!',
            icClass: '',
            strokeColor: 'gray',
            bgColor: 'gray',
            children: [],
        },
        {
            id: '3',
            type: PType.os,
            name: 'Node3',
            badgeICClass: '!',
            icClass: '',
            strokeColor: 'gray',
            bgColor: 'gray',
            children: [],
        }],
    links: [{
        id: '1',
        source: '0',
        target: '1',
        type: PType.storyline
    },
        {
            id: '2',
            source: '1',
            target: '2',
            type: PType.storyline
        },
        {
            id: '3',
            source: '1',
            target: '3',
            type: PType.storyline
        }]
};
