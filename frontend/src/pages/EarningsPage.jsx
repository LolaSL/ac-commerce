import React, { useEffect, useState } from 'react';
import { Container, Table} from 'react-bootstrap';
import axios from 'axios';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await axios.get('/api/serviceProvider/projects', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Container>
      <h1>Projects</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Client</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project._id}</td>
              <td>{project.name}</td>
              <td>{project.client}</td>
              <td>{project.dueDate}</td>
              <td>{project.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ProjectsPage;
