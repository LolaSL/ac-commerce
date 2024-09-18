import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

export default function ServiceProviderDashboard() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const { data } = await axios.get("/api/serviceProvider/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Fetch Messages
  const fetchMessages = async () => {
    try {
      const { data } = await axios.get("/api/serviceProvider/messages", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMessages(data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchProjects();
      await fetchMessages();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <Container className="mt-4">
      <Helmet>
        <title>Service Provider Dashboard</title>
      </Helmet>

      {/* Dashboard Header */}
      <h1 className="fw-bold mb-4">Service Provider Dashboard</h1>

      {/* Loading indicator */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Overview Metrics */}
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center p-3">
                <Card.Body>
                  <Card.Title>Total Projects</Card.Title>
                  <Card.Text className="display-4">{projects.length}</Card.Text>
                  <Button variant="primary" as={Link} to="/serviceprovider/profile/projects">
                    View Projects
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center p-3">
                <Card.Body>
                  <Card.Title>Upcoming Deadlines</Card.Title>
                  <Card.Text className="display-4">
                    {projects.filter((p) => p.status === "In Progress").length}
                  </Card.Text>
                  <Button
                    variant="danger"
                    as={Link}
                    to="/serviceprovider/profile/projects"
                  >
                    View Deadlines
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center p-3">
                <Card.Body>
                  <Card.Title>Total Earnings</Card.Title>
                  <Card.Text className="display-4">$12,300</Card.Text>
                  <Button
                    variant="success"
                    as={Link}
                    to="/serviceprovider/profile/earnings"
                  >
                    View Earnings
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center p-3">
                <Card.Body>
                  <Card.Title>Hours Worked</Card.Title>
                  <Card.Text className="display-4">120 hrs</Card.Text>
                  <Button
                    variant="info"
                    as={Link}
                    to="/serviceprovider/profile/hours"
                  >
                    View Hours
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Active Projects */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Active Projects</Card.Title>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Project Name</th>
                        <th>Client</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, index) => (
                        <tr key={project._id}>
                          <td>{index + 1}</td>
                          <td>{project.name}</td>
                          <td>{project.client}</td>
                          <td>{project.dueDate}</td>
                          <td>
                            <span
                              className={`badge ${
                                project.status === "Completed"
                                  ? "bg-success"
                                  : "bg-warning text-dark"
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td>
                            <Button variant="primary" size="sm">
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Messages Section */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Recent Messages</Card.Title>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Client</th>
                        <th>Message</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {messages.map((message, index) => (
                        <tr key={message._id}>
                          <td>{index + 1}</td>
                          <td>{message.client}</td>
                          <td>{message.text}</td>
                          <td>{new Date(message.date).toLocaleDateString()}</td>
                          <td>
                            <Button variant="primary" size="sm">
                              Reply
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
