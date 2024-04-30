import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Card, Container, Row, Col, Button, Modal, Form, Table } from 'react-bootstrap';
import { BsGrid } from "react-icons/bs";
import { RxTable } from "react-icons/rx";
import { AiOutlineDelete } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import AdminSideBar from '../../Components/AdminSideBar';

const AllUsersofAdmin = () => {
  const { state } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState('table');
  const [editData, setEditData] = useState({
    userId: '',
    name: '',
    email: '',
    role: ''
  });

  // Check if there are any admin users
  const isAdminPresent = users.some(user => user.role === 'admin');
  const Owner = users.some(user => user.role === 'owner')

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users/allusersforadmin', {
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

  // const handleDelete = async (userId) => {
  //   try {
  //     await axios.delete(`/api/users/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${state.user.token}`
  //       }
  //     });
  //     // Update the users state after successful deletion
  //     setUsers(users.filter(user => user._id !== userId));
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  // const handleEdit = (user) => {
  //   setEditData({
  //     userId: user._id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role
  //   });
  //   setShowModal(true);
  // };

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
    <>
      <Row>

        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <AdminSideBar />
          </div>
        </Col>

        <Col xs={12} sm={12} md={12} lg={10} xl={10}>

          <div style={{ marginTop: '100px', display: 'flex', justifyContent: 'space-around' }} >
            <h3>All Users</h3>
            <div style={{ display: 'flex', gap: '10px' }} >
              <Button onClick={() => setView('grid')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} > <BsGrid style={{ fontSize: '15px', cursor: 'pointer' }} /> Grid View</Button>
              <Button onClick={() => setView('table')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} >  <RxTable style={{ fontSize: '15px', cursor: 'pointer' }} /> Table View</Button>
            </div>
          </div>
          {
            view === 'grid' ?
              <>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '70px', backgroundColor: '' }}>
                    <h1 className='text-center' >Office Staff</h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%', flexWrap: 'wrap' }} >

                      {/* Office Staff  */}
                      {isAdminPresent ? (
                        users.map(user => (
                          user.role === 'admin' ? (
                            <>
                              <Card key={user._id} style={{ width: '20rem', height: '20rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <Card.Img variant="top" src={user.picture} alt={user.name} style={{ width: '150px', height: '120px' }} />
                                </div>

                                <Card.Body>
                                  <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{user.name}</Card.Title>
                                  <Card.Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    Email: {user.email}<br />
                                    Role: {user.role}<br />
                                  </Card.Text>
                                  {/*  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                              <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>{' '}
                                    <Button variant="primary" className='btn-gradient-primary' onClick={() => handleEdit(user)}>Edit</Button>    
                                  </div>*/}
                                </Card.Body>
                              </Card>
                            </>
                          ) : null
                        ))
                      ) : (
                        <p style={{ color: 'red' }} >No Staff Available</p>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Owner */}
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: '20px' }}>
                    <h1 className='text-center' >Owners</h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%', flexWrap: 'wrap' }} >

                      {/* Owner Name*/}
                      {Owner ? (
                        users.map(user => (
                          user.role === 'owner' ? (
                            <>
                              <Card className='mt-3 mb-5' key={user._id} style={{ width: '20rem', height: '20rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                  <Card.Img variant="top" src={user.picture} alt={user.name} style={{ width: '150px', height: '120px' }} />
                                </div>

                                <Card.Body>
                                  <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{user.name && user.name}</Card.Title>
                                  <Card.Text style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    Email: {user.email && user.email}<br />
                                    Contact: {user.contact && user.contact}<br />
                                    Address: {user.address && user.address}<br />
                                    Role: {user.role && user.role}<br />
                                    {/* Created At: {user.createdAt} */}
                                  </Card.Text>
                                  {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                    <Button variant="danger" onClick={() => handleDelete(user._id)}>Delete</Button>{' '}
                                    <Button variant="primary" className='btn-gradient-primary' onClick={() => handleEdit(user)}>Edit</Button>
                                  </div> */}
                                </Card.Body>
                              </Card>
                            </>
                          ) : null
                        ))
                      ) : (
                        null
                      )}
                    </div>
                  </Col>
                </Row>
              </>
              :
              <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-3' >
                  <Card.Body>
                    <Card.Title>Office Staff</Card.Title>
                    <Table striped bordered hover responsive size="sm">
                      <thead style={{ backgroundColor: '#005f75' }} >
                        <tr   style={{ color: '#ffff' }}>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Image</th>
                          {/* <th className='text-center' >Actions</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {
                          isAdminPresent ? (
                            users.map((tblUsers) => {
                              const tableAdmin = tblUsers.role === "admin"
                              return (
                                <>
                                  {
                                    tableAdmin && <tr>
                                      <td> {tblUsers.name && tblUsers.name} </td>
                                      <td>  {tblUsers.email && tblUsers.email} </td>
                                      <td>{tblUsers.role && tblUsers.role}</td>
                                      <td>
                                        <img style={{ width: '40px' }} src={tblUsers.picture && tblUsers.picture} alt={`${tblUsers.name} Image is Found`} />
                                      </td>
                                      {/* <td>
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                          <AiOutlineDelete style={{ cursor: 'pointer', fontSize: '20px', color: '#e03c3e' }} onClick={() => handleDelete(tblUsers._id)} />
                                          <FiEdit style={{ cursor: 'pointer', fontSize: '20px', color: '#008f00' }} onClick={() => handleEdit(tblUsers)} />
                                        </div>
                                      </td> */}
                                    </tr>
                                  }
                                </>
                              )
                            })
                          ) : <p style={{ color: 'red' }} >No Staff Available</p>
                        }
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>


                <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-3 mb-5' >
                  <Card.Body>
                    <Card.Title>Owners</Card.Title>
                    <Table striped bordered hover responsive size="sm">
                      <thead style={{ backgroundColor: '#005f75' }} >
                        <tr  style={{ color: '#ffff' }}>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Address</th>
                          <th>Role</th>
                          <th>Image</th>
                          {/* <th className='text-center' >Actions</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {Owner ? (
                          users.map(user => (
                            user.role === 'owner' ? (
                              <>
                                <tr>
                                  <td> {user.name && user.name} </td>
                                  <td>  {user.email && user.email} </td>
                                  <td>  {user.contact && user.contact} </td>
                                  <td>  {user.address && user.address} </td>
                                  <td>{user.role && user.role}</td>
                                  <td>
                                    <img style={{ width: '40px' }} src={user.picture && user.picture} alt={`${user.name} Image is Found`} />
                                  </td>
                                  {/* <td>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                                      <AiOutlineDelete style={{ cursor: 'pointer', fontSize: '20px', color: '#e03c3e' }} onClick={() => handleDelete(user._id)} />
                                      <FiEdit style={{ cursor: 'pointer', fontSize: '20px', color: '#008f00' }} onClick={() => handleEdit(user)} />
                                    </div>
                                  </td> */}
                                </tr>
                              </>
                            ) : null
                          ))
                        ) : (
                          null
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>


          }
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

    </>
  );
};

export default AllUsersofAdmin;