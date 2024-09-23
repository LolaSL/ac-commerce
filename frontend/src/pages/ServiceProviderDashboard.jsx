import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";

export default function ServiceProviderDashboard() {
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [projectsRes, messagesRes, earningsRes, hoursRes] =
        await Promise.all([
          axios.get("/api/dashboard/projects", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/api/dashboard/messages", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/api/service-providers/earnings", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get("/api/service-providers/hours-worked", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

      // Set the state with fetched data
      setProjects(projectsRes.data || []);
      setMessages(messagesRes.data || []);
      setEarnings(
        (earningsRes.data || []).reduce(
          (total, earning) => total + earning.amount,
          0
        )
      );
      setTotalHours(hoursRes.data?.totalHours || 0);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Container className="mt-4">
      <Helmet>
        <title>Service Provider Dashboard</title>
      </Helmet>

      <h1 className="fw-bold mb-4">Service Provider Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={3}>
              <Card className="text-center p-3">
                <Card.Body>
                  <Card.Title>Total Projects</Card.Title>
                  <Card.Text className="display-4">
                    {projects.length || 0}
                  </Card.Text>
                  <Button
                    variant="primary"
                    as={Link}
                    to="/serviceprovider/profile/projects"
                  >
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
                    {projects.filter((p) => p.status === "In Progress")
                      .length || 0}
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
                  <Card.Text className="display-4">{earnings || 0}</Card.Text>
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
                  <Card.Text className="display-4">{totalHours || 0}</Card.Text>
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

          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Active Projects</Card.Title>
                  {projects.length > 0 ? (
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
                            <td>
                              {new Date(project.dueDate).toLocaleDateString()}
                            </td>
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
                  ) : (
                    <p>No active projects found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>Recent Messages</Card.Title>
                  {messages.length > 0 ? (
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
                            <td>
                              {new Date(message.date).toLocaleDateString()}
                            </td>
                            <td>
                              <Button variant="primary" size="sm">
                                Reply
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p>No recent messages found.</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}

// import React, { useState, useEffect } from "react";
// import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet-async";
// import axios from "axios";

// export default function ServiceProviderDashboard() {
//   const [projects, setProjects] = useState([]);
//   const [messages, setMessages] = useState([]);
//   const [totalHours, setTotalHours] = useState(0);
//   const [earnings, setEarnings] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Fetch data from the API
//   const fetchData = async () => {
//     try {
//       const [projectsRes, messagesRes, earningsRes, hoursRes] =
//         await Promise.all([
//           axios.get("/api/dashboard/projects", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//           axios.get("/api/dashboard/messages", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//           axios.get("/api/service-providers/earnings", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//           axios.get("/api/service-providers/hours-worked", {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }),
//         ]);

//       setProjects(projectsRes.data);
//       setMessages(messagesRes.data);
//       setEarnings(
//         earningsRes.data.reduce((total, earning) => total + earning.amount, 0)
//       );
//       setTotalHours(hoursRes.data.totalHours);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch data on component mount
//   useEffect(() => {
//     fetchData();
//   }, []);

//   return (
//     <Container className="mt-4">
//       <Helmet>
//         <title>Service Provider Dashboard</title>
//       </Helmet>

//       <h1 className="fw-bold mb-4">Service Provider Dashboard</h1>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <Row className="mb-4">
//             <Col md={3}>
//               <Card className="text-center p-3">
//                 <Card.Body>
//                   <Card.Title>Total Projects</Card.Title>
//                   <Card.Text className="display-4">{projects.length}</Card.Text>
//                   <Button
//                     variant="primary"
//                     as={Link}
//                     to="/serviceprovider/profile/projects"
//                   >
//                     View Projects
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3}>
//               <Card className="text-center p-3">
//                 <Card.Body>
//                   <Card.Title>Upcoming Deadlines</Card.Title>
//                   <Card.Text className="display-4">
//                     {projects.filter((p) => p.status === "In Progress").length}
//                   </Card.Text>
//                   <Button
//                     variant="danger"
//                     as={Link}
//                     to="/serviceprovider/profile/projects"
//                   >
//                     View Deadlines
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3}>
//               <Card className="text-center p-3">
//                 <Card.Body>
//                   <Card.Title>Total Earnings</Card.Title>
//                   <Card.Text className="display-4">{earnings}</Card.Text>
//                   <Button
//                     variant="success"
//                     as={Link}
//                     to="/serviceprovider/profile/earnings"
//                   >
//                     View Earnings
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col md={3}>
//               <Card className="text-center p-3">
//                 <Card.Body>
//                   <Card.Title>Hours Worked</Card.Title>
//                   <Card.Text className="display-4">{totalHours || 0}</Card.Text>
//                   <Button
//                     variant="info"
//                     as={Link}
//                     to="/serviceprovider/profile/hours"
//                   >
//                     View Hours
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="mb-4">
//             <Col md={12}>
//               <Card>
//                 <Card.Body>
//                   <Card.Title>Active Projects</Card.Title>
//                   <Table striped bordered hover>
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Project Name</th>
//                         <th>Client</th>
//                         <th>Due Date</th>
//                         <th>Status</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {projects.map((project, index) => (
//                         <tr key={project._id}>
//                           <td>{index + 1}</td>
//                           <td>{project.name}</td>
//                           <td>{project.client}</td>
//                           <td>
//                             {new Date(project.dueDate).toLocaleDateString()}
//                           </td>
//                           <td>
//                             <span
//                               className={`badge ${
//                                 project.status === "Completed"
//                                   ? "bg-success"
//                                   : "bg-warning text-dark"
//                               }`}
//                             >
//                               {project.status}
//                             </span>
//                           </td>
//                           <td>
//                             <Button variant="primary" size="sm">
//                               View
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>

//           <Row className="mb-4">
//             <Col md={12}>
//               <Card>
//                 <Card.Body>
//                   <Card.Title>Recent Messages</Card.Title>
//                   <Table striped bordered hover>
//                     <thead>
//                       <tr>
//                         <th>#</th>
//                         <th>Client</th>
//                         <th>Message</th>
//                         <th>Date</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {messages.map((message, index) => (
//                         <tr key={message._id}>
//                           <td>{index + 1}</td>
//                           <td>{message.client}</td>
//                           <td>{message.text}</td>
//                           <td>{new Date(message.date).toLocaleDateString()}</td>
//                           <td>
//                             <Button variant="primary" size="sm">
//                               Reply
//                             </Button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </>
//       )}
//     </Container>
//   );
// }
