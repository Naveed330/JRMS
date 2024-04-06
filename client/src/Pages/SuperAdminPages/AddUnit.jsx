import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const AddUnit = () => {
  const { state } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [unitName, setUnitName] = useState('');
  const [unitType, setUnitType] = useState('');
  const [occupied, setOccupied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnitId, setEditUnitId] = useState('');
  const [editUnitName, setEditUnitName] = useState('');
  const [editUnitType, setEditUnitType] = useState('');
  const [editUnitOccupied, setEditUnitOccupied] = useState(false);
  const [editFloorId, setEditFloorId] = useState(''); // Add state for editing floorId

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties/allproperties', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, [state.user.token]);

  const handleAddUnit = async () => {
    try {
      const response = await axios.post(`/api/properties/${selectedFloorId}/addUnit`, {
        name: unitName,
        type: unitType,
        occupied
      }, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log('Unit added:', response.data);
      setShowModal(false);
      
      // Refetch properties after successful addition
      const updatedProperties = await axios.get('/api/properties/allproperties', {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      setProperties(updatedProperties.data);
    } catch (error) {
      console.error('Error adding unit:', error);
    }
  };

  const handleEditUnit = async () => {
    try {
      const response = await axios.put(`/api/properties/${editFloorId}/editUnit/${editUnitId}`, {
        name: editUnitName,
        type: editUnitType,
        occupied: editUnitOccupied
      }, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log('Unit edited:', response.data);
      setShowEditModal(false);
      
      // Refetch properties after successful edit
      const updatedProperties = await axios.get('/api/properties/allproperties', {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      setProperties(updatedProperties.data);
    } catch (error) {
      console.error('Error editing unit:', error);
    }
  };

  const handleDeleteUnit = async (floorId, unitId) => {
    try {
      await axios.delete(`/api/properties/${floorId}/deleteUnit/${unitId}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log('Unit deleted');
      
      // Refetch properties after successful deletion
      const updatedProperties = await axios.get('/api/properties/allproperties', {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      setProperties(updatedProperties.data);
    } catch (error) {
      console.error('Error deleting unit:', error);
    }
  };

  const handleOpenEditModal = (floorId, unitId, unitName, unitType, unitOccupied) => {
    setEditFloorId(floorId); // Set the floorId for editing
    setEditUnitId(unitId);
    setEditUnitName(unitName);
    setEditUnitType(unitType);
    setEditUnitOccupied(unitOccupied);
    setShowEditModal(true);
  };

  return (
    <div style={{marginTop:'100px'}} >
      <h2>Units Section</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Property Name</th>
            <th>Address</th>
            <th>Status</th>
            <th>Floor Name</th>
            <th>Unit Name</th>
            <th>Unit Type</th>
            <th>Occupied</th>
            <th>Add Unit</th>
          </tr>
        </thead>
        <tbody>
          {properties.map(property => (
            property.floors.map(floor => (
              <tr key={`${property._id}-${floor._id}`}>
                <td>{property.name}</td>
                <td>{property.address}</td>
                <td>{property.status}</td>
                <td>{floor.name}</td>
                <td>{floor.units.map(unit => (
                  <span key={unit._id}>
                    {unit.name}{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteUnit(floor._id, unit._id)}>Delete</Button>
                    {' '}
                    <Button variant="primary" size="sm" onClick={() => handleOpenEditModal(floor._id, unit._id, unit.name, unit.type, unit.occupied)}>Edit</Button>
                    <br />
                  </span>
                ))}</td>
                <td>{floor.units.map(unit => unit.type).join(', ')}</td>
                <td>{floor.units.some(unit => unit.occupied) ? 'Yes' : 'No'}</td>
                <td>
                  <Button variant="primary" onClick={() => { setSelectedFloorId(floor._id); setShowModal(true); }}>Add Unit</Button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </Table>

      {/* Modal for adding unit */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="unitName">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" value={unitName} onChange={(e) => setUnitName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="unitType">
              <Form.Label>Type:</Form.Label>
              <Form.Control type="text" value={unitType} onChange={(e) => setUnitType(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="occupied">
              <Form.Check type="checkbox" label="Occupied" checked={occupied} onChange={(e) => setOccupied(e.target.checked)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddUnit}>Add Unit</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for editing unit */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editUnitName">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" value={editUnitName} onChange={(e) => setEditUnitName(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="editUnitType">
              <Form.Label>Type:</Form.Label>
              <Form.Control type="text" value={editUnitType} onChange={(e) => setEditUnitType(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="editUnitOccupied">
              <Form.Check type="checkbox" label="Occupied" checked={editUnitOccupied} onChange={(e) => setEditUnitOccupied(e.target.checked)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditUnit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddUnit;
