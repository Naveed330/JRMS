import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Spinner } from 'react-bootstrap';
import { GrLocation, GrStatusGood } from 'react-icons/gr';
import { GiSightDisabled } from 'react-icons/gi';
import { BiSolidCity } from 'react-icons/bi';
import { AiFillPropertySafety } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Pages/AuthContext';

const PropertySearchForAdmin = () => {
    const { state } = useContext(AuthContext);
    const [properties, setProperties] = useState([]);
    const [owners, setOwners] = useState([]);
    const [ownerProperties, setOwnerProperties] = useState([]);
    console.log(ownerProperties, 'ownerProperties');
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedFloor, setSelectedFloor] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allpropertiesforadmin', {
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
        fetchProperties();
    }, [state.user.token]);

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
                setUnits(selectedFloor.units || []); // Added null check here
            }
        }
    };

    const handleUnitChange = (unitString) => {
        // Find the unit object from the string representation
        const selectedUnitObject = units.find(unit => `${unit.unitNo} (${unit.type})` === unitString);

        // Update selectedUnit state
        setSelectedUnit(selectedUnitObject);
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                    {ownerProperties.map((selected, index) => {
                        if (selected.name === selectedProperty) {
                            return (
                                <Card key={index} className='mt-4' style={{ width: '23rem', height: '28rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }} >
                                        <Card.Img variant="top" style={{ width: '100%', height: '180px' }} src={selected.propertyImage} alt='Property_image' />
                                    </div>

                                    <Card.Body>
                                        <Card.Title>
                                            <div className='text-center' >
                                                <h3>{selected.name}</h3>
                                            </div>
                                        </Card.Title>

                                        <Card.Text>
                                            <ul style={{ listStyle: 'none' }} >
                                                <li><GrLocation /> {selected.address}</li>
                                                <li>{selected.status === 'enable' ? <GrStatusGood /> : <GiSightDisabled />} {selected.status}</li>
                                                <li><BiSolidCity /> {selected.zone}</li>
                                                <li><AiFillPropertySafety /> {selected.propertyType}</li>
                                            </ul>
                                        </Card.Text>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                            <Link style={{ textDecoration: 'none', textAlign: 'center' }} className='btn-gradient-primary py-2 px-3' to={`/singleproperty/${selected._id}`} >Details</Link>
                                        </div>
                                    </Card.Body>
                                </Card>
                            );
                        }
                        return null;
                    })}
                </div>
            )}

            {/* Display all properties associated with the selected owner */}
            {!selectedProperty && (
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px' }}>
                    {ownerProperties.map((property, index) => (
                        <Card key={index} className='mt-4' style={{ width: '23rem', height: '28rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }} >
                                <Card.Img variant="top" style={{ width: '100%', height: '180px' }} src={property.propertyImage} alt='Property_image' />
                            </div>

                            <Card.Body>
                                <Card.Title>
                                    <div className='text-center' >
                                        <h3>{property.name}</h3>
                                    </div>
                                </Card.Title>

                                <Card.Text>
                                    <ul style={{ listStyle: 'none' }} >
                                        <li><GrLocation /> {property.address}</li>
                                        <li>{property.status === 'enable' ? <GrStatusGood /> : <GiSightDisabled />} {property.status}</li>
                                        <li><BiSolidCity /> {property.zone}</li>
                                        <li><AiFillPropertySafety /> {property.propertyType}</li>
                                    </ul>
                                </Card.Text>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Link style={{ textDecoration: 'none', textAlign: 'center' }} className='btn-gradient-primary py-2 px-3' to={`/singleproperty/${property._id}`} >Details</Link>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </>
    );
}

export default PropertySearchForAdmin;