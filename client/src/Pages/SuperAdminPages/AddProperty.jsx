import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Row, Col, } from 'react-bootstrap'; // Import Bootstrap components
import SideBar from '../../Components/SideBar';

function AddProperty() {
    const { state } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        address: '',
        status: 'enable',
        propertyType: '',
        contactinfo: '',
        image: null,
        municipality: '',
        zone: '',
        sector: '',
        roadName: '',
        plotNo: '',
        plotAddress: '',
        onwaniAddress: '',
        propertyNo: '',
        propertyRegistrationNo: ''
    });

    const [owners, setOwners] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch all owners from the API
        axios.get('/api/users/all-owners', {
            headers: {
                Authorization: `Bearer ${state.user.token}`
            }
        })
            .then(response => {
                console.log(response.data); // Check the data received from the API
                setOwners(response.data);
            })
            .catch(error => {
                console.error('Failed to fetch owners:', error);
                setError('Failed to fetch owners');
            });
    }, [state.user.token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = e => {
        setFormData({
            ...formData,
            image: e.target.files[0]
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataWithImage = new FormData();
            for (let key in formData) {
                formDataWithImage.append(key, formData[key]);
            }

            await axios.post('/api/properties/addproperty', formDataWithImage, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${state.user.token}`
                }
            });

            setFormData({
                name: '',
                userId: '',
                address: '',
                status: 'enable',
                propertyType: '',
                contactinfo: '',
                image: null,
                municipality: '',
                zone: '',
                sector: '',
                roadName: '',
                plotNo: '',
                plotAddress: '',
                onwaniAddress: '',
                propertyNo: '',
                propertyRegistrationNo: ''
            });
        } catch (error) {
            console.error('Error adding property:', error);
            setError('Error adding property');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>


                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '70px' }} >
                    <Row xs={1} md={2} lg={3} className="mb-5">
                        <Col>
                            <div className="card py-3 " style={{ width: '90rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div className="card-body">

                                    <h1 className='text-center'>Add Property</h1>
                                    <form onSubmit={handleSubmit} className='py-2 px-5' style={{ backgroundColor: 'white', borderRadius: '20px' }}>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Name:</label>
                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Owner:</label>
                                            <select className="form-control p-3" name="userId" value={formData.userId} onChange={handleChange}>
                                                <option value="">Select Owner</option>
                                                {owners.map(owner => (
                                                    <option key={owner._id} value={owner._id}>{owner.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Address:</label>
                                            <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Status:</label>
                                            <select className="form-control py-3" name="status" value={formData.status} onChange={handleChange}>
                                                <option value="enable">Enable</option>
                                                <option value="disable">Disable</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Contact Info:</label>
                                            <input type="text" className="form-control" name="contactinfo" value={formData.contactinfo} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property Type:</label>
                                            <select className="form-control py-3" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                                                <option value="">Select Property Type</option>
                                                <option value="apartments">Apartments</option>
                                            </select>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Municipality:</label>
                                            <input type="text" className="form-control" name="municipality" value={formData.municipality} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Zone:</label>
                                            <input type="text" className="form-control" name="zone" value={formData.zone} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Sector:</label>
                                            <input type="text" className="form-control" name="sector" value={formData.sector} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Road Name:</label>
                                            <input type="text" className="form-control" name="roadName" value={formData.roadName} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Plot No:</label>
                                            <input type="text" className="form-control" name="plotNo" value={formData.plotNo} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Plot Address:</label>
                                            <input type="text" className="form-control" name="plotAddress" value={formData.plotAddress} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Onwani Address:</label>
                                            <input type="text" className="form-control" name="onwaniAddress" value={formData.onwaniAddress} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property No:</label>
                                            <input type="text" className="form-control" name="propertyNo" value={formData.propertyNo} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property Registration No:</label>
                                            <input type="text" className="form-control" name="propertyRegistrationNo" value={formData.propertyRegistrationNo} onChange={handleChange} />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Image:</label>
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                        </div>
                                        <div className="mb-3">
                                            <Button variant="primary" type="submit" disabled={isLoading}>
                                                {isLoading ? 'Adding Property...' : 'Add Property'}
                                            </Button>
                                        </div>
                                    </form>

                                    {error && <p className="text-danger">{error}</p>}
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default AddProperty;



