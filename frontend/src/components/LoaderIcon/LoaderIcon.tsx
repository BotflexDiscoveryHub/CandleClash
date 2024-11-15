import styles from './LoaderIcon.module.scss';

export const LoaderIcon = () => {
	return (
		<div className={styles.loaderIcon}>
			<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
				<defs>
					<linearGradient id="gradient" gradientTransform="rotate(90)">
						<stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
						<stop offset="10%" stopColor="#FFFFFF" stopOpacity="0.1" />
						<stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.2" />
						<stop offset="30%" stopColor="#FFFFFF" stopOpacity="0.3" />
						<stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.4" />
						<stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.5" />
						<stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.6" />
						<stop offset="80%" stopColor="#FFFFFF" stopOpacity="0.8" />
						<stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
					</linearGradient>
				</defs>

				<circle cx="15" cy="15" r="13" fill="none" stroke="url(#gradient)" strokeWidth="2.5"
				        strokeDasharray="20 40" strokeDashoffset="0" strokeLinecap="round">
					<animateTransform attributeName="transform" type="rotate" from="0 15 15" to="360 15 15"
					                  dur="1.5s" repeatCount="indefinite" />
				</circle>
			</svg>
		</div>
	);
};


// <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
// 	<radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
// 		<stop offset="0" stop-color="#FF156D"></stop>
// 		<stop offset=".3" stop-color="#FF156D" stop-opacity=".9"></stop>
// 		<stop offset=".6" stop-color="#FF156D" stop-opacity=".6"></stop>
// 		<stop offset=".8" stop-color="#FF156D" stop-opacity=".3"></stop>
// 		<stop offset="1" stop-color="#FF156D" stop-opacity="0"></stop>
// 	</radialGradient>
// 	<circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round"
// 	        stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70">
// 		<animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1"
// 		                  keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
// 	</circle>
// 	<circle transform-origin="center" fill="none" opacity=".2" stroke="#FF156D" stroke-width="15" stroke-linecap="round"
// 	        cx="100" cy="100" r="70"></circle>
// </svg>
