import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { setCookie } from './Helpers';
import Config from './config.json';

import ilustrasi from './illustration.jpg';


export default function Dashboard(props) {

    return (
        <Row className="main font-11">
        <Col className="mt-2 px-0 mb-5 small pt-3">
            <div className="text-center pb-3 mt-3">
                <img src={ilustrasi} alt="illustration" className="w-50" />
                <br />
                <h3>We are ready to contribute!</h3>
            </div>
        </Col>
    </Row>

    )
}