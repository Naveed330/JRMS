import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { GrAdd } from 'react-icons/gr';
import AdminSideBar from '../../Components/AdminSideBar';
const AdminUnit = () => {
  const { state } = useContext(AuthContext);

  const [properties, setProperties] = useState([]);
  const [selectedFloorId, setSelectedFloorId] = useState('');
  const [unitType, setUnitType] = useState('');
  const [occupied, setOccupied] = useState(false);
  const [premiseNo, setPremiseNo] = useState('');
  const [unitRegNo, setUnitRegNo] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUnitId, setEditUnitId] = useState('');
  const [editUnitName, setEditUnitName] = useState('');
  const [editUnitType, setEditUnitType] = useState('');
  const [editUnitOccupied, setEditUnitOccupied] = useState(false);
  const [editFloorId, setEditFloorId] = useState('');

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
        type: unitType,
        occupied,
        premiseNo,
        unitRegNo,
        unitNo,
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
        occupied: editUnitOccupied,
        premiseNo,
        unitRegNo,
        unitNo,

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

  const handleOpenEditModal = (floorId, unitId, unitName, unitType, unitOccupied,) => {
    setEditFloorId(floorId);
    setEditUnitId(unitId);
    setEditUnitName(unitName);
    setEditUnitType(unitType);
    setEditUnitOccupied(unitOccupied);
    setShowEditModal(true);
  };

  return (
    <div>
      <Row>
        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <AdminSideBar />
          </div>
        </Col>

        <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }} >
          <Row xs={1} md={2} lg={3}>
            <Col xs={12} sm={12} md={12} lg={10} xl={10} >
              <h2 className='text-center'>Units Section</h2>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Property Name</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Floor Name</th>
                    {/* <th>Unit Name</th> */}
                    <th>Unit Type</th>
                    <th>Occupied</th>
                    <th>Add Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map(property => (
                    property.floors.map(floor => (
                      <tr key={`${property._id}-${floor._id}`}>
                        <td>{property.name || property.buildingname}</td>
                        <td>{property.address}</td>
                        <td>{property.status}</td>
                        <td>
                          {floor.name}
                        </td>

                        <td>

                          {
                            floor.units.map((unit) => {
                              return (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                  {`${unit.type} ,`}
                                  <div key={unit._id}>
                                    {unit.name}
                                    <span style={{ display:'flex', gap:'8px' }} >

                                      <FiEdit onClick={() => handleOpenEditModal(floor._id, unit._id, unit.name, unit.type, unit.occupied)} style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />

                                      <AiOutlineDelete onClick={() => handleDeleteUnit(floor._id, unit._id)} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />
                                    
                                    </span>
                                  </div>

                                </div>
                              )
                            })
                          }


                          {/* {floor.units.map(unit => unit.type).join(', ')} */}

                        </td>
                        <td>{floor.units.some(unit => unit.occupied) ? 'Yes' : 'No'}</td>
                        <td>
                          <Button variant="primary" size='sm' onClick={() => { setSelectedFloorId(floor._id); setShowModal(true); }}>
                            <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>


      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="unitNo">
              <Form.Label>Unit No:</Form.Label>
              <Form.Control type="text" value={unitNo} onChange={(e) => setUnitNo(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="unitType">
              <Form.Label>Type:</Form.Label>
              <Form.Control as="select" value={unitType} onChange={(e) => setUnitType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="studio">Studio</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="penthouse">Penthouse</option>
                <option value="office">Office</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="occupied">
              <Form.Check type="checkbox" label="Occupied" checked={occupied} onChange={(e) => setOccupied(e.target.checked)} />
            </Form.Group>
            <Form.Group controlId="premiseNo">
              <Form.Label>Premise No:</Form.Label>
              <Form.Control type="text" value={premiseNo} onChange={(e) => setPremiseNo(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="unitRegNo">
              <Form.Label>Unit Reg No:</Form.Label>
              <Form.Control type="text" value={unitRegNo} onChange={(e) => setUnitRegNo(e.target.value)} />
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddUnit}>Add Unit</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Unit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editUnitNo">
              <Form.Label>Unit No:</Form.Label>
              <Form.Control type="text" value={unitNo} onChange={(e) => setUnitNo(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="editUnitType">
              <Form.Label>Type:</Form.Label>
              <Form.Control as="select" value={editUnitType} onChange={(e) => setEditUnitType(e.target.value)}>
                <option value="">Select Type</option>
                <option value="studio">Studio</option>
                <option value="1BHK">1BHK</option>
                <option value="2BHK">2BHK</option>
                <option value="3BHK">3BHK</option>
                <option value="penthouse">Penthouse</option>
                <option value="office">Office</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editUnitOccupied">
              <Form.Check type="checkbox" label="Occupied" checked={editUnitOccupied} onChange={(e) => setEditUnitOccupied(e.target.checked)} />
            </Form.Group>
            <Form.Group controlId="editPremiseNo">
              <Form.Label>Premise No:</Form.Label>
              <Form.Control type="text" value={premiseNo} onChange={(e) => setPremiseNo(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="editUnitRegNo">
              <Form.Label>Unit Reg No:</Form.Label>
              <Form.Control type="text" value={unitRegNo} onChange={(e) => setUnitRegNo(e.target.value)} />
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

export default AdminUnit;