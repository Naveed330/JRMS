import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Table, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import Floorsearch from '../../Components/FloorSearch'


const AddFloor = () => {
  const { state } = useContext(AuthContext);

  const [apartments, setApartments] = useState([]);
  const [selectedApartmentId, setSelectedApartmentId] = useState('');
  const [floorName, setFloorName] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editFloorName, setEditFloorName] = useState('');
  const [editFloorId, setEditFloorId] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedApartmentIdForDelete, setSelectedApartmentIdForDelete] = useState('');
  const [selectedFloorIdForDelete, setSelectedFloorIdForDelete] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [floors, setFloors] = useState([]);
  const [units, setUnits] = useState([]);
  const [owners, setOwners] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(apartments, 'apartments');
  const handlePropertyChange = (property) => {
    setSelectedProperty(property);

    // Find selected property
    const selectedProp = apartments.find(p => p.name === property);

    // Update floors
    if (selectedProp) {
        setFloors(selectedProp.floors.map(floor => floor.name));
    }

    setSelectedFloor('');
    setSelectedUnit('');
};

  const fetchApartments = async () => {
    try {
      const response = await axios.get('/api/properties/allproperties', {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      setApartments(response.data.filter(property => property.propertyType === 'Apartments'));
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
      fetchApartments();
    } catch (error) {
      console.error('Error adding floor:', error);
    }
  };

  const handleDeleteFloor = async () => {
    try {
      await axios.delete(`/api/properties/floor/${selectedApartmentIdForDelete}/deleteFloor/${selectedFloorIdForDelete}`, {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      fetchApartments();
      setShowDeleteModal(false); // Close the delete modal after successful deletion
    } catch (error) {
      console.error('Error deleting floor:', error);
    }
  };

  const handleOpenDeleteModal = (apartmentId, floorId) => {
    setSelectedApartmentIdForDelete(apartmentId);
    setSelectedFloorIdForDelete(floorId);
    setShowDeleteModal(true);
  }

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
      fetchApartments();
    } catch (error) {
      console.error('Error editing floor:', error);
    }
  };

  const openModal = (apartmentId) => {
    setSelectedApartmentId(apartmentId);
    setShowModal(true);
  };

  const handleOwnerChange = (owner) => {
    setSelectedOwner(owner);

    // Filter properties based on selected owner
    const ownerProps = apartments.filter(property => property.user.name === owner);

    // Update ownerProperties state
    setApartments(ownerProps);

    // Reset other state variables
    setFloors([]);
    setUnits([]);
    setSelectedProperty('');
    setSelectedFloor('');
    setSelectedUnit('');
};

  return (
    <div>
      <Row>
        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <SideBar />
          </div>
        </Col>



        <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '80px' }} >
          <Row xs={1} md={2} lg={3}>
            <Col xs={12} sm={12} md={12} lg={10} xl={10} >

              <h2 className='text-center mt-3'>Floor Section of Apartments</h2>
              <Floorsearch />
              <Table striped bordered hover responsive className='mb-5' >
                <thead style={{ backgroundColor: '#005f75' }} >
                  <tr>
                    <th style={{ color: '#ffff' }} >Owner</th>
                    <th style={{ color: '#ffff' }}>Property Type</th>
                    <th style={{ color: '#ffff' }}>Property Name</th>
                    <th style={{ color: '#ffff' }}>Location</th>
                    <th style={{ color: '#ffff' }}>Floor</th>
                    <th style={{ color: '#ffff' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {apartments.map(apartment => (
                    <tr key={apartment._id}>
                      <td>{apartment.user.name}</td>
                      <td> {apartment.propertyType} </td>
                      <td>{apartment.name || apartment.buildingname}</td>
                      <td>{apartment.address}</td>
                      <td>
                        {apartment.floors.map(floor => {
                          return (
                            <>
                              <div key={floor._id} className='mt-3' style={{ display: 'flex', gap: '10px' }} >
                                {floor.name}
                                <FiEdit style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} onClick={() => handleOpenEditModal(floor._id, floor.name)} />
                                <AiOutlineDelete onClick={() => handleOpenDeleteModal(apartment._id, floor._id)} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />

                                {/* <AiOutlineDelete onClick={() => handleDeleteFloor(apartment._id, floor._id)} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} /> */}
                              </div>

                            </>
                          )
                        })}
                      </td>

                      <td>

                        <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }} >
                          {/* Add Floor Button */}
                          <div>
                            <Button variant="success" size='sm' onClick={() => openModal(apartment._id)}>
                              <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} />
                            </Button>
                          </div>


                          {/* Delete Handler */}
                          {/* {apartment.floors.map(floor => (
                            <div key={floor._id}  >
                              <Button variant="danger" size="sm" onClick={() => handleDeleteFloor(apartment._id, floor._id)}> <AiOutlineDelete style={{ fontSize: '20px' }} />
                              </Button>
                              <AiOutlineDelete onClick={() => handleDeleteFloor(apartment._id, floor._id)} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />
                            </div>
                          ))} */}

                          {/* Edit Handler */}
                          {/* {apartment.floors.map(floor => (
                            <div key={floor._id} >
                              <Button variant="primary" size="sm" onClick={() => handleOpenEditModal(floor._id, floor.name)} >
                              <FiEdit style={{ cursor: 'pointer', fontSize: '15px', color: '#838383' }} onClick={() => handleOpenEditModal(floor._id, floor.name)} />
                              </Button>
                            </div>
                          ))} */}
                        </div>

                      </td>


                      {/* <td>
                        {apartment.floors.map(floor => (
                          <div key={floor._id} className='mt-2' >
                            <Button variant="primary" size="sm" onClick={() => handleOpenEditModal(floor._id, floor.name)}>Edit</Button>
                          </div>
                        ))}
                      </td> */}

                      {/* <td>
                        <Button variant="primary" onClick={() => openModal(apartment._id)}>Add Floor</Button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>

      </Row>

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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
        </Modal.Header>
        <div style={{ display: 'flex', justifyContent: 'center' }} >
          {/*  <img style={{ width: '100px' }}   src={deleteicon}  alt="Delete image" />*/}
        </div>
        <Modal.Title style={{ textAlign: 'center', fontSize: '25px' }} className='mt-2' >Are you sure? </Modal.Title>
        <Modal.Body>
          <p style={{ textAlign: 'center', fontWeight: '500' }} >Do you really want to delete this floor.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleDeleteFloor()}>Yes</Button>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddFloor;