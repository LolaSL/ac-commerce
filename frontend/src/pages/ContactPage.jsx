import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResponseMessage(null);
    setError(null);

    try {
      const response = await axios.post('/api/contact', {
        fullName,
        email,
        subject,
        message,
      });
      setResponseMessage(response.data.message);
      setFullName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setError(error.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="site-container mt-3 pt-3">
    <Helmet>
      <title>Contact</title>
    </Helmet>
    <Container className="pt-4 contact-form">
      <Row className="my-4 d-flex">
        <Col md={6}>
          <h2>Contact Us</h2>
          {responseMessage && <Alert variant="success">{responseMessage}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMessage">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="secondary" type="submit" className="mt-4 mb-4" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </Form>
        </Col>
        <Col md={6} >
          <h2>Our Office</h2>
          <p>1234 Street Name</p>
          <p>City, State, Zip Code</p>
          <p>Email: contact@example.com</p>
          <p>Phone: (123) 456-7890</p>
          </Col>
        </Row>
    </Container></div>
  );
};

export default ContactPage;

