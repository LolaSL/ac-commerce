import React, { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import axios from 'axios';

const HoursPage = () => {
  const [hours, setHours] = useState([]);

  useEffect(() => {
    const fetchHours = async () => {
      try {
        const { data } = await axios.get('/api/serviceProvider/hours', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setHours(data);
      } catch (error) {
        console.error('Error fetching hours:', error);
      }
    };

    fetchHours();
  }, []);

  return (
    <Container>
      <h1>Hours Worked</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Hours Worked</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour._id}>
              <td>{hour._id}</td>
              <td>{hour.projectName}</td>
              <td>{hour.hoursWorked}</td>
              <td>{hour.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default HoursPage;
