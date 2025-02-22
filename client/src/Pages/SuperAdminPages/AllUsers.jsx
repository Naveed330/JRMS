import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';

const AllUsers = () => {
  const { state } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({
    userId: '',
    name: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/allusers', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle error, maybe show a toast or message to the user
      }
    };

    fetchUsers();
  }, [state.user.token]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      // Update the users state after successful deletion
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      // Handle error, maybe show a toast or message to the user
    }
  };

  const handleEdit = (user) => {
    setEditData({
      userId: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/edit-user/${editData.userId}`, editData, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      // Update the users state after successful edit
      setUsers(users.map(user => user._id === editData.userId ? { ...user, name: editData.name, email: editData.email, role: editData.role } : user));
      setShowModal(false);
    } catch (error) {
      console.error('Error editing user:', error);
      // Handle error, maybe show a toast or message to the user
    }
  };

  return (
    <div>
      <Row>
        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <SideBar />
          </div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '70px' }} >
          <h1 className='text-center' >All Users</h1>
          <Row xs={1} md={2} lg={3} className="mb-5">
            {users.map(user => (
              <Col key={user._id}>
                <Card style={{ marginTop: '100px', width: '25rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Card.Img variant="top" src={user.picture} alt={user.name} style={{ width: '150px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                  </div>

                  <Card.Body>
                    <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{user.name}</Card.Title>
                    <Card.Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      Email: {user.email}<br />
                      Role: {user.role}<br />
                      Created At: {user.createdAt}
                    </Card.Text>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>

                      <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>{' '}
                      <Button variant="primary" className='btn-gradient-primary' onClick={() => handleEdit(user)}>Edit</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}

          </Row>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} style={{ marginTop: '50px' }}  >

        <Modal.Header closeButton >
          <Modal.Title  >
            <h3 style={{ textAlign: 'center' }}>
              Edit User
            </h3>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className='mb-4' >
          <Form onSubmit={handleSubmit}  >
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={editData.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="email" className='mt-2'>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={editData.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="role" className='mt-2' >
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={editData.role} onChange={handleChange} className='py-3' >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
                <option value="owner">Owner</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className='mt-3 w-100 btn-gradient-primary' >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default AllUsers;
