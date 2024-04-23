import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Import AuthContext
import { Card, Col, Row } from 'react-bootstrap';
import SideBar from '../Components/SideBar';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('contact', data.contact);
      formData.append('othercontact', data.othercontact);
      formData.append('address', data.address);
      formData.append('password', data.password);
      formData.append('picture', data.picture[0]); // Ensure 'picture' matches your input name attribute
      formData.append('role', data.role); // Add selected role to form data
      formData.append('nationality', data.nationality); // Add nationality to form data
      formData.append('emid', data.emid); // Add emid to form data

      // Make POST request to register user
      const response = await axios.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${state.user.token}`, // Include token in request headers
        },
      });

      // Check response status and display appropriate message
      if (response.status === 201) {
        toast.success('Registered Successfully');
        reset(); // Reset the form fields
        navigate('/');
      } else {
        toast.error('Error signing up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Error signing up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Navigate to /login when clicking Cancel
    navigate('/');
  };




  return (
    <>

      <Row>
        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <SideBar />
          </div>
        </Col>

        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
          <Row xs={1} md={2} lg={3}>
            <Col xs={12} sm={12} md={12} lg={10} xl={10} >

              <div className="py-2 px-5" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <Card>
                  <div className="h4 bold text-center text-uppercase" style={{ marginTop: '100px' }}>
                    <h3 style={{ color: '#AE82CE' }}>Add Owner OR User</h3>
                  </div>
                  <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                    <div className="row mt-3">
                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Full name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter name"
                            {...register('name', { required: true })}
                            className='w-100'
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Email address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Enter email"
                            {...register('email', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Contact Number</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Contact Number"
                            {...register('contact', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Other Contact</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Other Contact Number"
                            {...register('othercontact', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Address"
                            {...register('address', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Nationality</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter nationality"
                            {...register('nationality', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6" >
                        <Form.Group className="mb-3">
                          <Form.Label>Emirates ID</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Enter Emirates ID"
                            {...register('emid', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Role</Form.Label>
                          <Form.Select className='py-2' style={{ border: '1px solid #ebedf2' }} {...register('role', { required: true })}>
                            <option value="">Select role</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">Superadmin</option>
                            <option value="owner">Owner</option>
                          </Form.Select>
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6" >
                        <Form.Group className="mb-3">
                          <Form.Label>Password</Form.Label>
                          <Form.Control
                            type="password"
                            placeholder="Password"
                            {...register('password', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6">
                        <Form.Group className="mb-3">
                          <Form.Label>Profile Picture</Form.Label>
                          <Form.Control
                            type="file"
                            accept="image/*"
                            {...register('picture', { required: true })}
                          />
                        </Form.Group>
                      </div>

                      <div className="mb-3 col-md-6" style={{ display: 'flex', gap: '15px' }} >
                        <Button variant="primary" type="submit" disabled={isLoading} style={{ backgroundColor: '#AE82CE', borderColor: '#AE82CE' }}>
                          {isLoading ? (
                            <BeatLoader size={8} color="white" />
                          ) : (
                            'ADD'
                          )}
                        </Button>

                        <Button variant="outline-secondary" type="reset" disabled={isLoading} style={{ borderColor: '#dc3545', color: '#dc3545' }} onClick={handleCancel}>
                          Cancel
                        </Button>
                      </div>

                    </div>
                  </form>
                </Card>
              </div>
              <ToastContainer position="top-right" autoClose={5000} />
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Register;