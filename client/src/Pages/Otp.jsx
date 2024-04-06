import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import otp from '../assets/otp.jpg'
import forgotpassword from '../assets/forgotpassword.png'
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the location object
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Access the email value from the location state
  const email = location.state?.email || '';

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      // Send OTP and email to the OTP verification route
      const response = await axios.post('/api/users/verify-otp', {
        otp: data.otp,
        email: email, // Use the email value from the location state
      });

      if (response.status === 200) {
        // Navigate to the ResetPassword component
        navigate('/resetpassword', { state: { email } });
      } else {
        // Handle failure
        if (response.data.message === 'User not found') {
          setMessage('User not found. Please check your email and try again.');
        } else {
          setMessage('Invalid OTP. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setMessage('Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleCancel = () => {
    // Navigate to /forgotpassword when clicking Cancel
    navigate('/forgotpassword');
  };
  return (
    <>

      <div style={{ display: 'flex', marginTop: '10%', justifyContent: 'space-evenly', alignItems: 'center' }} >
        <div>
          <img src={forgotpassword} alt="forgotpassword" style={{ width: '100%' }} />
        </div>

        <div className="border p-4 shadow-sm px-5 py-5" style={{ maxWidth: 400 }}>

          <div className="h4 bold text-center" style={{ fontWeight: 'bold' }}>
            <h3>
              We sent your code
            </h3>

          </div>
          <p style={{ color: '#979dac', textAlign: 'center' }}>
            Your code was sent to you via email
          </p>

          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Form.Group className="mb-3">
                <Form.Label style={{ color: '#979dac' }}>Enter OTP</Form.Label>
                <Form.Control
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  className='fullWidth'
                  {...register('otp', { required: true })}
                />
              </Form.Group>

              <Button variant="success" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Verify'}
              </Button>{" "}
              <Button variant="outline-secondary" type="button" onClick={handleCancel}>
                Cancel
              </Button>
              <div className="mt-3">
                {message && <p className={message.includes('Error') ? 'text-danger' : 'text-success'}>{message}</p>}
              </div>
            </form>
          </div>


        </div>

      </div>
    </>
  );
};

export default Otp;
