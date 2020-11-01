import * as d3 from 'd3';
import {ExpModel, Link} from './exp-model';
import {transformToGraphModel} from './utils';
import {filterSecondLevel} from './data.util';
import {Breakpoint, Drawer} from './drawer';
import {auditTime} from 'rxjs/operators';

function update(data: ExpModel<any, Link>, count = 0) {
    const filtered = filterSecondLevel(data.nodes, data.links, count);
    console.log(filtered.nodes.length);
    return filtered ;
}

export function loadGraph() {
    d3.json('../data/graph.json').then(data => {
        let state: Breakpoint = Breakpoint.sm;
        const filtered = update(transformToGraphModel(data), 0);
        const graph = Drawer.drawGraph(filtered);

        Drawer.notifier$
            .pipe(auditTime(300))
            .subscribe((level) => {
                if (level === Breakpoint.md && state !== Breakpoint.md) {
                    state = Breakpoint.md;
                    const filtered = update(transformToGraphModel(data), 10);
                    Drawer.drawGraph(filtered, state);
                }
                if (level  === Breakpoint.sm && state !== Breakpoint.sm) {
                    state = Breakpoint.sm;
                    const filtered = update(transformToGraphModel(data), 0);
                    Drawer.drawGraph(filtered, state);
                }
            });

        //     Drawer.notifier$
        //         .pipe(auditTime(300))
        //         .subscribe((_) => {
        //             const filtered = update(transformToGraphModel(data), 10);
        //             console.log('re draw');
        //             Drawer.drawGraph(filtered);
        //
        //             // if (_ === 'm') {
        //             //     const filtered = update(transformToGraphModel(data), 10);
        //             //     console.log('re draw');
        //             //     Drawer.drawGraph(filtered);
        //             // }
        //             // if (_ === 's') {
        //             //     const filtered = update(transformToGraphModel(data), 0);
        //             //     console.log('re draw');
        //             //     Drawer.drawGraph(filtered);
        //             // }
        // });
    });
}

