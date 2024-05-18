import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import OwnerSideBar from '../../Components/OwnerSideBar';
import { RxTable } from 'react-icons/rx';
import { BsGrid } from 'react-icons/bs';
import { Link } from 'react-router-dom';

function MyProperties() {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('table');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/myproperties', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setProperties(response.data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProperties();
    }, [state.user.token]);

    const apartments = properties.filter(property => property.propertyType === 'Apartments');
    const houses = properties.filter(property => property.propertyType === 'house');

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <OwnerSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '100px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }} >
                                <h3>All Properties</h3>
                                <div style={{ display: 'flex', gap: '10px' }} >
                                    <Button onClick={() => setView('grid')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} > <BsGrid style={{ fontSize: '15px', cursor: 'pointer' }} /> Grid View</Button>
                                    <Button onClick={() => setView('table')} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }} >  <RxTable style={{ fontSize: '15px', cursor: 'pointer' }} /> Table View</Button>
                                </div>
                            </div>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    {
                                        view === 'table' ?
                                            <>
                                                {apartments.length > 0 && (
                                                    <>
                                                        <h4 className=" mt-3">Apartments</h4>
                                                        <Table striped bordered hover responsive className='mb-5' >
                                                            <thead style={{ backgroundColor: '#005f75' }} >
                                                                <tr style={{ color: 'white' }} >
                                                                    <th>Name</th>
                                                                    <th>Address</th>
                                                                    <th>Status</th>
                                                                    <th>Contact Info</th>
                                                                    <th>Floors</th>
                                                                    <th>Units</th>
                                                                    <th>Image</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {apartments.map(property => (
                                                                    property.floors.map(floor => (
                                                                        <tr key={floor._id}>
                                                                            <td>{property.name && property.name}</td>
                                                                            <td>{property.address && property.address}</td>
                                                                            <td>{property.status && property.status}</td>
                                                                            <td>{property.contactinfo && property.contactinfo}</td>
                                                                            <td>{floor.name && floor.name}</td>
                                                                            <td>
                                                                                <ul>
                                                                                    {floor.units.map(unit => (
                                                                                        <li key={unit._id}>
                                                                                            {unit.name && unit.name} - {unit.type && unit.type} - {unit.occupied ? 'Occupied' : 'Vacant'}
                                                                                        </li>
                                                                                    ))}
                                                                                </ul>
                                                                            </td>
                                                                            <td> <img src={property.propertyImage} alt="propertyImage" style={{ maxWidth: '100px' }} /> </td>
                                                                        </tr>
                                                                    ))
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                )}
                                                {houses.length > 0 && (
                                                    <>
                                                        <h3 className=" mt-3">Houses</h3>
                                                        <Table striped bordered hover responsive >
                                                            <thead>
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Address</th>
                                                                    <th>Status</th>
                                                                    <th>Contact Info</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {houses.map(property => (
                                                                    <tr key={property._id}>
                                                                        <td>{property.name && property.name}</td>
                                                                        <td>{property.address && property.address}</td>
                                                                        <td>{property.status && property.status}</td>
                                                                        <td>{property.contactinfo && property.contactinfo}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </Table>
                                                    </>
                                                )}
                                            </> :
                                            <div className='mt-4' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2%', flexWrap: 'wrap' }} >
                                                {apartments.length > 0 && (
                                                    <>
                                                        {apartments.map((gridProperty, index) => (
                                                            gridProperty.floors.map(floor => (
                                                                <Card className='mt-3 mb-5' style={{ width: '23rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                                        <Card.Img variant="top" src={gridProperty.propertyImage} alt={gridProperty.propertyImage} style={{ width: '150px', height: '120px' }} />
                                                                    </div>

                                                                    <Card.Body>
                                                                        <Card.Title style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{gridProperty.name}</Card.Title>
                                                                        <Card.Text style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'start' }}>
                                                                            Status: {gridProperty.status} <br />
                                                                            Contact: {gridProperty.contactinfo} <br />
                                                                            Address: {gridProperty.address} <br />

                                                                            <span>Floor: {floor.name && floor.name}</span>
                                                                            {floor.units.map(unit => (
                                                                                <div>
                                                                                    <span>{unit.name && unit.name} - {unit.type && unit.type} - {unit.occupied ? 'Occupied' : 'Vacant'}</span>
                                                                                </div>
                                                                            ))}
                                                                        </Card.Text>
                                                                        <Link style={{ textDecoration: 'none', textAlign: 'center' }} className='btn-gradient-primary py-2 px-3' to={`/ownerpropertiesdetails/${gridProperty._id}`} >Details</Link>
                                                                    </Card.Body>
                                                                </Card>
                                                            ))
                                                        ))}

                                                    </>
                                                )}

                                                {houses.length > 0 && (
                                                    <>
                                                        <h3 className="text-uppercase">Houses</h3>
                                                        {houses.map(property => (
                                                            <Card key={property._id} className='mt-3' style={{ width: '23rem', height: '23rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                                                <Card.Body>
                                                                    Name : {property.name}
                                                                    Address : {property.address}
                                                                    Status : {property.status}
                                                                    Contactinfo :  {property.contactinfo}
                                                                </Card.Body>
                                                            </Card>
                                                        ))}
                                                    </>
                                                )}

                                            </div>
                                    }
                                </>
                            )}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default MyProperties;