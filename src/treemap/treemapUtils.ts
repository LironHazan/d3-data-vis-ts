import * as d3 from 'd3';

export class TreemapUtils {
    static getDimensions(selector: string) {
        let container: any = d3.select(selector).node();
        let { width }: DOMRect = container.getBoundingClientRect();
        const margin = { top: 24, right: 20, bottom: 0, left: 0 };
        width = width - margin.right;
        const height = 530; // should make rsponsive
        return { width, height, margin };
    }
}
