import { Graphics } from '@pixi/react';
import { FC } from 'react';

interface IProps {
	width: number;
	height: number;
	cellWidth: number;
	cellHeight: number;
}

export const GridLines: FC<IProps> = ({ width, height, cellWidth, cellHeight }) => (
	<Graphics
		draw={(graphics) => {
			graphics.clear();
			graphics.lineStyle(1, 0xffffff, 0.1);

			for (let x = 0; x <= width; x += cellWidth) {
				graphics.moveTo(x, 0);
				graphics.lineTo(x, height);
			}

			for (let y = 0; y <= height; y += cellHeight) {
				graphics.moveTo(0, y);
				graphics.lineTo(width, y);
			}
		}}
	/>
)
