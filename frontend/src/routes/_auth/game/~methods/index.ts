import * as PIXI from "pixi.js";

export const createGradientTexture = (width: number, height: number) => {
	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext('2d');

	if (ctx) {
		const gradient = ctx.createLinearGradient(0, 0, 0, height);
		gradient.addColorStop(.4, 'rgba(17, 17, 17, 0.4)');
		gradient.addColorStop(1, '#001EBD');

		ctx.fillStyle = gradient;
		ctx.fillRect(0, 0, width, height);

		ctx.fillStyle = 'rgba(100, 100, 100, 0.15)';
		drawBlurCircle(ctx, width * 0.05, height * 0.1, 400);
		drawBlurCircle(ctx, width * 0.95, height * 0.1, 400);
	}

	return PIXI.Texture.from(canvas);
};

const drawBlurCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) => {
	const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
	gradient.addColorStop(0, 'rgba(100, 100, 100, 0.2)');
	gradient.addColorStop(1, 'rgba(100, 100, 100, 0)');

	ctx.fillStyle = gradient;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI * 2);
	ctx.fill();
};
