import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Modal, Form, Container, Table } from 'react-bootstrap';

const AllPropertiesForAdmin = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allpropertiesforadmin', {
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

    const apartments = properties.filter(property => property.propertyType === 'apartments');
    const houses = properties.filter(property => property.propertyType === 'house');
    const villas = properties.filter(property => property.propertyType === 'villa');

    const handleDelete = async (propertyId) => {
        try {
            await axios.delete(`/api/properties/deletebyadmin/${propertyId}`, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            setProperties(properties.filter(property => property._id !== propertyId));
        } catch (error) {
            console.error('Error deleting property:', error);
            // Handle error, show a toast or message to the user
        }
    };

    const handleEdit = (property) => {
        setEditData(property);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editData || !editData._id) {
            console.error('Edit data is missing _id');
            return;
        }
        try {
            await axios.put(`/api/properties/editbyadmin/${editData._id}`, editData, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            setProperties(properties.map(property => property._id === editData._id ? editData : property));
            setShowModal(false);
        } catch (error) {
            console.error('Error editing property:', error);
            // Handle error, show a toast or message to the user
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-primary mb-5">All Properties</h1>
            <h2 className="text-primary">Apartments</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Contact Info</th>
                        <th>Floors</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {apartments.map(property => (
                        <tr key={property._id}>
                            <td>{property.name}</td>
                            <td>{property.address}</td>
                            <td>{property.status}</td>
                            <td>{property.contactinfo}</td>
                            <td>{property.floors.length}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(property._id)}>Delete</Button>{' '}
                                <Button variant="primary" onClick={() => handleEdit(property)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h2 className="text-primary">Houses</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Contact Info</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {houses.map(property => (
                        <tr key={property._id}>
                            <td>{property.name}</td>
                            <td>{property.address}</td>
                            <td>{property.status}</td>
                            <td>{property.contactinfo}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(property._id)}>Delete</Button>{' '}
                                <Button variant="primary" onClick={() => handleEdit(property)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h2 className="text-primary">Villas</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th>Contact Info</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {villas.map(property => (
                        <tr key={property._id}>
                            <td>{property.name}</td>
                            <td>{property.address}</td>
                            <td>{property.status}</td>
                            <td>{property.contactinfo}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(property._id)}>Delete</Button>{' '}
                                <Button variant="primary" onClick={() => handleEdit(property)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Property</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="propertyName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="propertyAddress">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Enter address" value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="propertyStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" placeholder="Enter status" value={editData.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="propertyType">
                            <Form.Label>Property Type</Form.Label>
                            <Form.Control type="text" placeholder="Enter property type" value={editData.propertyType} onChange={(e) => setEditData({ ...editData, propertyType: e.target.value })} />
                        </Form.Group>
                        <Form.Group controlId="propertyContactInfo">
                            <Form.Label>Contact Info</Form.Label>
                            <Form.Control type="text" placeholder="Enter contact info" value={editData.contactinfo} onChange={(e) => setEditData({ ...editData, contactinfo: e.target.value })} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default AllPropertiesForAdmin;
