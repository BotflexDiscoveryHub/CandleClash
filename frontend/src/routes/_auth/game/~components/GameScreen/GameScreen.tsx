import { Fragment, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { userQueryOptions } from '../../../../../utils/queryOptions.tsx';
import useGameStore from '../../../../../store';
import { useGameAnimation } from '../../~hooks/useGameAnimation.tsx';
import * as PIXI from 'pixi.js';
import { Resource, Texture } from 'pixi.js';
import { GameHeader } from '../GameHeader/GameHeader.tsx';
import { Container, Sprite, Stage, Text } from '@pixi/react';
import { GameOverModal } from '../GameOverModal.tsx';
import { GridLines } from '../GridLines.tsx';
import { createGradientTexture } from '../../~methods';
import { NewLvlModal } from '../NewLvlModal/NewLvlModal.tsx';

import { calculateLevel } from '../../../../../utils/levels.ts';
import { setNewInfo } from '../../../../../components/BottomNavigation/methods';

import botSvg from '../../../../../assets/bot-icon.png';
import styles from './GameScreen.module.scss'

export function GameScreen() {
	const { data: user } = useSuspenseQuery(userQueryOptions());
	const {
		xp,
		isMode,
		isPaused,
		liquidity,
	} = useGameStore();
	const { level, progressPercent } = calculateLevel(user.pointsBalance + xp)!;
	const [gradientTexture, setGradientTexture] = useState<Texture<Resource>>();
	const [isLvlUpModal, setIsLvlUpModal] = useState(false)

	const {
		isModalVisible,
		floatingNumbers,
		playerPositionRef,
		fallingObjectsRef,
		handleMouseMove,
		handleTouchMove
	} = useGameAnimation()

	const platformTexture = PIXI.Texture.from(botSvg);
	const fallingObjectTexture = PIXI.Texture.WHITE;

	useEffect(() => {
		if (isLvlUpModal && isPaused) {
			(async () => {
				await setNewInfo(user);
			})()
		}
	}, [isLvlUpModal, isPaused]);

	useEffect(() => {
		if (level > 1 && progressPercent === 0) {
			setIsLvlUpModal(true)
		}
	}, [level, progressPercent]);

	useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => window.removeEventListener("mousemove", handleMouseMove);
	}, [handleMouseMove]);

	useEffect(() => {
		const texture = createGradientTexture(window.innerWidth, window.innerHeight);

		if (texture) {
			setGradientTexture(texture);
		}
	}, []);

	return (
		<div className={styles.gameScreen}>
			<GameHeader
				totalPoints={user.pointsBalance + xp}
				liquidity={liquidity}
				boosts={user.boosts}
				isMode={isMode}
			/>

			<div
				className={styles.gameScreen__container}
				tabIndex={0}
				onTouchMove={handleTouchMove}
				onTouchMoveCapture={handleTouchMove}
			>
				<Stage
					width={window.innerWidth}
					height={window.innerHeight - 100}
					options={{ backgroundColor: 0x02091C }}
				>
					<Container sortableChildren={true}>
						{gradientTexture && (
							<>
								<Sprite
									texture={gradientTexture}
									x={0}
									y={0}
									width={window.innerWidth}
									height={window.innerHeight}
									anchor={0}
									zIndex={-1}
								/>
							</>
						)}

						<GridLines
							width={window.innerWidth}
							height={window.innerHeight}
							cellWidth={65}
							cellHeight={42}
						/>

						{floatingNumbers.map((num) => (
							<Text
								key={num.id}
								text={num.value > 0 ? `+${num.value}` : `${num.value}`}
								x={num.x}
								y={num.y + num.yOffset}
								anchor={0.5}
								alpha={num.alpha}
								rotation={-0.17}
								style={
									new PIXI.TextStyle({
										fontSize: 24,
										fill: num.value > 0 ? 0x00ff00 : 0xff0000,
										fontWeight: 'normal',
										dropShadow: true,
										dropShadowColor: num.value > 0 ? 0x00ff00 : 0xff0000,
										dropShadowBlur: 20,
										dropShadowDistance: 0,
										padding: 5,
									})
								}
							/>
						))}

						<Sprite
							texture={platformTexture}
							x={playerPositionRef.current.x}
							y={playerPositionRef.current.y! - 25}
							anchor={0.5}
							width={65}
							height={67}
							zIndex={5}
						/>

						{fallingObjectsRef.current.map((obj) => {
							const bodyHeight = 100 - (obj.topHeight + obj.bottomHeight);

							return (
								<Fragment key={obj.id + bodyHeight}>
									<Sprite
										key={obj.id + "_top"}
										texture={fallingObjectTexture}
										x={obj.x + 5}
										y={obj.y - obj.topHeight}
										width={6}
										height={obj.topHeight}
										tint={obj.color === "green" ? 0x00ff00 : 0xff0000}
										zIndex={1}
										visible={!obj.isHidden}
									/>

									<Sprite
										key={obj.id + "_body"}
										texture={fallingObjectTexture}
										x={obj.x}
										y={obj.y}
										width={16}
										height={bodyHeight}
										tint={obj.color === "green" ? 0x00ff00 : 0xff0000}
										zIndex={1}
										visible={!obj.isHidden}
									/>

									<Sprite
										key={obj.id + "_bottom"}
										texture={fallingObjectTexture}
										x={obj.x + 5}
										y={obj.y + bodyHeight}
										width={6}
										height={obj.bottomHeight}
										tint={obj.color === "green" ? 0x00ff00 : 0xff0000}
										zIndex={1}
										visible={!obj.isHidden}
									/>
								</Fragment>
							);
						})}
					</Container>
				</Stage>
			</div>

			{isLvlUpModal && (
				<NewLvlModal
					user={user}
					setModal={setIsLvlUpModal}
				/>
			)}

			{isModalVisible && (
				<GameOverModal user={user} />
			)}
		</div>
	);
}
