import { useQuery } from "@tanstack/react-query";

import { useAuthContext } from "../providers/auth-provider";

export default function useLifts() {
	const { client } = useAuthContext();
	return useQuery({
		queryFn: async () => {
			const response = await client.get("/api/lifts");
			return response.data.lifts;
		},
		queryKey: ["lifts", "all"]
	});
}
