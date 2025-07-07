import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";

import type { Credentials } from "../types";
import config from "../config";

export default function useLogin(setError?: (error: string) => void) {
	const navigate = useNavigate();
	return useMutation({
		mutationFn: async (credentials: Credentials) => {
			const response = await axios.post(`${config.api_host}/auth/login`, credentials);
			return response.data;
		},
		onSuccess: (tokens) => {
			console.log("LOGGED IN!");
			localStorage.setItem("access_token", tokens.access);
			localStorage.setItem("refresh_token", tokens.refresh);
			navigate("/dashboard");
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				const detail = error.response?.data["detail"];
				setError && setError(detail ?? "Could not log in.");
			}
		}
	});
}
