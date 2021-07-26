import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { setCookie } from './Helpers';
import logo_cifor from './fta-logo.png';

import Config from './config.json';


export default function Login(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [alert, setAlert] = useState("d-none");
    const url_login =  Config.api_domain + "/auth/login";
    

    function validateForm() {
        return username.length > 0 && password.length > 0;
    }

    function handleSubmit(event) {
        event.preventDefault();

        const postData = async () => {

            //var btn = document.querySelector("#ulangi");
            var msg = document.querySelector("#message");
            setAlert('d-block alert-info');
            //console.log(loader);
            msg.innerHTML = 'please wait..';


            try {
                // Fetch data from REST API

                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        "username": username,
                        "password": password,
                    })
                };

                const response = await fetch(url_login, requestOptions)
                //console.log(response)

                var json = await response.json();
                //console.log(json);
                //console.log(json.status);


                //msg.innerHTML = json.data.status;

                if (response.status === 200) {
                    //console.log(data);

                    if (json.Authorization) {
                        //props.loginAs(json.level);
                        setPassword("");
                        setAlert('d-block alert-success')
                        msg.innerHTML = json.message
                        setCookie('USER_TOKEN', json.Authorization)
                        setCookie('CONTRIBUTOR', username)
                        window.location.reload();
                        //localStorage.setItem( 'token', json.token );  
                        //localStorage.setItem( 'level', json.level );  
                    } else {
                        setAlert('d-block alert-danger')
                        msg.innerHTML = json.message;
                    }
                } else {
                    setAlert('d-block alert-danger')
                    msg.innerHTML = `Error ${response.status} ${response.statusText}`;
                    console.error(`Error ${response.status} ${response.statusText}`);
                }

            } catch (error) {
                setAlert('d-block alert-danger')
                msg.innerHTML = `Error ${error}`;
                console.error(`Error ${error}`);
            }
        };
        postData();
    }


    return (
        
        <Row className="main font-11 pb-5">
                <Col lg={4}></Col>
                <Col lg={4} className="mt-5 px-0 mb-5 bg-white font-11 border">
                    <div className="text-center pb-3 px-2 pt-3">
                        <img src={logo_cifor} alt="logo Cifor" width="180px" />
                    </div>
                    <div className="text-center bg-key p-3 m-0">
                        <h6 className="text-dark font-weight-bold">LOGIN TO FTA GEOPORTAL<br /> AS CONTRIBUTOR</h6>
                    </div>
                    <Form onSubmit={(e)=>handleSubmit(e)} className="p-3">
                        <Form.Group controlId="formBasicUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" className="font-11" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" className="font-11" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Alert id="alert-msg" className={alert}>
                            <span id="message" className="font-11">message</span>
                            <button type="button" className="close" aria-label="Close" onClick={() => setAlert('d-none')}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Alert>
                        <Button variant="success" type="submit" block size="sm" className="font-11 py-0" disabled={!validateForm()}>Login</Button>
                   </Form>

                </Col>
                <Col lg={4}>

                </Col>
            </Row>

    )
}