import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Container, Table } from 'react-bootstrap';

function MyProperties() {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const apartments = properties.filter(property => property.propertyType === 'apartments');
    const houses = properties.filter(property => property.propertyType === 'house');

    return (
        <Container className="py-8">
            <h2 className="text-center text-uppercase">My Properties</h2>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {apartments.length > 0 && (
                        <>
                            <h3 className="text-uppercase">Apartments</h3>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Status</th>
                                        <th>Contact Info</th>
                                        <th>Floors</th>
                                        <th>Units</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apartments.map(property => (
                                        property.floors.map(floor => (
                                            <tr key={floor._id}>
                                                <td>{property.name}</td>
                                                <td>{property.address}</td>
                                                <td>{property.status}</td>
                                                <td>{property.contactinfo}</td>
                                                <td>{floor.name}</td>
                                                <td>
                                                    <ul>
                                                        {floor.units.map(unit => (
                                                            <li key={unit._id}>
                                                                {unit.name} - {unit.type} - {unit.occupied ? 'Occupied' : 'Vacant'}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                            </tr>
                                        ))
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                    {houses.length > 0 && (
                        <>
                            <h3 className="text-uppercase">Houses</h3>
                            <Table striped bordered hover>
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
                                            <td>{property.name}</td>
                                            <td>{property.address}</td>
                                            <td>{property.status}</td>
                                            <td>{property.contactinfo}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </>
                    )}
                </>
            )}
        </Container>
    );
}

export default MyProperties;
