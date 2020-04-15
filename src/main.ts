import { loadBubble } from './circle-pack/bubbles';
import { loadTreemap } from './treemap/treemap';

const main = async () => {
  await loadBubble();
  await loadTreemap();
};

main().then(() => console.log('started'));
