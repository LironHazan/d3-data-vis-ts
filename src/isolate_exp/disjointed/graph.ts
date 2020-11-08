import * as d3 from 'd3';
import {ExpModel, Link} from './exp-model';
import {transformToGraphModel} from './utils';
import {Breakpoint, Drawer} from './drawer';
import {auditTime} from 'rxjs/operators';
import {filterSecondLevel} from './data.util';
import {DrawerUpdateFormat} from './drawer_update_alt';

function update(data: ExpModel<any, Link>, count = 0) {
    const filtered = filterSecondLevel(data.nodes, data.links, count);
    console.log(filtered.nodes.length);
    return filtered ;
}

export function loadGraph() {
    d3.json('../data/graph.json').then((data: any) => {
        let state: Breakpoint = Breakpoint.sm;
        const filtered = update(transformToGraphModel(data), 10);
        let {svg, mainGroup, simulation } = Drawer.update(null, true, null, null, filtered);

        // const graph = DrawerUpdateFormat.update(null);
        // graph.update(filtered);

        Drawer.notifier$
            .pipe(auditTime(300))
            .subscribe((level) => {
                if (level === Breakpoint.md && state !== Breakpoint.md) {
                    state = Breakpoint.md;
                    // const filtered = update(transformToGraphModel(data), 10);
               //     graph.update(filtered);
                   // svg.remove();
                  //  svg.mainGroup.attr('transform', 'scale(1.3)');

                }
                if (level  === Breakpoint.sm && state !== Breakpoint.sm) {
                    state = Breakpoint.sm;
                    const filtered = update(transformToGraphModel(data), 0);
                     // graph.update(filtered);

                     // svg.svg.remove();
                   // svg = Drawer.update(filtered, state);
                }
            });
    });
}

