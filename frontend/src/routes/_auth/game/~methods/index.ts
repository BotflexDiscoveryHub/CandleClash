import * as PIXI from "pixi.js";
import { Boost } from '../../rewards/~types';
import { FallingObject } from '../~types/fallingObject.ts';

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

// Функция для нахождения самого мощного буста и вычисления общей статистики
export const calculateBoostStats = (boosts: Boost[], boostType: string) => {
	// const now = new Date();

	// Фильтруем бусты по заданному типу
	const filteredBoosts = boosts.filter((boost) => boost.type === boostType);

	if (!filteredBoosts.length) return;

	// Находим самый мощный буст
	return filteredBoosts.reduce((maxBoost, currentBoost) => {
		return currentBoost.multiplier > maxBoost.multiplier ? currentBoost : maxBoost;
	});
};

export const getNewObject = (): FallingObject => {
	const color = Math.random() > 0.5 ? "green" : "red";
	const speed = 4.5;

	return {
		id: Date.now() * Math.random(),
		x: Math.random() * (window.innerWidth - 20),
		y: Math.random() * 5,
		isHidden: false,
		topHeight: Math.floor(Math.random() * 60), // Случайная высота верхней части
		bottomHeight: Math.floor(Math.random() * 50), // Случайная высота нижней части
		color,
		speed
	}
}
