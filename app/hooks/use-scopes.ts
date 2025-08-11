import { useMemo } from "react";

import { useAuthContext } from "../providers/auth-provider";

export default function useScopes() {
	const { tokens } = useAuthContext();

	const scopes = useMemo(() => {
		if (!tokens?.access) return [];
		const jwtPayload = tokens.access.split(".")[1];
		try {
			const decodedPayload = atob(jwtPayload);
			const data = JSON.parse(decodedPayload);
			return data.scope.split(" ");
		} catch (e) {
			console.error("Could not parse JWT payload: " + jwtPayload);
			return [];
		}
	}, [tokens?.access]);

	return scopes;
}
