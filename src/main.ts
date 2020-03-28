import {loadBubble} from './circle-pack/bubbles';

const main = async() => {
    await loadBubble();
};

main()
    .then(() => console.log('started'));
