export const CoinIcon = () => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style={{ borderRadius: '50%' }} viewBox="0 0 40 40" fill="none">
			<g filter="url(#filter0_dii_138_5038)">
				<circle cx="20" cy="20" r="18" fill="#FFDD2A" />
			</g>
			<g filter="url(#filter1_i_138_5038)">
				<circle cx="20" cy="20" r="15" stroke="black" strokeOpacity="0.1" strokeWidth="4" />
			</g>
			<defs>
				<filter id="filter0_dii_138_5038" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="8.45" />
					<feComposite in2="hardAlpha" operator="out" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.866667 0 0 0 0 0.164706 0 0 0 0.3 0" />
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_138_5038" />
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_138_5038" result="shape" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="2.9" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
					<feBlend mode="normal" in2="shape" result="effect2_innerShadow_138_5038" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dx="-2" dy="-2" />
					<feGaussianBlur stdDeviation="1.95" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0" />
					<feBlend mode="normal" in2="effect2_innerShadow_138_5038" result="effect3_innerShadow_138_5038" />
				</filter>
				<filter id="filter1_i_138_5038" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
					<feFlood floodOpacity="0" result="BackgroundImageFix" />
					<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
					<feOffset dy="4" />
					<feGaussianBlur stdDeviation="2.9" />
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
					<feBlend mode="normal" in2="shape" result="effect1_innerShadow_138_5038" />
				</filter>
			</defs>
		</svg>
	);
};
