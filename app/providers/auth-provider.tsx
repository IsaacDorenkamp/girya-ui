import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import axios, { type Axios } from "axios";

export interface AuthContext {
	client: Axios;
};

const AuthContextInst = createContext({
	client: axios.create(),
});

export default function AuthProvider(props: React.PropsWithChildren) {
	const client = useMemo(() => {
		const client = axios.create();

		client.interceptors.request.use((config) => {
			// TODO - I don't want to do this right now
		});

		return client;
	}, []);

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.get("access-token");
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
