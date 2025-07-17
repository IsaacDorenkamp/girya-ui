import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuthContext } from "../providers/auth-provider";

export default function useDeleteLift() {
	const { client } = useAuthContext();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ slug }: { slug: string }) => {
			const response = await client.delete(`/api/lifts/${slug}`);
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["lifts", "all"]
			});
		}
	});
}
