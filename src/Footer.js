import Button from 'react-bootstrap/Button';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

export default function Footer(props) {

    return (
        <>
        <Navbar expand="sm" className="py-0 ">
            <Nav className="mr-auto">
                <Nav.Link className="d-block footer-custom"> FTA Geoportal version 1.0</Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-5 ml-5 d-none d-sm-block">
                <Nav.Link href="https://www.cifor.org/" target="blank_"><img style={{maxHeight:"30px"}} alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/themes/FTA/assets/images/CIFOR_green_vlr.png"/></Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="http://www.worldagroforestry.org/" target="blank_"> <img alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/themes/FTA/assets/images/agroforestry.png" /></Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="https://www.bioversityinternational.org/" target="blank_"> <img alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/uploads/2021/02/Alliance_logos-ENGLISH.png" width="100px" /></Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="https://www.cirad.fr/en" target="blank_"> <img alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/uploads/2018/11/logo-cirad.png" width="80px" /> </Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="https://www.catie.ac.cr/" target="blank_"> <img alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/themes/FTA/assets/images/catie.png" /> </Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="https://www.inbar.int/" target="blank_"> <img alt="logo" src="https://www.foreststreesagroforestry.org/wp-content/uploads/images/logo-inbar.png" width="50px" /></Nav.Link>
            </Nav>
            <Nav className="mr-auto pl-2 ml-2 d-none d-sm-block">
                <Nav.Link href="https://www.tropenbos.org/" target="blank_"> <img alt="logo" style={{maxHeight:"30px"}} src="https://www.foreststreesagroforestry.org/wp-content/uploads/images/logo/logo-tropenbos-small.png" width="40px" /></Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
                <Button variant="outline-secondary" size="sm" className="py-0 px-1 mr-3 font-11" onClick={() => window.open('https://www.cifor.org/terms-of-use/')}>Terms of Use</Button>
                <Button variant="outline-secondary" size="sm" className="py-0 px-1 mr-3 font-11" onClick={() => window.open('https://www.cifor.org/privacy-policy/')}>Privacy Policy</Button>
              
            </Navbar.Collapse>

        </Navbar>
        </>

    )
}