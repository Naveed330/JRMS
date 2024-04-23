import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Spinner, Table } from 'react-bootstrap';
import { GrAdd, GrLocation, GrStatusGood } from 'react-icons/gr';
import { GiSightDisabled } from 'react-icons/gi';
import { BiSolidCity } from 'react-icons/bi';
import { AiFillPropertySafety } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Pages/AuthContext';

const Propertysearch = () => {
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
    const [showModal, setShowModal] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState('');

    useEffect(() => {
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

    const openModal = (apartmentId) => {
        setSelectedApartmentId(apartmentId);
        setShowModal(true);
    };

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
                                        <td>
                                            <Button variant="success" size='sm' onClick={() => openModal()}>
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
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }} >
                                        <Button variant="success" size='sm' onClick={() => openModal()}>
                                            <GrAdd style={{ fontSize: '15px', cursor: 'pointer' }} />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}

export default Propertysearch;