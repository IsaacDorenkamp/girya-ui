import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("./layouts/auth-layout.tsx", [
		index("routes/home.tsx"),
		route("/auth/login", "routes/login.tsx"),
		route("/auth/register", "routes/register.tsx"),
	]),

	layout("./layouts/app-layout.tsx", [
		route("/splits", "routes/splits.tsx"),
		route("/lifts", "routes/lifts.tsx"),
		route("/dashboard", "routes/dashboard.tsx"),
		route("/workouts", "routes/workouts.tsx"),
	]),
] satisfies RouteConfig;
