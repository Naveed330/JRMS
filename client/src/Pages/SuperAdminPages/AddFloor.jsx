import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const AddFloor = () => {
  const { state } = useContext(AuthContext);

  const [apartments, setApartments] = useState([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState('');
  const [floorName, setFloorName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editFloorName, setEditFloorName] = useState('');
  const [editFloorId, setEditFloorId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchApartments = async () => {
    try {
      const response = await axios.get('/api/properties/allproperties', {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      setApartments(response.data.filter(property => property.propertyType === 'apartments'));
    } catch (error) {
      console.error('Error fetching apartments:', error);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, [state.user.token]);

  const handleAddFloor = async () => {
    if (!selectedApartmentId) {
      alert('Please select an apartment');
      return;
    }

    if (!floorName.trim()) {
      alert('Please enter a floor name');
      return;
    }

    try {
      const response = await axios.post(`/api/properties/floor/${selectedApartmentId}/addFloor`, { name: floorName }, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log('Floor added:', response.data);
      setShowModal(false);
      // Fetch apartments again after adding floor
      fetchApartments();
    } catch (error) {
      console.error('Error adding floor:', error);
      // Handle error 
    }
  };

  const handleDeleteFloor = async (apartmentId, floorId) => {
    try {
      await axios.delete(`/api/properties/floor/${apartmentId}/deleteFloor/${floorId}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      // Fetch apartments again after deleting floor
      fetchApartments();
    } catch (error) {
      console.error('Error deleting floor:', error);
      // Handle error 
    }
  };

  const handleOpenEditModal = (floorId, floorName) => {
    setEditFloorId(floorId);
    setEditFloorName(floorName);
    setShowEditModal(true);
  };

  const handleEditFloor = async () => {
    try {
      const response = await axios.put(`/api/properties/floor/${editFloorId}`, { name: editFloorName }, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log('Floor edited:', response.data);
      setShowEditModal(false);
      // Fetch apartments again after editing floor
      fetchApartments();
    } catch (error) {
      console.error('Error editing floor:', error);
      // Handle error 
    }
  };

  const openModal = (apartmentId) => {
    setSelectedApartmentId(apartmentId);
    setShowModal(true);
  };

  return (
    <div>
      <h2>Floor Section of Apartments</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name of Apartment</th>
            <th>Address</th>
            <th>Floors</th>
            <th>Delete Floor</th>
            <th>Edit Floor</th>
            <th>Add Floor</th>
          </tr>
        </thead>
        <tbody>
          {apartments.map(apartment => (
            <tr key={apartment._id}>
              <td>{apartment.name}</td>
              <td>{apartment.address}</td>
              <td>
                {apartment.floors.map(floor => (
                  <div key={floor._id}>
                    {floor.name}
                  </div>
                ))}
              </td>
              <td>
                {apartment.floors.map(floor => (
                  <div key={floor._id}>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteFloor(apartment._id, floor._id)}>Delete</Button>
                  </div>
                ))}
              </td>
              <td>
                {apartment.floors.map(floor => (
                  <div key={floor._id}>
                    <Button variant="primary" size="sm" onClick={() => handleOpenEditModal(floor._id, floor.name)}>Edit</Button>
                  </div>
                ))}
              </td>
              <td>
                <Button variant="primary" onClick={() => openModal(apartment._id)}>Add Floor</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

    
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="floorName">
              <Form.Label>Floor Name</Form.Label>
              <Form.Control type="text" placeholder="Enter floor name" value={floorName} onChange={(e) => setFloorName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddFloor}>Add Floor</Button>
        </Modal.Footer>
      </Modal>

   
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Floor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editFloorName">
              <Form.Label>Floor Name</Form.Label>
              <Form.Control type="text" placeholder="Enter floor name" value={editFloorName} onChange={(e) => setEditFloorName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditFloor}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddFloor;
