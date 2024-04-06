import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { state, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  

  return (
    <div>
      <h1 className='text-primary'> Welcome to Admin Dashboard  </h1>
      <Button variant="primary" onClick={handleLogout}>Logout</Button> <br /> <br />
      <Link variant="primary mt-3"  to ="/addpropertybyadmin" >Add New Property</Link> <br /> <br />
      <Link variant="primary mt-3"  to ="/allpropertiesforadmin" >All Properties</Link>
      <Card className='m-5'>
        <Card.Body>
          <Card.Title>Welcome, {state.user.name}</Card.Title>
          <Card.Text>Your Role is {state.user.role}</Card.Text>
          <Card.Img
            variant="top"
            src={state.user.picture}
            alt={state.user.name}
            style={{ height: '300px', width: '300px' }} // Set height and width here
          />
         
        </Card.Body>
      </Card>
    </div>
  )
}

export default AdminDashboard;
