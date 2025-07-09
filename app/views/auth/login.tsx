import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";

import useLogin from "../../hooks/use-login";

export default function Login() {
	const [error, setError] = useState<string | undefined>();
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("access_token");
		const payload = token?.split(".")[1];
		if (!payload) return;

		let data;
		try {
			const jsonSource = atob(payload);
			data = JSON.parse(jsonSource);
		} catch (_) {
			// we can ignore an invalid token, that is OK
			return;
		}

		const exp = data["exp"];
		const seconds = Date.now() / 1000;
		if (seconds < exp) {
			navigate("/dashboard");
		}
	}, []);

	const { mutate: login, isPending: loginPending } = useLogin(setError);
	
	return <Container className="p-3">
		{error && <Alert dismissible onClose={() => setError(undefined)} variant="danger">
			{error}
		</Alert>}
		<Form>
			<Form.Group as={Row} className="mb-2">
				<Form.Label column xs={2} className="text-end">E-mail</Form.Label>
				<Col xs={10}>
					<Form.Control type="email" value={email} onChange={(event) => {
						setEmail(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Form.Group as={Row}>
				<Form.Label column xs={2} className="text-end">Password</Form.Label>
				<Col xs={10}>
					<Form.Control type="password" value={password} onChange={(event) => {
						setPassword(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Button className="float-end mt-2" onClick={(event) => {
				event.preventDefault();
				login({ email, password });
			}}
				disabled={loginPending}>{loginPending ? "Logging In..." : "Log In"}</Button>
		</Form>
	</Container>;
}
