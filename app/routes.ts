import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),

	route("/lifts", "routes/lifts.tsx"),

	layout("./layouts/auth-layout.tsx", [
		route("/auth/login", "routes/login.tsx"),
		route("/auth/register", "routes/register.tsx"),
	]),
] satisfies RouteConfig;
