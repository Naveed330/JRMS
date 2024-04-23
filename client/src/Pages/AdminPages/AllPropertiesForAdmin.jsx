import React, { useState, useEffect, useContext, } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Modal, Form, Table, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GrLocation, GrStatusGood } from "react-icons/gr";
import { BiSolidCity } from "react-icons/bi";
import { AiFillPropertySafety } from "react-icons/ai";
import { GiSightDisabled } from "react-icons/gi";
import { Link } from 'react-router-dom'
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import AdminSideBar from '../../Components/AdminSideBar';

const AllPropertiesForAdmin = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate()

    console.log(properties,'propertiesforAdmin');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allpropertiesforadmin', {
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
                        <AdminSideBar />
                    </div>
                </Col>


                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '95px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div>
                                <h2 className='mb-5 text-center'> All Properties </h2>
                                {loading ? (
                                    <div style={{ display: 'flex', justifyContent: 'center' }} >
                                        <Spinner animation="border" size="md" />
                                    </div>

                                ) : error ? (
                                    toast.error('Properties Not Found')
                                ) : (
                                    <>
                                        <h2 className='text-center' >Apartments</h2>
                                        <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap' }} >
                                            {properties.map(property => {
                                                return (
                                                    <>
                                                        <Card className='mt-4' style={{ width: '25rem', height: '28rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }} >
                                                                <Card.Img variant="top" style={{ width: '100%', height: '180px' }} src={property.propertyImage && property.propertyImage} alt='Property_image' />
                                                            </div>

                                                            <Card.Body>
                                                                <Card.Title>
                                                                    <div className='text-center' >
                                                                        <h3>
                                                                            {property.name && property.name}
                                                                        </h3>
                                                                    </div>
                                                                </Card.Title>


                                                                <Card.Text>
                                                                    <ul style={{ listStyle: 'none' }} >
                                                                        <li>
                                                                            <GrLocation /> {property.address && property.address}
                                                                        </li>

                                                                        <li>
                                                                            {property.status && property.status ?
                                                                                (property.status === 'enable' ?
                                                                                    <>
                                                                                        <GrStatusGood /> {property.status}
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <GiSightDisabled /> {property.status}
                                                                                    </>
                                                                                )
                                                                                :
                                                                                null
                                                                            }
                                                                        </li>


                                                                        <li>
                                                                            <BiSolidCity />   {property.zone && property.zone}
                                                                        </li>

                                                                        <li>
                                                                            <AiFillPropertySafety />   {property.propertyType && property.propertyType}
                                                                        </li>
                                                                    </ul>
                                                                </Card.Text>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                                                    <Link style={{ textDecoration: 'none', textAlign: 'center' }} className='btn-gradient-primary py-2 px-3' to={`/singlepropertyforadmin/${property._id}`} >Details</Link>
                                                                    <div style={{ display: 'flex', gap: '15px' }} >
                                                                        {/*  <FiEdit style={{ cursor: 'pointer', fontSize: '20px', color: '#008f00' }} onClick={() => handleEdit(property)} />
                                                                        <AiOutlineDelete style={{ cursor: 'pointer', fontSize: '20px', color: '#e03c3e' }} onClick={() => handleDelete(property._id)} />*/}
                                                                    </div>

                                                                </div>
                                                            </Card.Body>
                                                        </Card>
                                                    </>
                                                )
                                            })}
                                        </div>

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
export default AllPropertiesForAdmin;













