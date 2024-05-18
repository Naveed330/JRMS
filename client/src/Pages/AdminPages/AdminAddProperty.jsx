import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Button, Card, Col, Row } from 'react-bootstrap';
import AdminSideBar from '../../Components/AdminSideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddProperty() {
    const { state } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        cname: '',
        ccontact: '',
        cemail: '',
        userId: '',
        address: '',
        status: 'Enable',
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
        propertyRegistrationNo: '',
        city: '',
        area: '',
        bondtype: '',
        bondno: '',
        bonddate: '',
        govermentalno: '',
        pilotno: '',
        buildingname: '',
        nameandstreet: '',
        propertytype: '',
        description: '',
        propertyno: '',
    });

    const [owners, setOwners] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedZone, setSelectedZone] = useState('');

    const handleZoneChange = (e) => {
        setSelectedZone(e.target.value);
    };
    useEffect(() => {
        axios.get('/api/users/all-owners-for-admin', {
            headers: {
                Authorization: `Bearer ${state.user.token}`
            }
        })
            .then(response => {
                setOwners(response.data);
            })
            .catch(error => {
                setError('Failed to fetch owners');
                console.error('Failed to fetch owners:', error);
            });
    }, [state.user.token]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
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
    
            const response = await axios.post('/api/properties/addpropertyforadmin', formDataWithImage, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${state.user.token}`
                }
            });
    
            if (response.status === 201) {
                toast.success('Property added successfully');
            } else if (response.data && response.data.message) {
                toast.success(response.data.message);
            } else {
                toast.error('Unknown error occurred');
            }
    
            setFormData({
                name: '',
                userId: '',
                address: '',
                status: 'Enable',
                propertyType: '',
                contactinfo: '',
                image: null,
                zone: '',
                municipality: '',
                sector: '',
                roadName: '',
                plotNo: '',
                plotAddress: '',
                onwaniAddress: '',
                propertyNo: '',
                propertyRegistrationNo: '',
                city: '',
                area: '',
                bondtype: '',
                bondno: '',
                bonddate: '',
                govermentalno: '',
                pilotno: '',
                buildingname: '',
                nameandstreet: '',
                propertytype: '',
                description: ''
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error adding property');
                console.error('Error adding property:', error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                    <AdminSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}  >

                            <h2 className='text-center'>Add Property</h2>
                            <form onSubmit={handleSubmit} className='py-2 px-5' style={{ backgroundColor: 'white', borderRadius: '20px' }}>
                                <div className="row">
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                                            <Card.Body>
                                                <Card.Title>Select Property</Card.Title>
                                                <div className="row" >
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Emirates</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control py-3" name="zone" value={formData.zone} onChange={(e) => { handleChange(e); handleZoneChange(e); }} required>
                                                            <option value="">Select Zone</option>

                                                            <option value="AbuDhabi">Abu Dhabi</option>
                                                            <option value="Sharjah">Sharjah</option>
                                                            <option value="Ajman">Ajman</option>
                                                            <option value="RasAlKhaimah">Ras Al Khaimah </option>
                                                            <option value="Fujairah">Fujairah</option>
                                                            <option value="UmmAlQuwain">Umm Al Quwain</option>
                                                            <option value="Dubai">Dubai</option>
                                                        </select>
                                                    </div>

                                                    {/* {selectedZone === 'AbuDhabi' && (
                                                    <> */}
                                                    <div className="mb-3 col-md-3" >
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Municipality</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="municipality" value={formData.municipality} onChange={handleChange} required />
                                                    </div>

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Owner Name</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control p-3" name="userId" value={formData.userId} onChange={handleChange} required>
                                                            <option value="">Select Owner</option>
                                                            {owners.map(owner => (
                                                                <option key={owner._id} value={owner._id}>{owner.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}> Property Name</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="name" value={formData.name} onChange={handleChange}  required/>
                                                    </div>

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Property Type</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control py-3" name="propertyType" value={formData.propertyType} onChange={handleChange} required>
                                                            <option value="">Select Property Type</option>
                                                            <option value="Apartments">Apartments</option>
                                                            <option value="Villa">Villas</option>
                                                            <option value="Town House">Town House</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                            <Card.Body>
                                                <Card.Title>Contact Details</Card.Title>
                                                <div className='row' >
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Contact Person Name </label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="cname" value={formData.cname} onChange={handleChange} required />
                                                    </div>

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Contact Email </label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="cemail" value={formData.cemail} onChange={handleChange} required />
                                                    </div>
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Contact Person Mobile</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="ccontact" value={formData.ccontact} onChange={handleChange} required/>
                                                    </div>

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Address</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                            <Card.Body>
                                                <Card.Title>property Address</Card.Title>
                                                <div className='row' >

                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Sector</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="sector" value={formData.sector} onChange={handleChange} required/>
                                                    </div>
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Road Name</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="roadName" value={formData.roadName} onChange={handleChange}  required/>
                                                    </div>
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Plot No.</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="plotNo" value={formData.plotNo} onChange={handleChange} />
                                                    </div>
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Plot Address</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="plotAddress" value={formData.plotAddress} onChange={handleChange} />
                                                    </div>
                                                    <div className="mb-3 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Onwani Address</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="onwaniAddress" value={formData.onwaniAddress} onChange={handleChange} required/>
                                                    </div>
                                                    <div className="mb-4 col-md-3">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Property No</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="propertyNo" value={formData.propertyNo} onChange={handleChange} />
                                                    </div>
                                                    <div className="mb-3 col-md-3" >
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Property Registration No</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="propertyRegistrationNo" value={formData.propertyRegistrationNo} onChange={handleChange} />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                            <Card.Body>
                                                <Card.Title>Status</Card.Title>
                                                <div className='row' >
                                                    <div className="mb-3 col-md-6">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Status</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control py-3" name="status" value={formData.status} onChange={handleChange} required>
                                                            <option value="Enable">Enable</option>
                                                            <option value="Disable">Disable</option>
                                                        </select>
                                                    </div>

                                                    <div className="mb-3 col-md-6">
                                                        <label className="form-label" style={{ fontWeight: '500' }}>Image:</label>
                                                        <input style={{ borderRadius: '10px' }} type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>

                                    <div className="mt-4">
                                        <Button variant="primary" type="submit" disabled={isLoading} className='mb-5'>
                                            {isLoading ? 'Adding Property...' : 'Add Property'}
                                        </Button>
                                    </div>




                                    {/* <div className="mb-3 col-md-6">
                                                    <label className="form-label" style={{ fontWeight: 'bold' }}>Owner:</label>
                                                    <select className="form-control p-3" name="userId" value={formData.userId} onChange={handleChange}>
                                                        <option value="">Select Owner</option>
                                                        {owners.map(owner => (
                                                            <option key={owner._id} value={owner._id}>{owner.name}</option>
                                                        ))}
                                                    </select>
                                                </div> */}

                                    {/* <div className="mb-3 col-md-6">
                                        <label className="form-label" style={{ fontWeight: 'bold' }}>Status</label>
                                        <select className="form-control py-3" name="status" value={formData.status} onChange={handleChange}>
                                            <option value="enable">Enable</option>
                                            <option value="disable">Disable</option>
                                        </select>
                                    </div> */}

                                    {/* <div className="mb-3 col-md-6">
                                                    <label className="form-label" style={{ fontWeight: 'bold' }}>Property Type:</label>
                                                    <select className="form-control py-3" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                                                        <option value="">Select Property Type</option>
                                                        <option value="apartments">Apartments</option>
                                                    </select>
                                                </div> */}


                                    {/* {selectedZone === 'Sharjah' && (
                                                    <>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>City </label>
                                                            <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Area </label>
                                                            <input type="text" className="form-control" name="area" value={formData.area} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Bond Type:</label>
                                                            <input type="text" className="form-control" name="bondtype" value={formData.bondtype} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Bond No:</label>
                                                            <input type="text" className="form-control" name="bondno" value={formData.bondno} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Bond Date:</label>
                                                            <input type="date" className="form-control" name="bonddate" value={formData.bonddate} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Governmental No:</label>
                                                            <input type="text" className="form-control" name="govermentalno" value={formData.govermentalno} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Pilot No:</label>
                                                            <input type="text" className="form-control" name="pilotno" value={formData.pilotno} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Building Name:</label>
                                                            <input type="text" className="form-control" name="buildingname" value={formData.buildingname} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Name and Street:</label>
                                                            <input type="text" className="form-control" name="nameandstreet" value={formData.nameandstreet} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property Type:</label>
                                                            <input type="text" className="form-control" name="propertytype" value={formData.propertytype} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Description</label>
                                                            <input type="text" className="form-control" name="description" value={formData.description} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property No </label>
                                                            <input type="text" className="form-control" name="propertyno" value={formData.propertyno} onChange={handleChange} />
                                                        </div>
                                                    </>
                                                )} */}


                                    {/* {selectedZone === 'AbuDhabi' && (
                                                    <>

                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Name:</label>
                                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Zone</label>
                                                            <input type="text" className="form-control" name="municipality" value={formData.municipality} onChange={handleChange} />
                                                        </div>

                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Sector:</label>
                                                            <input type="text" className="form-control" name="sector" value={formData.sector} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Road Name:</label>
                                                            <input type="text" className="form-control" name="roadName" value={formData.roadName} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Plot No:</label>
                                                            <input type="text" className="form-control" name="plotNo" value={formData.plotNo} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Plot Address:</label>
                                                            <input type="text" className="form-control" name="plotAddress" value={formData.plotAddress} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Onwani Address:</label>
                                                            <input type="text" className="form-control" name="onwaniAddress" value={formData.onwaniAddress} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6">
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property No:</label>
                                                            <input type="text" className="form-control" name="propertyNo" value={formData.propertyNo} onChange={handleChange} />
                                                        </div>
                                                        <div className="mb-3 col-md-6" >
                                                            <label className="form-label" style={{ fontWeight: 'bold' }}>Property Registration No:</label>
                                                            <input type="text" className="form-control" name="propertyRegistrationNo" value={formData.propertyRegistrationNo} onChange={handleChange} />
                                                        </div>
                                                    </>
                                                )} */}

                                </div>
                            </form>
                            <ToastContainer position="top-right" autoClose={5000} />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
}

export default AddProperty;