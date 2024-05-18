import React, { useState, useEffect, useContext, } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Modal, Form, Table, Row, Col, Spinner, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../Components/SideBar';
import { toast } from 'react-toastify';
import { GrLocation, GrStatusGood } from "react-icons/gr";
import { BiSolidCity } from "react-icons/bi";
import { AiFillPropertySafety } from "react-icons/ai";
import { GiSightDisabled } from "react-icons/gi";
import { Link } from 'react-router-dom'
import { AiOutlineDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import Propertysearch from '../../Components/PropertySearch'
const AllProperties = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editData, setEditData] = useState({});
    const navigate = useNavigate()

    console.log(properties, 'propertiesproperties')

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
                            {
                                properties.length > 0 ? <>
                                    <div>
                                        <h1 className='text-center' style={{ marginTop: '70px' }} > All Properties </h1>
                                        {/* <Propertysearch /> */}
                                        {loading ? (
                                            <div style={{ display: 'flex', justifyContent: 'center' }} >
                                                <Spinner animation="border" size="md" style={{ color: 'green' }} />
                                            </div>

                                        ) : error ? (
                                            toast.error('Properties Not Found')
                                        ) : (
                                            <>
                                                <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', flexWrap: 'wrap' }} >
                                                    {properties.map(property => {
                                                        console.log(property, 'propertyproperty')
                                                        return (
                                                            <>
                                                                <Card className='mt-3 mb-5' style={{ width: '23rem', height: '28rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }} >
                                                                        <Card.Img variant="top" style={{ width: '100%', height: '180px' }} src={property.propertyImage && property.propertyImage} alt='Property_image' />
                                                                    </div>

                                                                    <Card.Body>
                                                                        <Card.Title>
                                                                            <div className='text-center' >
                                                                                <h3>
                                                                                    {property.name && property.name || property.buildingname && property.buildingname}
                                                                                </h3>
                                                                            </div>
                                                                        </Card.Title>


                                                                        <Card.Text>
                                                                            <ul style={{ listStyle: 'none' }} >
                                                                                <li>
                                                                                    <AiFillPropertySafety />   {property.user.name && property.user.name}
                                                                                </li>
                                                                                <li>
                                                                                    <AiFillPropertySafety />   {property.propertyType && property.propertyType}
                                                                                </li>

                                                                                <li>
                                                                                    <BiSolidCity />   {property.zone && property.zone}
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





                                                                            </ul>
                                                                        </Card.Text>
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                                                            <Link style={{ textDecoration: 'none', textAlign: 'center' }} className='btn-gradient-primary py-2 px-3' to={`/singleproperty/${property._id}`} >Details</Link>
                                                                            <div style={{ display: 'flex', gap: '15px' }} >
                                                                                <FiEdit style={{ cursor: 'pointer', fontSize: '20px', color: '#008f00' }} onClick={() => handleEdit(property)} />
                                                                                <AiOutlineDelete style={{ cursor: 'pointer', fontSize: '20px', color: '#e03c3e' }} onClick={() => handleDelete(property._id)} />
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
                                </> : <div style={{ marginTop: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                    <Card>
                                        <Card.Body>
                                            <Card.Title style={{ fontSize: '30px', textAlign: 'center' }} > No properties</Card.Title>
                                            <p style={{ fontWeight: 500 }} >Sorry! No properties found. You have to add properties from below Link</p>
                                            <div style={{ display: 'flex', justifyContent: 'center', }} >
                                                <Button style={{ borderRadius: '20px' }} onClick={() => navigate('/addproperty')} >Add Properties</Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>
                            }


                            <Modal show={showModal} onHide={() => setShowModal(false)}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edit Property</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <div style={{ display: 'flex', gap: '10px' }} >
                                            <Form.Group controlId="propertyName">
                                                <Form.Label>Property Type</Form.Label>
                                                <Form.Control type="text" placeholder="PropertyType" value={editData?.propertyType} onChange={(e) => setEditData({ ...editData, propertyType: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyName" className='w-50' >
                                                <Form.Label>Emirates</Form.Label>
                                                <select className="form-control py-3" name="zone" value={editData?.zone} onChange={(e) => setEditData({ ...editData, zone: e.target.value })}  >
                                                    <option value="">Select Zone</option>
                                                    <option value="AbuDhabi">Abu Dhabi</option>
                                                    <option value="Sharjah">Sharjah</option>
                                                    <option value="Ajman">Ajman</option>
                                                    <option value="RasAlKhaimah">Ras Al Khaimah </option>
                                                    <option value="Fujairah">Fujairah</option>
                                                    <option value="UmmAlQuwain">Umm Al Quwain</option>
                                                    <option value="Dubai">Dubai</option>
                                                </select>
                                            </Form.Group>

                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>
                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Municipality</Form.Label>
                                                <Form.Control type="text" placeholder="Municipality" value={editData?.municipality} onChange={(e) => setEditData({ ...editData, municipality: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Property Name</Form.Label>
                                                <Form.Control type="text" placeholder="Municipality" value={editData?.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>
                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Sector</Form.Label>
                                                <Form.Control type="text" placeholder="Sector" value={editData?.sector} onChange={(e) => setEditData({ ...editData, sector: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Road Name</Form.Label>
                                                <Form.Control type="text" placeholder="Road Name" value={editData?.roadName} onChange={(e) => setEditData({ ...editData, roadName: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Plot No.</Form.Label>
                                                <Form.Control type="text" placeholder="Plot No" value={editData?.plotNo} onChange={(e) => setEditData({ ...editData, plotNo: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Plot Address</Form.Label>
                                                <Form.Control type="text" placeholder="Plot Address" value={editData?.plotAddress} onChange={(e) => setEditData({ ...editData, plotAddress: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Onwani Address</Form.Label>
                                                <Form.Control type="text" placeholder="Onwani Address" value={editData?.onwaniAddress} onChange={(e) => setEditData({ ...editData, onwaniAddress: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Property No</Form.Label>
                                                <Form.Control type="text" placeholder="Property No" value={editData?.propertyno} onChange={(e) => setEditData({ ...editData, propertyno: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Property Registration No</Form.Label>
                                                <Form.Control type="text" placeholder="Property Registration No" value={editData?.propertyRegistrationNo} onChange={(e) => setEditData({ ...editData, propertyRegistrationNo: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Contact Person Name</Form.Label>
                                                <Form.Control type="text" placeholder="Property Registration No" value={editData?.cname} onChange={(e) => setEditData({ ...editData, cname: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Contact Email</Form.Label>
                                                <Form.Control type="text" placeholder="Contact Email" value={editData?.cemail} onChange={(e) => setEditData({ ...editData, cemail: e.target.value })} />
                                            </Form.Group>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Contact Mobile</Form.Label>
                                                <Form.Control type="text" placeholder="Contact Mobile" value={editData?.ccontact} onChange={(e) => setEditData({ ...editData, ccontact: e.target.value })} />
                                            </Form.Group>
                                        </div>

                                        <div style={{ display: 'flex', gap: '10px' }} className='mt-2'>

                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Contact Address</Form.Label>
                                                <Form.Control type="text" placeholder="Address" value={editData?.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })} />
                                            </Form.Group>


                                            <Form.Group controlId="propertyAddress">
                                                <Form.Label>Service Charges</Form.Label>
                                                <Form.Control type="text" placeholder="Service Charges" value={editData?.joveracommission} onChange={(e) => setEditData({ ...editData, joveracommission: e.target.value })} />
                                            </Form.Group>
                                        </div>


                                        <Button variant="primary" type="submit" className='mt-4' >
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

