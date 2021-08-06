import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

import { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';


import Config from './config.json';
import Dashboard from './Dashboard';
import Data from './Data';
import Metadata from './Metadata';

import { getCookie } from './Helpers';

export default function Contributor(props) {
    const [menuUtamaAktif, setMenuUtamaAktif] = useState('home');
    
    const username = getCookie('CONTRIBUTOR');

    var base = "px-2 py-1 pointer"
    var home = menuUtamaAktif === 'home' ? base + " bg-kuning" : base;
    var data = menuUtamaAktif === 'data' ? base + " bg-kuning" : base;
    var metadata = menuUtamaAktif === 'metadata' ? base + " bg-kuning" : base;
    var logout = menuUtamaAktif === 'logout' ? base + " bg-kuning" : base;

    var konten = <p></p>

    if (menuUtamaAktif === 'home') {
        konten = <Dashboard />
    } else if (menuUtamaAktif === 'data') {
        konten = <Data />
    } else if (menuUtamaAktif === 'metadata') {
        konten = <Metadata />
    }

    return (
        <Row className="main-admin font-11">
            <Col lg={2} className="pt-3 bg-dark">
                <h6 className="text-white ml-2">Dashboard</h6>
                <p className="text-white ml-2">Logged in as <u>{username}</u></p>
                <ListGroup className="ml-2">
                    <ListGroup.Item className={home} onClick={() => setMenuUtamaAktif('home')}>Home</ListGroup.Item>
                    <ListGroup.Item className={data} onClick={() => setMenuUtamaAktif('data')}>Upload Data</ListGroup.Item>
                    <ListGroup.Item className={metadata} onClick={() => setMenuUtamaAktif('metadata')}>Upload Metadata</ListGroup.Item>     
                    <ListGroup.Item className={logout} onClick={() => window.location.href = Config.base_domain + "/#/logout"}>Logout</ListGroup.Item>
                </ListGroup>
            </Col>
            <Col lg={10} className="ml-0 border bg-white font-11 admin-content">
                {
                    konten
                }

            </Col>
        </Row>
    )

}