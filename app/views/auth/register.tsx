import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Row from "react-bootstrap/Row";
import Tooltip from "react-bootstrap/Tooltip";
import { Col } from "react-bootstrap";

import config from "../../config";
import type { RegisterInfo } from "../../types";
import useLogin from "../../hooks/use-login";

export default function Register() {
	const [error, setError] = useState<string | undefined>();
	const [email, setEmail] = useState<string>("");
	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [cfmPassword, setCfmPassword] = useState<string>("");

	const fieldsFilled = (email && firstName && lastName && password);
	const passwordsMatch = password === cfmPassword;
	const valid = fieldsFilled && passwordsMatch;

	const { mutate: login, isPending: loginPending } = useLogin(setError);
	const { mutate: register, isPending: registerPending } = useMutation({
		mutationFn: async (info: RegisterInfo) => {
			const response = await axios.post(`${config.api_host}/auth/users`, info);
			return response.data;
		},
		onSuccess: () => {
			login({ email, password });
		},
		onError: (error) => {
			if (error instanceof AxiosError) {
				const detail = error.response?.data["detail"];
				setError && setError(detail ?? "Could not log in.");
			}
		}
	});

	const busy = loginPending || registerPending;

	const inputError = (
		!fieldsFilled ? "Please fill all fields." :
			(!passwordsMatch ? "Passwords do not match." : undefined)
	);
	const renderDisabledReason = (props: any) => {
		return <Tooltip {...props}>
			{inputError}
		</Tooltip>;
	};

	return <Container className="p-3">
		{error && <Alert dismissible onClose={() => setError(undefined)} variant="danger">
			{error}
		</Alert>}
		<Form>
			<Form.Group as={Row} className="mb-2">
				<Form.Label column xs={3} className="text-end" disabled={busy}>E-mail</Form.Label>
				<Col xs={9}>
					<Form.Control type="email" value={email} onChange={(event) => {
						setEmail(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label column xs={3} className="text-end" disabled={busy}>First Name</Form.Label>
				<Col xs={9}>
					<Form.Control type="text" value={firstName} onChange={(event) => {
						setFirstName(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label column xs={3} className="text-end" disabled={busy}>Last Name</Form.Label>
				<Col xs={9}>
					<Form.Control type="text" value={lastName} onChange={(event) => {
						setLastName(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Form.Group as={Row} className="mb-2">
				<Form.Label column xs={3} className="text-end" disabled={busy}>Password</Form.Label>
				<Col xs={9}>
					<Form.Control type="password" value={password} onChange={(event) => {
						setPassword(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<Form.Group as={Row}>
				<Form.Label column xs={3} className="text-end" disabled={busy}>Confirm Password</Form.Label>
				<Col xs={9}>
					<Form.Control type="password" value={cfmPassword} onChange={(event) => {
						setCfmPassword(event.target.value);
					}} />
				</Col>
			</Form.Group>
			<OverlayTrigger
				placement="left"
				delay={{ show: 250, hide: 400 }}
				overlay={renderDisabledReason}
				show={valid ? false : undefined}
			>
				<Button className="float-end mt-2" onClick={(event) => {
					event.preventDefault();
					if (valid) {
						register({
							email,
							first_name: firstName,
							last_name: lastName,
							password
						});
					} else {
						setError(inputError);
					}
				}}
					disabled={busy}
					>
					{registerPending ? "Registering..." : (loginPending ? "Logging in..." : "Register")}
				</Button>
			</OverlayTrigger>
		</Form>
	</Container>;
}
