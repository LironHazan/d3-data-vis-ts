import { loadBubble } from './circle-pack/bubbles';
import {loadInteractiveTreemap} from './treemap/treemap-interactive';

const main = async () => {
  await loadBubble();
  await loadInteractiveTreemap();
};

main().then(() => console.log('started'));
