import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Spinner, Table, Modal, Form } from 'react-bootstrap';
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { GrAdd } from "react-icons/gr";
import { AuthContext } from '../Pages/AuthContext';

const FloorSearch = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [ownerProperties, setOwnerProperties] = useState([]);
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState('');
    const [selectedApartmentIdForDelete, setSelectedApartmentIdForDelete] = useState('');
    const [selectedFloorIdForDelete, setSelectedFloorIdForDelete] = useState('');
    const [editFloorId, setEditFloorId] = useState('');
    const [editFloorName, setEditFloorName] = useState('');
    const [floorName, setFloorName] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toggleState, setToggleState] = useState(false);
    console.log(toggleState, 'togglestate');

    const fetchProperties = async () => {
        try {
            const response = await axios.get('/api/properties/allproperties', {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            setProperties(response.data);

            const ownerNames = response.data.map(property => property.user.name);
            setOwners([...new Set(ownerNames)]);

            setLoading(false);

        } catch (error) {
            setError('Failed to fetch properties');
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchProperties();
    }, [state.user.token,toggleState])

    const handleOwnerChange = (owner) => {
        setSelectedOwner(owner);

        // Filter properties based on selected owner
        const ownerProps = properties.filter(property => property.user.name === owner);

        // Update ownerProperties state
        setOwnerProperties(ownerProps);

        // Reset other state variables
        setFloors([]);
        setUnits([]);
        setSelectedProperty('');
        setSelectedFloor('');
        setSelectedUnit('');
    };

    const handlePropertyChange = (property) => {
        setSelectedProperty(property);

        // Find selected property
        const selectedProp = ownerProperties.find(p => p.name === property);

        // Update floors
        if (selectedProp) {
            setFloors(selectedProp.floors.map(floor => floor.name));
        }

        setSelectedFloor('');
        setSelectedUnit('');
    };

    const handleFloorChange = (floor) => {
        setSelectedFloor(floor);

        // Find selected floor
        const selectedProp = ownerProperties.find(p => p.name === selectedProperty);
        if (selectedProp) {
            const selectedFloor = selectedProp.floors.find(f => f.name === floor);

            // Update units
            if (selectedFloor) {
                setUnits(selectedFloor.units || []);
            }
        }
    };

    const handleUnitChange = (unitString) => {
        // Find the unit object from the string representation
        const selectedUnitObject = units.find(unit => `${unit.unitNo} (${unit.type})` === unitString);

        // Update selectedUnit state
        setSelectedUnit(selectedUnitObject);
    };

    const openModal = (apartmentId) => {
        setSelectedApartmentId(apartmentId);
        setShowModal(true);
    };

    const handleAddFloor = async () => {
        try {
            await axios.post(`/api/properties/floor/${selectedApartmentId}/addFloor`, { name: floorName }, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            // Refresh floors
            handlePropertyChange(selectedProperty);
            setShowModal(false);
            setToggleState(!toggleState)
        } catch (error) {
            console.error('Error adding floor:', error);
        }
    };

    const handleEditFloor = async () => {
        try {
            await axios.put(`/api/properties/floor/${editFloorId}`, { name: editFloorName }, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            // Refresh floors
            handlePropertyChange(selectedProperty);
            setShowEditModal(false);
            setToggleState(!toggleState);
        } catch (error) {
            console.error('Error editing floor:', error);
        }
    };

    const handleDeleteFloor = async () => {
        try {
            await axios.delete(`/api/properties/floor/${selectedApartmentIdForDelete}/deleteFloor/${selectedFloorIdForDelete}`, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            // Refresh floors
            handlePropertyChange(selectedProperty);
            setShowDeleteModal(false);
            setToggleState(!toggleState);
        } catch (error) {
            console.error('Error deleting floor:', error);
        }
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', color: 'green' }} ><Spinner /></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '20px' }} >
                <div style={{ display: 'flex', justifyContent: 'end', gap: '10px' }} >

                    <div className="search-field d-none d-md-block">
                        <div className="input-group" style={{ border: '1px solid #ebedf2', borderRadius: '20px' }} >
                            <input
                                type="text"
                                className="form-control bg-transparent border-0"
                                placeholder="Search Property Owner"
                                list="ownersList"
                                value={selectedOwner}
                                onChange={(e) => handleOwnerChange(e.target.value)}
                            />
                            <datalist id="ownersList">
                                {owners.map((owner, index) => (
                                    <option key={index} value={owner} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="search-field d-none d-md-block">
                        <div className="input-group" style={{ border: '1px solid #ebedf2', borderRadius: '20px' }} >
                            <input
                                type="text"
                                className="form-control bg-transparent border-0"
                                placeholder="Search Property"
                                list="propertiesList"
                                value={selectedProperty}
                                onChange={(e) => handlePropertyChange(e.target.value)}

                            />
                            <datalist id="propertiesList">
                                {ownerProperties.map((property, index) => (
                                    <option key={index} value={property.name} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                </div>
            </div>

            {/* Display property details */}
            {selectedProperty && (
                <Table striped bordered hover responsive className='mb-4 mt-3'>
                    <thead style={{ backgroundColor: '#005f75' }}  >
                        <tr>
                            <th style={{ color: 'white' }} >Property Name</th>
                            <th style={{ color: 'white' }} >Location</th>
                            <th style={{ color: 'white' }} >Status</th>
                            <th style={{ color: 'white' }} >Zone</th>
                            <th style={{ color: 'white' }} >Property Type</th>
                            <th style={{ color: 'white' }} >Floor</th>
                            <th style={{ color: 'white' }} >Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ownerProperties.map((selected, index) => {
                            if (selected.name === selectedProperty) {
                                return (
                                    <tr key={index}>
                                        <td>{selected.name}</td>
                                        <td>{selected.address}</td>
                                        <td>{selected.status}</td>
                                        <td>{selected.zone}</td>
                                        <td>{selected.propertyType}</td>
                                        <td>{selected.floors.map((floor) => {
                                            return (
                                                <>
                                                    <div key={floor._id} className='mt-3' style={{ display: 'flex', gap: '10px' }} >
                                                        {floor.name}
                                                        <FiEdit onClick={() => {
                                                            setEditFloorId(floor._id);
                                                            setEditFloorName(floor.name);
                                                            setShowEditModal(true);
                                                        }} style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />
                                                        <AiOutlineDelete onClick={() => {
                                                            setSelectedApartmentIdForDelete(selected._id);
                                                            setSelectedFloorIdForDelete(floor._id);
                                                            setShowDeleteModal(true);
                                                        }} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />
                                                    </div>
                                                </>
                                            )
                                        })}</td>
                                        <td>
                                            <Button variant="success" size='sm' onClick={() => openModal(selected._id)}>
                                                <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} />
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            }
                            return null;
                        })}
                    </tbody>
                </Table>
            )}

            {/* Display all properties associated with the selected owner */}
            {!selectedProperty && (
                <Table striped bordered hover responsive className='mb-4 mt-3' >
                    {
                        selectedProperty === 'owner' ? <>
                            <tr>
                                <th style={{ color: 'white' }} >Property Name</th>
                                <th style={{ color: 'white' }} >Location</th>
                                <th style={{ color: 'white' }} >Status</th>
                                <th style={{ color: 'white' }} >Zone</th>
                                <th style={{ color: 'white' }} >Property Type</th>
                                <th style={{ color: 'white' }} >Floor</th>
                                <th style={{ color: 'white' }} >Action</th>
                            </tr>
                        </> : null
                    }
                    <tbody>
                        {ownerProperties.map((property, index) => (
                            <tr key={index}>
                                <td>{property.name}</td>
                                <td>{property.address}</td>
                                <td>{property.status}</td>
                                <td>{property.zone}</td>
                                <td>{property.propertyType}</td>
                                <td>{property.floors.map((floor) => {
                                    return (
                                        <>
                                            <div key={floor._id} className='mt-3' style={{ display: 'flex', gap: '10px' }} >
                                                {floor.name}
                                                <FiEdit onClick={() => {
                                                    setEditFloorId(floor._id);
                                                    setEditFloorName(floor.name);
                                                    setShowEditModal(true);
                                                }} style={{ cursor: 'pointer', fontSize: '15px', color: '#008f00' }} />
                                                <AiOutlineDelete onClick={() => {
                                                    setSelectedApartmentIdForDelete(property._id);
                                                    setSelectedFloorIdForDelete(floor._id);
                                                    setShowDeleteModal(true);
                                                }} style={{ cursor: 'pointer', fontSize: '15px', color: '#e03c3e' }} />
                                            </div>
                                        </>
                                    )
                                })}</td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }} >
                                        <Button variant="success" size='sm' onClick={() => openModal(property._id)}>
                                            <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

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
                </div>
                <Modal.Title style={{ textAlign: 'center', fontSize: '25px' }} className='mt-2' >Are you sure? </Modal.Title>
                <Modal.Body>
                    <p style={{ textAlign: 'center', fontWeight: '500' }} >Do you really want to delete this floor.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleDeleteFloor}>Yes</Button>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>No</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default FloorSearch;