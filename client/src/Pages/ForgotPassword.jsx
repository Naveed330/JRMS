import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import forgotpassword from '../assets/forgotpassword.png'
import forgotlogo from '../assets/forgotlogo.png'
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Send a request to reset the password using the provided email
      const response = await axios.post('/api/users/forgot-password', data);

      // Display success message using react-toastify
      toast.success(response.data.message);

      if (response.status === 200) {
        // Pass the email data when navigating to '/otp'
        navigate('/otp', { state: { email: data.email } }); // Include email in the state
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      // Display error message using react-toastify
      toast.error('Error resetting password. Please try again.');
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
      <div style={{ display: 'flex', marginTop: '10% ', justifyContent: 'space-evenly', alignItems: 'center' }} >

        <div>
          <img src={forgotpassword} alt="forgotpassword" style={{ width: '100%' }} />
        </div>
        <div className="border py-5 px-3 my-5 shadow-sm">

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={forgotlogo} alt="forgotlogo" style={{ width: '100px' }} />
          </div>

          <div className="h4 bold text-center text-uppercase mt-4" style={{ fontWeight: 'bold' }}>
            Reset Password
          </div>
          <div>
            <p style={{ color: '#979dac', textAlign: 'center' }} >Enter your email to reset your password</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3 mt-4">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register('email', { required: true })}
              />
              {errors.email && <p className="text-danger">Email is required.</p>}
            </Form.Group>
            <div className='mt-4' style={{ display: 'flex', justifyContent: 'center', gap: '5px' }} >
              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Reset Password'}
              </Button>
              <Button variant="outline-secondary" type="button" onClick={handleCancel}>
                Back to Login
              </Button>

            </div>
          </form>


        </div>
      </div>
    </>

  );
};

export default ForgotPassword;
