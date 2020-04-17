import * as d3 from 'd3';

export class TreemapUtils {
    static getDimensions(selector: string) {
        let container: any = d3.select(selector).node();
        let { width, height }: DOMRect = container.getBoundingClientRect();
        const margin = { top: 40, right: 40, bottom: 40, left: 40 };
        width = (width / 1.2) - margin.right - margin.left;
        height = ( height / 1.2) - margin.top - margin.bottom;
        return { width, height, margin };
    }
}
