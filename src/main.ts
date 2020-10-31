import { loadBubble } from './circle-pack/bubbles';
import {loadInteractiveTreemap} from './treemap/treemap-interactive';
import {loadCharts} from './isolate_exp/combine/starting_point';
import {loadGraph} from './isolate_exp/disjointed/graph';

const main = async () => {
   // await loadBubble();
  // await loadInteractiveTreemap();
 // await loadRadial();
   // loadCharts();
   await loadGraph();
};

main().then(() => console.log('started'));
