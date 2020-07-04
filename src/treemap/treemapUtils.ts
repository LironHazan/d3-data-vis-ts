import * as d3 from 'd3';
import {ScaleLinear} from 'd3';

type PrimaryRectBounding =  {
    width: number;
    height: number;
    margin: { top: number, right: number, bottom: number, left: number };
    x: ScaleLinear<number, number>;
    y: ScaleLinear<number, number>;
};

export interface Positions {
    x: ScaleLinear<number, number>;
    y: ScaleLinear<number, number>;
}

export class TreemapUtils {
    static getDimensions(selector: string) {
        let container: any = d3.select(selector).node();
        let { width }: DOMRect = container.getBoundingClientRect();
        const margin = { top: 24, right: 24, bottom: 0, left: 0 };
        width = width - margin.right;
        const height = 530; // should make rsponsive
        return { width, height, margin };
    }

    static getRectBounding(): PrimaryRectBounding {
        const { width, height, margin } = TreemapUtils.getDimensions('body');

        const x = d3.scaleLinear()
            .domain([0, width])
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, height - margin.top - margin.bottom])
            .range([0, height - margin.top - margin.bottom]);
        return { width, height, margin, x, y };
    }
}
