import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Form, Table, Button, Modal } from 'react-bootstrap';
import { AuthContext } from '../Pages/AuthContext';
import { GrAdd } from 'react-icons/gr';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

const UnitSearch = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [unitType, setUnitType] = useState('');
    const [unitNo, setUnitNo] = useState('');
    const [occupied, setOccupied] = useState(false);
    const [premiseNo, setPremiseNo] = useState('');
    const [unitRegNo, setUnitRegNo] = useState('');
    const [selectedFloorId, setSelectedFloorId] = useState('');
    const [editFloorId, setEditFloorId] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUnitOccupied, setEditUnitOccupied] = useState(false);
    const [editUnitType, setEditUnitType] = useState('');
    const [editUnitName, setEditUnitName] = useState('');
    const [editUnitId, setEditUnitId] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allproperties', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setProperties(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch properties');
                setLoading(false);
            }
        };

        fetchProperties();
    }, [state.user.token]);

    const handlePropertyChange = (property) => {
        setSelectedProperty(property);
        const selectedProp = properties.find(p => p.name === property);
        if (selectedProp) {
            setFloors(selectedProp.floors);
            setSelectedFloor('');
            setUnits([]);
        }
    };

    const handleFloorChange = (floor) => {
        setSelectedFloor(floor);
        const selectedProp = properties.find(p => p.name === selectedProperty);
        if (selectedProp) {
            const selectedFloor = selectedProp.floors.find(f => f.name === floor);
            if (selectedFloor) {
                setUnits(selectedFloor.units);
            }
        }
    };

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

    const handleUnitChange = (unit) => {
        setSelectedUnit(unit);
        // Handle selected unit logic here
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

    const renderUnitTable = () => {
        if (selectedProperty && selectedFloor && units.length > 0) {
            return (
                <Table striped bordered hover>
                    <thead style={{ backgroundColor: '#005f75' }} >
                        <tr style={{ color: '#ffff' }} >
                            <th>Property Name</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Floor Name</th>
                            <th>Unit No</th>
                            <th>Unit Type</th>
                            <th>Occupied</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            properties.map(property => (
                                property.floors.map(floor => (
                                    floor.units.map((unit, index) => {
                                        return (
                                            <>
                                                <tr key={index}>
                                                <td>{property.name && property.name || property.buildingname && property.buildingname}</td>
                                                <td>{property.address && property.address}</td>
                                                    <td>{property.status && property.status}</td>
                                                    <td>{floor.name && floor.name}</td>
                                                    <td>{unit.unitNo && unit.unitNo}</td>
                                                    <td>
                                                        <div style={{ display: 'flex', gap: '8px' }} >
                                                            {unit.type && unit.type}
                                                            <span style={{ display: 'flex', gap: '8px' }} >

                                                                <FiEdit onClick={() => handleOpenEditModal(floor._id, unit._id, unit.name, unit.type, unit.occupied)} 									style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />

                                                                <AiOutlineDelete onClick={() => handleDeleteUnit(floor._id, unit._id)} style={{ cursor: 'pointer', fontSize: 								'15px', color: '#e03c3e' }} />

                                                            </span>
                                                        </div>

                                                    </td>
                                                    <td>{floor.units.some(unit => unit.occupied) ? 'Yes' : 'No'}</td>

                                                    <td>
                                                        <Button variant="success" size='sm' onClick={() => { setSelectedFloorId(floor._id); setShowModal(true) }}>
                                                            <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }}  />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                ))
                            ))
                        }
                        {/* {units.map((unit, index) => (
                            <tr key={index}>
                                <td>{unit.unitNo}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px' }} >
                                        {unit.type}
                                        <span style={{ display: 'flex', gap: '8px' }} >

                                            <FiEdit  style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />

                                            <AiOutlineDelete  style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />

                                        </span>
                                    </div>
                                    
                                    </td>

                                <td>
                                    <Button variant="success" size='sm'>
                                        <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => {setSelectedFloorId(); setShowModal(true)}} />
                                    </Button>
                                </td>
                            </tr>
                        ))} */}
                    </tbody>
                </Table>
            );
        }
        return null;
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', color: 'green' }} ><Spinner /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }} >

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '20px' }}>
                    <Form.Group controlId="propertySelect">
                        <Form.Control as="select" onChange={(e) => handlePropertyChange(e.target.value)} style={{ padding: '15px 50px 15px 50px', borderRadius: '20px' }} >
                            <option value="">Select Property</option>
                            {properties.map((property, index) => (
                                <option key={index} value={property.name}>{property.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '20px' }}>
                    <Form.Group controlId="floorSelect">
                        <Form.Control as="select" onChange={(e) => handleFloorChange(e.target.value)} style={{ padding: '15px 60px 15px 60px', borderRadius: '20px' }} >
                            <option value="">Select Floor</option>
                            {floors.map((floor, index) => (
                                <option key={index} value={floor.name}>{floor.name}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>

            </div>

            <div className="search-field" style={{ marginBottom: '20px' }}>
                {selectedProperty && selectedFloor && (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '15px' }} >
                            <p> <span style={{ fontWeight: 'bold' }} >Selected Property:</span>  {selectedProperty}</p>
                            <p>  <span style={{ fontWeight: 'bold' }} >Selected Floor:</span>  {selectedFloor}</p>
                        </div>

                        {renderUnitTable()}
                    </>
                )}
            </div>

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

        </>
    );
}

export default UnitSearch;