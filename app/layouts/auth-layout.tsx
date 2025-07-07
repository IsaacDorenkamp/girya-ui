import React from "react";
import { Outlet } from "react-router";

import { Container, Row, Col } from "react-bootstrap";


export default function Layout() {
	return <Container style={{
		height: "100%",
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		display: "flex",
		flexDirection: "column",
	}}>
		<Row style={{ flexGrow: "1" }}></Row>
		<Row style={{ flexGrow: "1", width: "100%" }}>
			<Col xs={2}></Col>
			<Col xs={8}>
				<Outlet />
			</Col>
			<Col xs={2}></Col>
		</Row>
		<Row style={{ flexGrow: "1" }}></Row>
	</Container>;
}
