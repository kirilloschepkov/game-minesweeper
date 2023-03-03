import { el } from '../libs/redom.es.min.js';

export default (src) => {
    document.head.append(
        el('link', {
            href: src,
            rel: 'stylesheet',
        })
    );
}