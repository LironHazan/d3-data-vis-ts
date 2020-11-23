import { loadBubble } from './circle-pack/bubbles';
import {loadInteractiveTreemap} from './treemap/treemap-interactive';
import {loadCharts} from './isolate_exp/combine/starting_point';
import {loadGraph} from './isolate_exp/disjointed/graph';
import {loadPGraph} from './isolate_exp/pgraph/p-graph';

const main = async () => {
   // await loadBubble();
  // await loadInteractiveTreemap();
 // await loadRadial();
   // loadCharts();
   // await loadGraph();
   loadPGraph();
};

main().then(() => console.log('started'));
