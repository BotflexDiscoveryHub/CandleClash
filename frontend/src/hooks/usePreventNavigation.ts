import { useRouter } from "@tanstack/react-router";
import { useEffect } from 'react';

export const usePreventNavigation = (isLoading: boolean) => {
	const router = useRouter();

	useEffect(() => {
		console.log(isLoading)
		router.history.block(() => {
			return !isLoading;
		});
	}, [isLoading]);
};
