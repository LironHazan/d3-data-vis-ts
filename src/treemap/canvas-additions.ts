

const rect = function(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    ctx.strokeRect(x, y, width, height);
};

function glowingRect(ctx: CanvasRenderingContext2D,
                     x: number,
                     y: number,
                     width: number,
                     height: number,
                     lineWidth: number,
                     [r, g, b]: [number, number, number]) {
    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',0.2)';
    ctx.lineWidth = lineWidth;
    rect(ctx, x, y, width, height);
}

export const purpleNeonRect = function(ctx: CanvasRenderingContext2D,
                                       x: number, y: number, width: number, height: number) {
    const [r, g, b] = [138, 43, 226];
    ctx.shadowColor = 'rgb(' + r + ',' + g + ',' + b + ')';
    ctx.shadowBlur = 5;

    glowingRect(ctx, x, y, width, height, 5, [r, g, b]);
    glowingRect(ctx, x, y, width, height, 4.5, [r, g, b]);
    glowingRect(ctx, x, y, width, height, 1.5, [255, 255, 255]);
};
