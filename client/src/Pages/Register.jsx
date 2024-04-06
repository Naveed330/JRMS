import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { BeatLoader } from 'react-spinners';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from './AuthContext'; // Import AuthContext
import SideBar from '../Components/SideBar';

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);

  console.log(state.token, 'tokstaten');
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      console.log(state.token, 'token');
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('password', data.password);
      formData.append('picture', data.picture[0]); // Ensure 'picture' matches your input name attribute
      formData.append('role', data.role); // Add selected role to form data
      console.log(formData, 'formdata');
      const response = await axios.post('/api/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${state.user.token}`, // Include token in request headers
        },
      });


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

      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
            <div  >
              <SideBar />
            </div>
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5 border shadow-sm">
                <div className="h4 bold text-center text-uppercase">
                  <h3 style={{ color: '#AE82CE' }}>Register New User</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
                  <Form.Group className="mb-3">
                    <Form.Label>Full name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      {...register('name', { required: true })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      {...register('email', { required: true })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      {...register('password', { required: true })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      {...register('picture', { required: true })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select {...register('role', { required: true })}>
                      <option value="">Select role</option>
                      <option value="admin">Admin</option>
                      <option value="superadmin">Superadmin</option>
                      <option value="owner">Owner</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      label="Do you agree with terms and conditions?"
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit" disabled={isLoading} style={{ backgroundColor: '#AE82CE', borderColor: '#AE82CE' }}>
                    {isLoading ? (
                      <BeatLoader size={8} color="white" />
                    ) : (
                      'Register'
                    )}
                  </Button>{" "}
                  <Button variant="outline-secondary" type="reset" disabled={isLoading} style={{ borderColor: '#dc3545', color: '#dc3545' }} onClick={handleCancel}>
                    Cancel
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* content-wrapper ends */}
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </>
  );
};

export default Register;
