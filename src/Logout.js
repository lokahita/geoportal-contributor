
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';

import Config from './config.json';
import { getCookie } from './Helpers';

export default function Logout(props) {
    const [token, setToken] = useState(getCookie('USER_TOKEN'));
    const url_logout =  Config.api_domain + "/auth/logout";
    

    useEffect(()=>{
        //console.log(token)
        
        const postData = async () => {
           
            try {
                // Fetch data from REST API

               
                const requestOptions = {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': token 
                    }
                };
                const response = await fetch(url_logout, requestOptions)
                //console.log(response)

                var json = await response.json();
               // console.log(json);
                //console.log(json.status);

                
                //msg.innerHTML = json.data.status;

                if (response.status === 200) {
                    //console.log(data);

                    if (json.status === 'success') {
                        //props.loginAs(json.level);
                        alert(json.message)
                        window.location.href =  Config.base_domain + "/"
                        //localStorage.setItem( 'token', json.token );  
                        //localStorage.setItem( 'level', json.level );  
                    } else {
                        alert(json.message)
                    }
                } else {
                    alert(response.status)
                }

            } catch (error) {
                
                alert(error)
            }

        };
        postData();
    }, []);

    return (
        <Container fluid>
            <Row>
                <Col>
                    Logout ...
                </Col>
            </Row>
        </Container>

    )
}