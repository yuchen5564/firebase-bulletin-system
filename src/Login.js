import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import AuthContext from "./firebase-auth/AuthContext";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { signIn } from './firebase-auth/firebase';
import { useContext } from "react";
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';



function Login() {


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, seterror] = useState("");

  const { user } = useContext(AuthContext);
  if (user) {
    return <Navigate replace to="/post" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");
    const res = await signIn(email, password);
    if (res.error) {
      if (res.error) seterror(res.error);
    }
  };

  

  return (

    <Container fluid className='mt-5'>


      <Row className='justify-content-center'>

        <Col md={4}>
          <div class="d-flex flex-row-reverse">
            <Button href='./Bulletin'>最新消息</Button>
          </div>
          {error ? <Alert variant='danger'>{error}</Alert> : <p></p>}
          <Card>
            <Card.Body>
              <Card.Title className='text-center'><h3>Administrator Sign In</h3></Card.Title>
              <p>　</p>
              <Card.Text>
                <Form onSubmit={handleSubmit}>
                  <FloatingLabel controlId="floatingInput" label="Account" className="mb-3" requird>
                    <Form.Control required type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword" label="Password" requird>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  </FloatingLabel>
                  <hr className="my-4" />
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </Form>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

    </Container>


  );
}

export default Login;