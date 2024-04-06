import React, { useState, useEffect, useContext, } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Modal, Form, Table, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../Components/SideBar';
import { toast } from 'react-toastify';

const AllProperties = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allproperties', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                console.log(response, 'response');
                setProperties(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch properties');
                setLoading(false);
            }
        };
        fetchProperties();
    }, [state.user.token]);

    const handlePage = () => {
        console.log('Handle-Change');
    }

    const handleDelete = async (propertyId) => {
        try {
            await axios.delete(`/api/properties/${propertyId}`, {
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
    const handleDetails = () => {
        navigate('/Addunit'); // Navigate to "/Addunit" upon click
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!editData || !editData._id) {
            console.error('Edit data is missing _id');
            return;
        }
        try {
            await axios.put(`/api/properties/edit/${editData._id}`, editData, {
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
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>


                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '20px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div>
                                <h1 className=' mt-5 mb-5 text-center'> All Properties </h1>
                                {loading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : error ? (
                                    toast.error('Properties Not Found')
                                ) : (
                                    <>
                                        <h2 >Apartments</h2>

                                        <Table size bordered hover responsive>
                                            <thead>
                                                <tr>
                                                    <th>Owner</th>
                                                    <th>Address</th>
                                                    <th>Status</th>
                                                    <th>Zone</th>
                                                    <th>PropertyType</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            {properties.map(property => {
                                                console.log(property, 'property');
                                                return (
                                                    <>

                                                        <tbody>
                                                            <tr>
                                                                <td>  {property.name && property.name} </td>
                                                                <td>{property.address && property.address}</td>
                                                                <td>  {property.status && property.status} </td>
                                                                <td> {property.zone && property.zone} </td>
                                                                <td> {property.propertyType && property.propertyType} </td>
                                                                <Button className='btn-gradient-primary py-2 px-3' onClick={() => handlePage(navigate(`/propertyDetails/${property._id}`, { state: { properties } }))} >Details</Button>
                                                            </tr>

                                                        </tbody>

                                                    </>
                                                )

                                            })}

                                        </Table>
                                    </>
                                )}
                            </div>
                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Property</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group controlId="propertyName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter name" value={editData?.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group controlId="propertyAddress">
                                            <Form.Label>Address</Form.Label>
                                            <Form.Control type="text" placeholder="Enter address" value={editData?.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group controlId="propertyStatus">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Control type="text" placeholder="Enter status" value={editData?.status} onChange={(e) => setEditData({ ...editData, status: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group controlId="propertyType">
                                            <Form.Label>Property Type</Form.Label>
                                            <Form.Control type="text" placeholder="Enter property type" value={editData?.propertyType} onChange={(e) => setEditData({ ...editData, propertyType: e.target.value })} />
                                        </Form.Group>
                                        <Form.Group controlId="propertyContactInfo">
                                            <Form.Label>Contact Info</Form.Label>
                                            <Form.Control type="text" placeholder="Enter contact info" value={editData?.contactinfo} onChange={(e) => setEditData({ ...editData, contactinfo: e.target.value })} />
                                        </Form.Group>
                                        <Button variant="primary" type="submit">
                                            Save Changes
                                        </Button>
                                    </Form>
                                </Modal.Body>
                            </Modal>
                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    );
};

export default AllProperties;
