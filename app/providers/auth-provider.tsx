import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import axios, { type Axios } from "axios";

import config from "../config";

export interface Tokens {
	access: string;
	refresh?: string;
}

export interface AuthContext {
	client: Axios;
	tokens?: Tokens;
};

const AuthContextInst = createContext<AuthContext>({
	client: axios.create(),
});

export default function AuthProvider(props: React.PropsWithChildren) {
	const navigate = useNavigate();
	const [tokens, setTokens] = useState<Tokens | undefined>();
	const client = useMemo(() => {
		const client = axios.create({
			baseURL: config.api_host,
		});

		client.interceptors.request.use((config) => {
			const token = localStorage.getItem("access_token");
			config.headers["Authorization"] = `Bearer ${token}`;
			return config;
		});

		client.interceptors.response.use(response => response, async error => {
			if (error.response?.status === 401) {
				const refreshToken = localStorage.getItem("refresh_token");
				if (!refreshToken) {
					navigate("/auth/login");
					return;
				}

				try {
					const refreshResponse = await axios.post(`${config.api_host}/auth/refresh`, {
						refresh: refreshToken,
					}, {
						validateStatus: status => status === 200,
					});
					const data = refreshResponse.data;
					localStorage.setItem("access_token", data.access);
					localStorage.setItem("refresh_token", data.refresh);
					setTokens(data);
					return client.request(error.config);
				} catch (e) {
					console.error(e);
					navigate("/auth/login");
				}
			}
			throw error;
		});

		return client;
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			// TODO: better way to do this in an environment-agnostic way
			navigate("/auth/login");
		} else {
			const tokens = {
				access: token,
				refresh: localStorage.getItem("refresh_token") ?? undefined,
			}
			setTokens(tokens);
		}
	}, []);

	return <AuthContextInst.Provider value={{ client, tokens }}>
		{props.children}
	</AuthContextInst.Provider>;
}

export function useAuthContext() {
	return useContext(AuthContextInst);
}
