import { loadBubble } from './circle-pack/bubbles';
import {loadZoomable} from './treemap/treemap-interactive';

const main = async () => {
  await loadBubble();
  await loadZoomable();
};

main().then(() => console.log('started'));
