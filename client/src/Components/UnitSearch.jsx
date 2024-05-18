import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FiEdit } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

const UnitSearch = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('property'); // 'property' or 'floor'
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUnitId, setEditUnitId] = useState(null);
    const [editFloorId, setEditFloorId] = useState(null);
    const [editUnitName, setEditUnitName] = useState('');
    const [editUnitType, setEditUnitType] = useState('');
    const [editUnitOccupied, setEditUnitOccupied] = useState(false);
    const [unitNo, setUnitNo] = useState('');
    const [premiseNo, setPremiseNo] = useState('');
    const [unitRegNo, setUnitRegNo] = useState('');

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

    const handlePropertyChange = (event) => {
        const propertyId = event.target.value;
        const selected = properties.find(property => property._id === propertyId);
        setSelectedProperty(selected);
        setSelectedFloor(null); // Reset selected floor when property changes
        setViewMode('property'); // Set view mode to 'property'
    };

    const handleFloorChange = (event) => {
        const floorId = event.target.value;
        const selected = selectedProperty?.floors.find(floor => floor._id === floorId);
        setSelectedFloor(selected);
        setViewMode('floor'); // Set view mode to 'floor'
    };

    const handleOpenEditModal = (floorId, unitId, unitName, unitType, unitOccupied) => {
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

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div>
                    <div style={{width:'100%' , maxWidth:'600px' }} >
                    <select onChange={handlePropertyChange} className='w-50 py-2 px-2'  style={{ border: '1px solid #ebedf2', borderRadius: '15px' }}>
                        <option value="">Select Property</option>
                        {properties.map(property => (
                            <option key={property._id} value={property._id}>{property.name || property.buildingname}</option>
                        ))}
                    </select>
                    </div>

                    {selectedProperty && (
                        <>
                        <div style={{width:'100%' , maxWidth:'600px' }}>

                            <select onChange={handleFloorChange} className='w-50 py-2 px-2 mt-3'  style={{ border: '1px solid #ebedf2', borderRadius: '15px' }}>
                                <option value="">Select Floor</option>
                                {selectedProperty.floors.map(floor => (
                                    <option key={floor._id} value={floor._id}>{floor.name}</option>
                                ))}
                            </select>
                        </div>
                            <div>
                                <h3 className='mt-3' >{`Property Name : ${selectedProperty.name || selectedProperty.buildingname}`}</h3>
                                <p>{`Address : ${selectedProperty.address}`}</p>
                                <Table striped bordered hover>
                                    <thead style={{ backgroundColor: '#005f75' }}>
                                        <tr style={{ color: '#ffff' }}>
                                            <th>Property Name</th>
                                            <th>Address</th>
                                            <th>Status</th>
                                            <th>Floors</th>
                                            <th>Unit No</th>
                                            <th>Occupied</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(viewMode === 'property' ? selectedProperty.floors : [selectedFloor]).map(floor => (
                                            <React.Fragment key={`${selectedProperty._id}-${floor._id}`}>
                                                {floor.units.map(unit => (
                                                    <tr key={unit._id}>
                                                        <td>{selectedProperty.name || selectedProperty.buildingname}</td>
                                                        <td>{selectedProperty.address}</td>
                                                        <td>{selectedProperty.status}</td>
                                                        <td>{floor.name}</td>
                                                        <td>{unit.unitNo}</td>
                                                        <td>{unit.occupied ? 'Yes' : 'No'}</td>
                                                        <td>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <FiEdit onClick={() => handleOpenEditModal(floor._id, unit._id, unit.name, unit.type, unit.occupied)} style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />
                                                                <AiOutlineDelete onClick={() => handleDeleteUnit(floor._id, unit._id)} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </>
                    )}
                </div>
            )}
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

export default UnitSearch;