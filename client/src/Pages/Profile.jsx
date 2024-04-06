import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { Container, Row, Col, Form, Button, Alert, Card, Modal } from 'react-bootstrap';
import Spinner from '../Components/Spinner';
import { ToastContainer, toast } from 'react-toastify';

const Profile = () => {
  const { state, updateUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');
  const [newcontactnumber, setNewcontactnumber] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPicture, setNewPicture] = useState(null);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [userPicture, setUserPicture] = useState('');

  useEffect(() => {
    setUserData(state.user);
    setUserPicture(state.user.picture);
  }, [state.user]);

  const showToast = (message, type) => {
    toast(message, { type });
  };

  const handleUpdateProfile = async () => {
    if (newPassword !== newPasswordConfirm) {
      setPasswordMismatch(true);
      showToast('Passwords do not match.', 'error');
      return;
    }

    try {
      setLoading(true);
      setShowModal(false);
      const formData = new FormData();
      formData.append('name', newName);
      formData.append('email', newEmail);
      formData.append('password', newPassword);
      formData.append('contactnumber', newcontactnumber);
      if (newPicture) {
        formData.append('picture', newPicture);
      }

      const response = await axios.put(`/api/users/profile`, formData, {
        headers: {
          Authorization: `Bearer ${state.user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        setMessage('Profile updated successfully');
        updateUser(response.data); // Update user data in context
        closeModal();
        showToast('Profile updated successfully', 'success');
      }
    } catch (error) {
      setMessage('Error updating profile');
      showToast('Error updating profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setNewName(userData.name);
    setNewEmail(userData.email);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPasswordMismatch(false);
  };

  return (
    <div className="container-xxl bg-white p-0">
    {/* Apply hero-header only on larger screens */}
    <div className="container-xxl py-4 bg-dark hero-header mb-3 hero-header-large">
      <div className="container text-center my-3 pt-1 pb-1">
      </div>
    </div>

    <Container className="profile-container">
      <h2 className="mb-4 text-center">Your Profile</h2>
      <Row className="justify-content-center">
        <Col xs={12} sm={6}>
          <Card className="profile-card">
            <div className="text-center mt-4">
              <img
                src={userPicture}
                alt="Avatar"
                className="rounded-circle"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
            </div>
            <Card.Body>
              <Card.Title>Name: {userData.name}</Card.Title>
              <Card.Text>Email: {userData.email}</Card.Text>
              <Button variant="primary" onClick={openModal}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>

          <Modal className="custom-modal" show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Profile</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Label>New Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter new name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>New Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter new email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </Form.Group>
             
              <Form.Group>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>New Password Confirmation</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm new password"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                />
              </Form.Group>
              {passwordMismatch && <p className="text-danger">Passwords do not match.</p>}
              <Form.Group>
                <Form.Label>New Picture</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewPicture(e.target.files[0])}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateProfile}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
          {loading ? (
            <Spinner />
          ) : (
            message && (
              <Alert
                variant={message.includes('Error') ? 'danger' : 'success'}
                className="mt-3"
              >
                {message}
              </Alert>
            )
          )}
        </Col>
      </Row>
      <ToastContainer position="top-right" autoClose={5000} />
    </Container>
    </div>
  );
};

export default Profile;
