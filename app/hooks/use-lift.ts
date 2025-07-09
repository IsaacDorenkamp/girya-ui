import { useQuery } from "@tanstack/react-query";

import type { Lift } from "../types";
import { useAuthContext } from "../providers/auth-provider";
import { createLiftKey } from "../functions/create-query-key";

export default function useLift(slug: string) {
	const { client } = useAuthContext();
	return useQuery({
		queryFn: async () => {
			const response = await client.get<Lift>(`/api/lifts/${slug}`);
			return response.data;
		},
		queryKey: createLiftKey(slug),
	});
}
