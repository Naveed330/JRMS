import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import SideBar from '../../Components/SideBar';

const Search = () => {
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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <div className='mt-5'>
                    {/* Select for owners */}
                    <div>
                        <h4>Search Owner</h4>
                        <input
                            type="text"
                            placeholder="Search owner..."
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

                    {/* Select for property names */}
                    <div>
                        <h4>Search Property</h4>
                        <input
                            type="text"
                            placeholder="Search property..."
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

                    {/* Select for floors */}
                    <div>
                        <h4>Select Floor:</h4>
                        <input
                            type="text"
                            placeholder="Search floor..."
                            list="floorsList"
                            value={selectedFloor}
                            onChange={(e) => handleFloorChange(e.target.value)}
                        />
                        <datalist id="floorsList">
                            {floors.map((floor, index) => (
                                <option key={index} value={floor} />
                            ))}
                        </datalist>
                    </div>

                    <div>
                        <h4>Select Unit:</h4>
                        <input
                            type="text"
                            placeholder="Search unit..."
                            list="unitsList"
                            value={selectedUnit ? `${selectedUnit.unitNo} (${selectedUnit.type})` : ''}
                            onChange={(e) => handleUnitChange(e.target.value)}
                        />
                        <datalist id="unitsList">
                            {units.map((unit, index) => (
                                <option key={index} value={`${unit.unitNo} (${unit.type})`} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* Display all properties associated with the selected owner */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4>All Properties of {selectedOwner}:</h4>
                    <ul>
                        {ownerProperties.map((property, index) => (
                            <li key={index}>{property.name}</li>
                        ))}
                    </ul>
                </div>

                {/* Display all floors of the selected property */}
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h4>All Floors of {selectedProperty}:</h4>
                    <ul>
                        {floors.map((floor, index) => (
                            <li key={index}>{floor}</li>
                        ))}
                    </ul>
                </div>

                  {/* Display all units of the selected floor */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4>All Units of {selectedFloor}:</h4>
                <ul>
                    {units.map((unit, index) => (
                        <li key={index}>{`${unit.unitNo} (${unit.type})`}</li>
                    ))}
                </ul>
            </div>

            {/* Display selected values in cards */}
            <div style={{ display: 'flex', gap: '20px' }}>
                {/* ... (previous JSX code for displaying selected values remains the same) */}
            </div>


                {/* Display selected values in cards */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    {/* Owner Card */}
                    <div className="card">
                        <h4>Selected Owner:</h4>
                        <p>{selectedOwner}</p>
                    </div>

                    {/* Property Card */}
                    <div className="card">
                        <h4>Selected Property:</h4>
                        <p>{selectedProperty}</p>
                    </div>

                    {/* Floor Card */}
                    <div className="card">
                        <h4>Selected Floor:</h4>
                        <p>{selectedFloor}</p>
                    </div>

                    {/* Unit Card */}
                    <div className="card">
                        <h4>Selected Unit:</h4>
                        <p>
                            {selectedUnit ? `${selectedUnit.unitNo} (${selectedUnit.type})` : ''}
                        </p>
                    </div>
                </div>

                {/* Property Details Card */}
                {selectedProperty && (
                    <div className="card">
                        <h4>Property Details:</h4>
                        <p>Name: {selectedProperty}</p>
                    </div>
                )}

                {/* Floor Details Card */}
                {selectedFloor && (
                    <div className="card">
                        <h4>Floor Details:</h4>
                        <p>Name: {selectedFloor}</p>
                    </div>
                )}

                {/* Unit Details Card */}
                {selectedUnit && (
                    <div className="card">
                        <h4>Unit Details:</h4>
                        <p>Unit No: {selectedUnit.unitNo}</p>
                        <p>Type: {selectedUnit.type}</p>
                    </div>
                )}
        </>
    );
}

export default Search;
