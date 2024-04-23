import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Card, Col, Row } from 'react-bootstrap';
import AdminSideBar from '../../Components/AdminSideBar';

const AdminMaintenanceCost = () => {
    const { state } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        owner: '',
        property: '',
        floor: '',
        unit: '',
        maintenanceType: '',
        amount: '',
        date: '',
        image: null
    });

    const [owners, setOwners] = useState([]);
    const [properties, setProperties] = useState({});
    const [floors, setFloors] = useState([]);
    const [units, setUnits] = useState([]);
    const [error, setError] = useState('');
    const [ownerProperties, setOwnerProperties] = useState([]);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allproperties', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });

                const uniqueOwners = Array.from(new Set(response.data.map(property => property.user)));
                setOwners(uniqueOwners);

                const propertiesByOwner = {};
                uniqueOwners.forEach(owner => {
                    propertiesByOwner[owner._id] = response.data.filter(property => property.user._id === owner._id);
                });
                setProperties(propertiesByOwner);

                setOwnerProperties(response.data);
            } catch (error) {
                setError('Failed to fetch properties');
                console.error('Failed to fetch properties:', error);
            }
        };

        fetchProperties();
    }, [state.user.token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        const selectedProperty = ownerProperties.find(property => property._id === propertyId);

        if (selectedProperty) {
            setFormData(prevState => ({
                ...prevState,
                property: selectedProperty._id,
                floor: '',
                unit: ''
            }));

            const floorsForProperty = selectedProperty.floors.map(floor => floor._id);  // Use floor ID
            setFloors(floorsForProperty);
        } else {
            console.error('Selected property not found');
        }
    };

    const handleFloorChange = (e) => {
        const floorId = e.target.value;
        setFormData(prevState => ({ ...prevState, floor: floorId, unit: '' }));
    };

    const handleUnitChange = (e) => {
        const unitId = e.target.value;
        setFormData(prevState => ({ ...prevState, unit: unitId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('owner', formData.owner);
        formDataToSend.append('property', formData.property);
        formDataToSend.append('floor', formData.floor);
        formDataToSend.append('unit', formData.unit);
        formDataToSend.append('maintenanceType', formData.maintenanceType);
        formDataToSend.append('amount', formData.amount);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('image', formData.image);

        try {
            const response = await axios.post('/api/maintenance/addnewcost', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${state.user.token}`
                }
            });

            console.log('Maintenance cost added successfully:', response.data);
            setFormData({
                owner: '',
                property: '',
                floor: '',
                unit: '',
                maintenanceType: '',
                amount: '',
                date: '',
                image: null
            });
        } catch (error) {
            console.error('Error adding maintenance cost:', error);
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

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div className="bold text-center text-uppercase" style={{ marginTop: '95px' }}>
                                    <h3 >Add Maintaince Cost</h3>
                                </div>
                                <Card.Body>

                                    <form onSubmit={handleSubmit}>
                                        <div className="row" >
                                            <div className="mb-3 col-md-6">
                                                <label>Owner:</label>
                                                <select name="owner" className='w-100 py-2 px-1' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} value={formData.owner} onChange={(e) => {
                                                    const ownerId = e.target.value;
                                                    setFormData(prevState => ({ ...prevState, owner: ownerId, property: '', floor: '', unit: '' }));
                                                }}>
                                                    <option value="">Select Owner</option>
                                                    {owners.map((owner) => (
                                                        <option key={owner._id} value={owner._id}>
                                                            {owner.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label>Property:</label>
                                                <select name="property" className='w-100 py-2 px-1' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} value={formData.property} onChange={handlePropertyChange}>
                                                    <option value="">Select Property</option>
                                                    {properties[formData.owner]?.map(property => (
                                                        <option key={property._id} value={property._id}>
                                                            {property.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label>Floor:</label>
                                                <select name="floor" className='w-100 py-2 px-1' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} value={formData.floor} onChange={handleFloorChange}>
                                                    <option value="">Select Floor</option>
                                                    {floors.map((floorId) => (
                                                        <option key={floorId} value={floorId}>
                                                            {properties[formData.owner]?.find(p => p._id === formData.property)?.floors.find(f => f._id === floorId)?.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6"  >
                                                <label>Unit:</label>
                                                <select name="unit" className='w-100 py-2 px-1' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} value={formData.unit} onChange={handleUnitChange}>
                                                    <option value="">Select Unit</option>
                                                    {formData.floor && properties[formData.owner]?.find(p => p._id === formData.property)?.floors.find(f => f._id === formData.floor)?.units.map(unit => (
                                                        <option key={unit._id} value={unit._id}>
                                                            {unit.unitNo} / {unit.type}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label>Maintenance Type:</label>
                                                <input type="text" name="maintenanceType" style={{ borderRadius: '10px' }} className="form-control" value={formData.maintenanceType} onChange={handleChange} required />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label>Amount:</label>
                                                <input type="number" name="amount" style={{ borderRadius: '10px' }} className="form-control" value={formData.amount} onChange={handleChange} required />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label>Date:</label>
                                                <input type="date" name="date" style={{ borderRadius: '10px' }} className="form-control" value={formData.date} onChange={handleChange} required />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label>Image:</label>
                                                <input type="file" name="image" style={{ borderRadius: '10px' }} className="form-control" onChange={handleImageChange} required />
                                            </div>

                                        </div>
                                        <Button variant="success" type="submit">Submit</Button>
                                        {/* <button type="submit">Submit</button> */}
                                    </form>

                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                </Col>

            </Row>
        </div>
    );
};

export default AdminMaintenanceCost;
















