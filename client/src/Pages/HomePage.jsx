import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Card } from 'react-bootstrap';

const HomePage = () => {
  const { state } = useContext(AuthContext);

  return (
    <div className="container m-5">
      <h1 className='text-primary'> Welcome to Home Page </h1>
      <Card>
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
  );
};

export default HomePage;
