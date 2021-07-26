import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

import Zoom from 'react-reveal/Zoom'
import Slide from 'react-reveal/Slide'
import Fade from 'react-reveal/Fade'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import TopMenu from './TopMenu'

import Footer from './Footer'
import Config from './config.json';
import Logout from './Logout.js';
import NotFound from './NotFound.js';
import { HashRouter as Router, Switch, Route } from "react-router-dom";

import { useState, useEffect } from 'react'
import { getCookie } from './Helpers';

import Login from './Login';
import Contributor from './Contributor';

function App() {

  const token = getCookie('USER_TOKEN');
  const [tokenValid, setTokenValid] = useState(false);

  const url_valid = Config.api_domain + "/auth/validUser";
  /*
  useEffect(() => {

    async function connectAPI() {
      const response = await fetch(url_list_api)

      var json = await response.json();

      if (response.status === 200) {
        //console.log(json.data)
        const ele = document.getElementById('ipl-progress-indicator')
        if (ele) {
          // fade out
          ele.classList.add('available')
          setTimeout(() => {
            // remove from DOM
            ele.outerHTML = ''
          }, 1000)
        }
      } else {
        console.log(response.status)
      }
    }

    connectAPI();

  }, [url_list_api]);
  */
  useEffect(() => {
    //console.log(token)

    const postData = async () => {

      try {
        // Fetch data from REST API

        const requestOptions = {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        };
        const response = await fetch(url_valid, requestOptions)
        //console.log(response)

        var json = await response.json();
        // console.log(json);
        //console.log(json.status);

        //msg.innerHTML = json.data.status;

        if (response.status === 200) {
          //console.log(data);

          if (json.status === 'success') {
            //props.loginAs(json.level);
            setTokenValid(true)
            //localStorage.setItem( 'token', json.token );  
            //localStorage.setItem( 'level', json.level );  
          } else {
            setTokenValid(false)
          }
        } else {
          setTokenValid(false)
        }

      } catch (error) {

        console.error(`Error ${error}`);
      }

    };
    const ele = document.getElementById('ipl-progress-indicator')
    if (ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        ele.outerHTML = ''
        postData();
      }, 1000)
    }
  }, [token, url_valid]);

  var login_check = token? tokenValid? <Contributor /> : <Login tokenValid={tokenValid} /> : <Login tokenValid={tokenValid} />

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Container fluid className="bg-white">
            <Fade top delay={1500} duration={1500}>
              <TopMenu tokenValid={tokenValid} />
            </Fade>
           
              <Row className={tokenValid?"main-admin border-bottom" : "main border-bottom"} >
                <Col className="p-0" style={{ overFlowX: "hidden" }}>
                <Zoom delay={1500} duration={1500}>
                  {
                    tokenValid? <Contributor />: login_check
                  }
                  
                </Zoom>
                </Col>
              </Row>
            <Fade delay={1500}>
              <Footer />
            </Fade>

          </Container>
        </Route>
        <Route path="/logout">
            <Logout />
          </Route>
        <Route>
            <NotFound />
          </Route>
      </Switch>
    </Router>
  );
}

export default App;
