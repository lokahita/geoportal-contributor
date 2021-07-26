import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Button from 'react-bootstrap/Button';
import logo_404 from './404.png';
import Config from './config.json';

import Zoom from 'react-reveal/Zoom'

export default function NotFound(props) {
    
    return(
        <Zoom duration={2000}>
        <Row className="main font-11">
        <Col lg={3}></Col>
        <Col lg={6} className="mt-5 px-0 mb-5 small pt-3">
            <div className="text-center pb-3 mt-3">
                <img src={logo_404} alt="logo 404" className="w-100" />
            </div>
            <Button variant="light" className="font-11 py-0" size="sm" type="button" block onClick={()=>window.location.href= Config.base_domain +"/"} >{'<<'} Back to Home</Button>
        </Col>
        <Col lg={3}>

        </Col>
    </Row>
    </Zoom>
    )
}