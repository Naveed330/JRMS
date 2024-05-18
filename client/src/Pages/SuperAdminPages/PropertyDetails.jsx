import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Modal, Form } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { BiArrowBack } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { RxCross1 } from "react-icons/rx";
import './propertyDetail.css'
import { FiEdit } from 'react-icons/fi';

const PropertyDetails = () => {
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { state } = useContext(AuthContext);
    const [editData, setEditData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [properties, setProperties] = useState([]);
    const { id } = useParams();

    console.log(property, 'property');

    // Floors Length
    const totalFloors = property?.floors ? property.floors.length : 0;

    // Units Length
    let totalUnits = 0;

    // Check if property exists and it has floors
    if (property && property.floors && Array.isArray(property.floors)) {
        // Iterate through each floor
        property.floors.forEach((floor) => {
            console.log(floor, 'floorlength');
            // Check if floor has units
            if (floor.units && Array.isArray(floor.units)) {
                // Add the number of units in this floor to the total 
                totalUnits += floor.units.length;
            }
        });
    }
    const fetchPropertyDetails = async () => {
        try {
            const response = await axios.get(`/api/properties/singleproperty/${id}`, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            console.log(response.data, 'responsedata');
            setProperty(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch property details');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPropertyDetails();
    }, [state.user.token, id]);

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
            await axios.put(`/api/properties/edit/${editData._id}`, editData, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`,
                },
            });
            setProperties(properties.map(property => property._id === editData._id ? editData : property));
            setShowModal(false);
            fetchPropertyDetails();
        } catch (error) {
            console.error('Error editing property:', error);
            // Handle error, show a toast or message to the user
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!property) return <div>No property found</div>;

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '80px' }}>
                    <div className='mt-3' >
                        <Button onClick={() => handleEdit(property)}>Edit Property</Button>
                    </div>

                    <Row>
                        <Col xs={12} sm={12} md={12} lg={11} xl={11}>
                        <Table striped hover bordered responsive className='mt-3'>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th colSpan={4} style={{ color: 'white' }}>Owner Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} >User Name</td>
                                        <td >{property?.user?.name}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} >Contact</td>
                                        <td >{property?.user?.contact}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} >Email</td>
                                        <td >{property?.user?.email}</td>
                                    </tr>
                                </tbody>
                            </Table>
                            <Table striped hover bordered responsive className='mt-3'>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th colSpan={6} style={{ color: 'white' }}>Property Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={2}>Name</td>
                                        <td>{property.name}</td>
                                        <td colSpan={2}>Municipality</td>
                                        <td>{property.municipality}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>Zone</td>
                                        <td>{property.zone}</td>
                                        <td colSpan={2}>Sector</td>
                                        <td>{property.sector}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} >Address</td>
                                        <td >{property.onwaniAddress}</td>
                                        <td colSpan={2} >Property No</td>
                                        <td >{property.propertyNo}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2} >Plot Address</td>
                                        <td >{property.plotAddress}</td>
                                        <td colSpan={2} >Property Type</td>
                                        <td >{property.propertyType}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={11} xl={11}>
                            {/* <Table striped hover bordered responsive className='mt-3'>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th colSpan={4} style={{ color: 'white' }}>Owner Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', fontWeight: '700' }}>User Name</td>
                                        <td style={{ textAlign: 'center' }}>{property?.user?.name}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', fontWeight: '700' }}>Contact</td>
                                        <td style={{ textAlign: 'center' }}>{property?.user?.contact}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} style={{ textAlign: 'center', fontWeight: '700' }}>Email</td>
                                        <td style={{ textAlign: 'center' }}>{property?.user?.email}</td>
                                    </tr>
                                </tbody>
                            </Table> */}

                            {/* Contact Person TABLE */}
                            <Table striped hover bordered responsive className='mt-3'>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th colSpan={4} style={{ color: 'white' }}>Contact Person Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3}>Name</td>
                                        <td >{property?.cname}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}>Contact</td>
                                        <td>{property?.ccontact}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} >Email</td>
                                        <td>{property?.cemail}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* Total Number of Floors */}
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div style={{ display: 'flex', justifyContent: 'space-evenly' }} className='mt-4' >
                                <h3> {`Total Floors : ${totalFloors && totalFloors}`} </h3>
                                <h3 >{`Total Units :  ${totalUnits && totalUnits ? totalUnits : 'Currently No Units Available'}`} </h3>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12} sm={12} md={12} lg={6} xl={6}>
                            <h4>Occupied Units</h4>
                            <div>
                                <Table bordered hover responsive striped  >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <tr>
                                            <th style={{ color: '#ffff' }}>Floor</th>
                                            <th style={{ color: '#ffff' }}>Type</th>
                                            <th style={{ color: '#ffff' }}>Unit Reg No</th>
                                            <th style={{ color: '#ffff' }}>Unit No</th>
                                            <th style={{ color: '#ffff' }}> Premise No</th>
                                            <th style={{ color: '#ffff' }}>Occupied</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Iterate through floors */}
                                        {property.floors.map((item) => {
                                            const hasUnoccupiedUnits = item.units.some(unit => unit.occupied);
                                            if (hasUnoccupiedUnits) {
                                                return item.units
                                                    .filter(singleUnit => singleUnit.occupied)
                                                    .map(singleUnit => (
                                                        <tr key={singleUnit.unitRegNo && singleUnit.unitRegNo}>
                                                            <td>{item.name && item.name}</td>
                                                            <td>{singleUnit.type && singleUnit.type}</td>
                                                            <td>{singleUnit.unitRegNo && singleUnit.unitRegNo}</td>
                                                            <td>{singleUnit.unitNo && singleUnit.unitNo}</td>
                                                            <td>{singleUnit.premiseNo && singleUnit.premiseNo}</td>
                                                            <td><TiTick style={{ color: 'green', fontSize: '25px' }} /></td>
                                                        </tr>
                                                    ));
                                            }
                                            // If no unoccupied units, return null
                                            return null;
                                        })}
                                    </tbody>
                                </Table>

                            </div>
                        </Col>

                        <Col xs={12} sm={12} md={12} lg={6} xl={5}>
                            <h4>Available Units</h4>
                            <div>
                                <Table bordered hover responsive striped >
                                    <thead style={{ backgroundColor: '#005f75' }}>
                                        <tr>
                                            <th style={{ color: '#ffff' }}>Floor</th>
                                            <th style={{ color: '#ffff' }}>Type</th>
                                            <th style={{ color: '#ffff' }}>Unit Reg No</th>
                                            <th style={{ color: '#ffff' }}>Unit No</th>
                                            <th style={{ color: '#ffff' }}>Premise No</th>
                                            <th style={{ color: '#ffff' }}>Occupied</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Iterate through floors */}
                                        {property.floors.map((item) => {
                                            const hasUnoccupiedUnits = item.units.some(unit => !unit.occupied);
                                            if (hasUnoccupiedUnits) {
                                                return item.units
                                                    .filter(singleUnit => !singleUnit.occupied)
                                                    .map(singleUnit => (
                                                        <tr key={singleUnit.unitRegNo && singleUnit.unitRegNo}>
                                                            <td>{item.name && item.name}</td>
                                                            <td>{singleUnit.type && singleUnit.type}</td>
                                                            <td>{singleUnit.unitRegNo && singleUnit.unitRegNo}</td>
                                                            <td>{singleUnit.unitNo && singleUnit.unitNo}</td>
                                                            <td>{singleUnit.premiseNo && singleUnit.premiseNo}</td>
                                                            <td><RxCross1 style={{ color: 'red', fontSize: '25px' }} /></td>
                                                        </tr>
                                                    ));
                                            }
                                            // If no unoccupied units, return null
                                            return null;
                                        })}
                                    </tbody>
                                </Table>

                            </div>
                        </Col>
                    </Row>

                </Col>
            </Row>

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
        </>
    );
};

export default PropertyDetails;



