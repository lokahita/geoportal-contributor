import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo_fta from './fta-logo.png';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Config from './config.json';

import Slide from 'react-reveal/Slide'

export default function TopMenu(props) {
    return  (
        <>
            <Row className="p-0">
                <Col className="box-logo border-bottom">
                    <Navbar bg="white" className="py-0" >
                        <Navbar.Brand href="#" className="box-logo-fta pt-3">
                            <h3>Forests, Trees and Agroforestry</h3>
                            <h4>Livelihoods, Landscapes and Governance</h4>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                            </Nav>

                            <Nav>
                                <img src={logo_fta} alt="fta logo" width="150px" className="unselectable d-none d-sm-block" title="link to website CGIAR" />
                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
            {
                props.tokenValid?"":
            (
            <Slide delay={1000} duration={2000}>
            <Row className="p-0">
                <Col className="py-0 border-bottom">
                    <Navbar bg="white" expand="sm" className="py-0">
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link href={Config.base_geoportal} className="px-3 mx-2">Geoportal FTA</Nav.Link>
                                <Nav.Link href="#/" className="px-3 mx-2 active">Contributor Page</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>
            </Row>
            </Slide>
            )
            }
        </>
    )
}

