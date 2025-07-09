import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import { Col } from "react-bootstrap";

import AuthProvider from "../providers/auth-provider";

export default function Layout() {
	const location = useLocation();
	const navigate = useNavigate();

	const navKey = useMemo(() => {
		return location.pathname.substring(1);
	}, [location]);

	return <AuthProvider>
		<Container className="mx-0 my-3">
			<Row>
				<Col xs={3}>
					<Tab.Container activeKey={navKey} onSelect={(key) => navigate(`/${key}`)}>
						<Nav variant="pills" className="flex-column">
							<Nav.Item>
								<Nav.Link eventKey="dashboard">Dashboard</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="lifts">Lifts</Nav.Link>
							</Nav.Item>
							<Nav.Item>
								<Nav.Link eventKey="splits">Splits</Nav.Link>
							</Nav.Item>
						</Nav>
					</Tab.Container>
				</Col>
				<Col xs={9}>
					<Outlet />
				</Col>
			</Row>
		</Container>
	</AuthProvider>;
}
