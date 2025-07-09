import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import axios, { type Axios } from "axios";

import config from "../config";

export interface AuthContext {
	client: Axios;
};

const AuthContextInst = createContext({
	client: axios.create(),
});

export default function AuthProvider(props: React.PropsWithChildren) {
	const navigate = useNavigate();
	const client = useMemo(() => {
		const client = axios.create({
			baseURL: config.api_host,
		});

		client.interceptors.request.use((config) => {
			// TODO - I don't want to do this right now
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
					return client.request(error.config);
				} catch (e) {
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
		}
	}, []);

	return <AuthContextInst.Provider value={{ client }}>
		{props.children}
	</AuthContextInst.Provider>;
}

export function useAuthContext() {
	return useContext(AuthContextInst);
}
