import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { addMonths, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { GrAdd } from 'react-icons/gr';
import { AiOutlineDelete } from 'react-icons/ai';
import { IoAdd } from "react-icons/io5";
import AdminSideBar from '../../Components/AdminSideBar';
const AddAdminTenants = () => {
    const initialFormData = {
        name: '',
        email: '',
        contact: '',
        nid: '',
        licenseno: '',
        companyname: '',
        passport: '',
        address: '',
        property: '',
        floorId: '',
        unitId: [],
        propertyType: 'Apartments',
        contractInfo: {
            startingDate: '',
            monthsDuration: '',
            endDate: '',
            totalContractAmount: '',
            VAT: '',
            otherCost: 0,
            parking: false,
            parkingValue: '',
            discount: '',
            finalAmount: '',
            status: 'Active',
            securitydeposite: '',
            graceperiod: '',
            numberofoccupants: '',
            Waterandelecbill: 'Owner',
            pet: false,
            usage: 'Commercial',
            bank: '',
            totalChecks: '',
            pdc: [] // Initialize pdc array
        },
    };

    const [formData, setFormData] = useState(initialFormData);
    const [properties, setProperties] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState('');
    const [checkDetails, setCheckDetails] = useState([]);
    const navigate = useNavigate();
    const [selectedUnitsCount, setSelectedUnitsCount] = useState(1); // state to track the number of units selected



    const handleAddAnotherUnit = () => {
        setSelectedUnitsCount(prevCount => prevCount + 1); // increase the selectedUnitsCount by 1
    };
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await axios.get('/api/properties/allpropertiesforadmin', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setProperties(response.data);
            } catch (error) {
                setError('Failed to fetch properties');
            }
        };
        fetchProperties();
    }, [state.user.token]);

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        const selectedProperty = properties.find(property => property._id === propertyId);

        if (selectedProperty) {
            setFormData(prevState => ({
                ...prevState,
                property: selectedProperty._id,
                ownerId: selectedProperty.user._id,
                floorId: '',
                unitId: ''
            }));
        } else {
            console.error('Selected property not found');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedFormData = { ...formData };

        if (name.startsWith("contractInfo.")) {
            const field = name.split('.')[1];
            updatedFormData = {
                ...formData,
                contractInfo: {
                    ...formData.contractInfo,
                    [field]: value
                }
            };
        } else if (name.startsWith("unitId")) {
            const index = parseInt(name.split('unitId')[1]) - 1;
            console.log(`Updating unitId at index ${index} to value ${value}`); // Log the update
            const newUnitId = [...formData.unitId];
            newUnitId[index] = value;

            updatedFormData = {
                ...formData,
                unitId: newUnitId
            };
        } else {
            updatedFormData = {
                ...formData,
                [name]: value
            };
        }

        console.log("Updated Form Data:", updatedFormData); // Log updated form data


        // Calculate the end date if starting date or months duration change
        if (name === "contractInfo.startingDate" || name === "contractInfo.monthsDuration") {
            const { startingDate, monthsDuration } = updatedFormData.contractInfo;
            if (startingDate && monthsDuration) {
                let endDate = addMonths(new Date(startingDate), parseInt(monthsDuration));
                // Subtract one day from the calculated end date
                endDate = new Date(endDate.getTime() - (1 * 24 * 60 * 60 * 1000)); // Subtracting one day in milliseconds
                updatedFormData.contractInfo.endDate = format(endDate, 'yyyy-MM-dd');
            }
        }

        // Calculate finalAmount
        let finalAmount = parseFloat(updatedFormData.contractInfo.totalContractAmount);

        // If discount is provided, deduct it from the totalContractAmount
        if (updatedFormData.contractInfo.discount) {
            const discount = parseFloat(updatedFormData.contractInfo.discount);
            finalAmount -= discount;
        }

        // Calculate VAT amount
        const VATAmount = (updatedFormData.contractInfo.totalContractAmount * updatedFormData.contractInfo.VAT) / 100;

        // Add VAT amount to the final amount
        finalAmount += VATAmount;

        // Add other cost
        finalAmount += parseFloat(updatedFormData.contractInfo.otherCost);

        // Add parking value if parking is selected
        if (updatedFormData.contractInfo.parking) {
            finalAmount += parseFloat(updatedFormData.contractInfo.parkingValue);
        }

        // Update formData with calculated finalAmount
        setFormData({
            ...updatedFormData,
            contractInfo: {
                ...updatedFormData.contractInfo,
                finalAmount: finalAmount.toFixed(2), // Round to 2 decimal places
                difference: (updatedFormData.contractInfo.totalContractAmount - finalAmount).toFixed(2) // Calculate difference and round to 2 decimal places
            }
        });
    };


    const handleParkingChange = (e) => {
        const { value } = e.target;
        const parkingSelected = value === "true"; // Convert string to boolean

        setFormData(prevState => ({
            ...prevState,
            contractInfo: {
                ...prevState.contractInfo,
                parking: parkingSelected,
            },
            parkingValue: parkingSelected ? formData.parkingValue : "", // Reset parking value if parking is false
            // Calculate and update the final amount
            finalAmount: calculateFinalAmount(prevState.contractInfo, parkingSelected, formData.parkingValue)
        }));
    };

    const calculateFinalAmount = (contractInfo, parkingSelected, parkingValue) => {
        let finalAmount = parseFloat(contractInfo.totalContractAmount);

        if (contractInfo.discount) {
            const discount = parseFloat(contractInfo.discount);
            finalAmount -= discount;
        }

        const totalAmountWithVAT = finalAmount * (1 + contractInfo.VAT / 100);
        finalAmount = totalAmountWithVAT + parseFloat(contractInfo.otherCost);

        if (parkingSelected) {
            finalAmount += parseFloat(parkingValue);
        }

        return finalAmount.toFixed(2);
    };

    const handleTotalChecksChange = (e) => {
        const totalChecks = parseInt(e.target.value);
        const monthsDuration = parseInt(formData.contractInfo.monthsDuration);

        if (!isNaN(totalChecks) && totalChecks <= monthsDuration) {
            const finalAmountPerCheck = Math.round(parseFloat(formData.contractInfo.finalAmount) / totalChecks); // Round to the nearest whole number
            const startDate = new Date(formData.contractInfo.startingDate);
            const endDate = new Date(formData.contractInfo.endDate);
            const timeDifference = endDate.getTime() - startDate.getTime();
            const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); // Calculate the number of days between starting and ending dates
            const daysIncrement = Math.floor(daysDifference / totalChecks); // Calculate the number of days to increment for each check
            let currentDate = startDate;

            const updatedCheckDetails = new Array(totalChecks).fill().map((_, index) => {
                const date = new Date(currentDate.getTime() + (index * daysIncrement * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
                return { bank: '', checkNumber: '', amount: finalAmountPerCheck, date };
            });

            setCheckDetails(updatedCheckDetails);
        } else {
            console.error('Total checks should not exceed months duration.');
            // You can also set an error state here if needed
        }
    };


    const handleCheckDetailChange = (index, field, value) => {
        const updatedCheckDetails = [...checkDetails];
        // Round the check amount to a whole number if it's a decimal
        if (field === 'amount') {
            value = parseFloat(value); // Convert to float
            if (!isNaN(value)) {
                value = Math.round(value); // Round to the nearest whole number
                value = parseInt(value); // Convert back to integer
            }
        }
        updatedCheckDetails[index][field] = value;
        setCheckDetails(updatedCheckDetails);
    };

    // Delete Functionality of Unit in Tanent
    const DeleteHandler = (index) => {
        const updatedUnitIds = formData.unitId.filter((_, idx) => idx !== index);
        setSelectedUnitsCount(selectedUnitsCount - 1);
        setFormData({
            ...formData,
            unitId: updatedUnitIds,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure each checkDetails object includes both bank and checkNumber fields
            const formattedCheckDetails = checkDetails.map(check => ({
                bank: check.bank,
                checkNumber: check.checkNumber,
                ...check
            }));

            // Check if formattedCheckDetails array is empty
            if (formattedCheckDetails.length === 0) {
                alert('Please provide check details.');
                return; // Stop execution if checks data is empty
            }

            // Check if unitId is an array
            const unitIds = Array.isArray(formData.unitId) ? formData.unitId.map(id => id) : [];

            console.log("Submitting with unitId:", unitIds); // Log unitId array before submitting

            // Create payload with unitId as an array
            const payload = {
                ...formData,
                unitId: unitIds,  // map unitId array to only include _id
                contractInfo: {
                    ...formData.contractInfo,
                    pdc: formattedCheckDetails,
                    totalChecks: formattedCheckDetails.length
                }
            };

            // Make API request with formatted payload
            const response = await axios.post('/api/tenants/addtenantforadmin', payload, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            });

            console.log('Tenant added:', response.data);
            setFormData({ ...initialFormData });
            navigate('/alltenantofadmin');
        } catch (error) {
            console.error('Error adding tenant:', error);
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

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div style={{ marginTop: '90px' }}>
                                <h2 className='text-center'>Add Tenant</h2>
                                <form onSubmit={handleSubmit}>
                                    <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                                        <Card.Body>
                                            <Card.Title className=' mb-4' > Property Details </Card.Title>
                                            <div className="row">
                                                {/* Select property */}
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="property">Select Apartment</label>
                                                        <select style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} className='w-100 py-2' id="property" name="property" onChange={handlePropertyChange} value={formData.property} required>
                                                            <option value="">Select Apartment</option>
                                                            {properties.map(property => {
                                                                const nameToShow = property.name || property.buildingname; // Use buildingname if name is not available
                                                                const allOccupied = property.floors.every(floor => {
                                                                    return floor.units.every(unit => unit.occupied);
                                                                });
                                                                if (!allOccupied) {
                                                                    return <option key={property._id} value={property._id}>{nameToShow}</option>;
                                                                }
                                                                return null;
                                                            })}
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Select floor */}
                                                <div className="col-md-4 ">
                                                    <div className="form-group">
                                                        <label htmlFor="floor">Select Floor</label>
                                                        <select className='w-100 py-2' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} id="floor" name="floorId" value={formData.floorId} onChange={handleInputChange} required>
                                                            <option value="">Select Floor</option>
                                                            {formData.property &&
                                                                properties
                                                                    .find(property => property._id === formData.property)
                                                                    .floors
                                                                    .filter(floor => {
                                                                        // Check if all units are occupied
                                                                        return !floor.units.every(unit => unit.occupied);
                                                                    })
                                                                    .map(floor => (
                                                                        <option key={floor._id} value={floor._id}>{floor.name}</option>
                                                                    ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Usage</label>
                                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} >
                                                            <select className='w-100 py-2' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} name="contractInfo.usage" value={formData.contractInfo.usage} onChange={handleInputChange} required>
                                                                <option value="Commercial">Commercial</option>
                                                                <option value="Residential">Residential</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    {Array.from({ length: selectedUnitsCount }).map((_, index) => (
                                                        <div key={index}>
                                                            <div className="form-group"  >
                                                                <label htmlFor={`unitId${index + 1}`}>Select Unit {index + 1}</label>
                                                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} >
                                                                    <select style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} name={`unitId${index + 1}`} value={formData.unitId[index]} onChange={handleInputChange} className='w-100 py-2' required>
                                                                        <option value="">Select Unit</option>
                                                                        {formData.floorId &&
                                                                            properties
                                                                                .find(property => property._id === formData.property)
                                                                                .floors
                                                                                .find(floor => floor._id === formData.floorId)
                                                                                .units
                                                                                .filter(unit => !unit.occupied)
                                                                                .map(unit => (
                                                                                    <option key={unit._id} value={unit._id}>{unit.unitNo} / {unit.type}</option>
                                                                                ))
                                                                        }
                                                                    </select>
                                                                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                                                                        <IoAdd style={{ fontSize: '25px', cursor: 'pointer', color: 'green' }} onClick={handleAddAnotherUnit} />
                                                                        <AiOutlineDelete onClick={() => DeleteHandler(index)} style={{ cursor: 'pointer', fontSize: '25px', color: '#e03c3e' }} />
                                                                        {/* <div className="col-md-6" style={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }} > 
                                                                            <Button variant="success" onClick={handleAddAnotherUnit}>
                                                                                Add Another Unit
                                                                            </Button>
                                                                     </div> */}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Input fields for tenant information */}
                                    <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                        <Card.Body>
                                            <Card.Title className=' mb-4' > Tenant  Details </Card.Title>

                                            {formData.contractInfo.usage === 'Commercial' && (
                                                <>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="unit">License Number</label>
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="licenseno" placeholder="License Number" value={formData.licenseno} onChange={handleInputChange} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 ">
                                                            <div className="form-group">
                                                                <label htmlFor="unit">Company Name</label>
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="companyname" placeholder="Company Name" value={formData.companyname} onChange={handleInputChange} required />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-3 ">
                                                            <div className="form-group">
                                                                <label htmlFor="unit">Email</label>
                                                                <input style={{ borderRadius: '10px' }} type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="unit">Address</label>
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
                                                            </div>
                                                        </div>

                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <label htmlFor="unit">Contact</label>
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contact" placeholder="Contact" value={formData.contact} onChange={handleInputChange} required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            <div className="row">
                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Tenant Name</label>
                                                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="name" placeholder="Tenant Name" value={formData.name} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>}

                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3 ">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Email</label>
                                                            <input style={{ borderRadius: '10px' }} type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>}
                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Address</label>
                                                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>}



                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Passport</label>
                                                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="passport" placeholder="Passport" value={formData.passport} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>}


                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Emirates ID No.</label>
                                                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="nid" placeholder="Emirates ID No." value={formData.nid} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>
                                                }

                                                {formData.contractInfo.usage === 'Commercial' ? null :
                                                    <div className="col-md-3">
                                                        <div className="form-group">
                                                            <label htmlFor="unit">Contact</label>
                                                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contact" placeholder="Contact" value={formData.contact} onChange={handleInputChange} required />
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                        <Card.Body>
                                            <Card.Title className='' >Contract Details</Card.Title>

                                            {/* Additional fields for contract information */}
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Start Date</label>
                                                        <input style={{ borderRadius: '10px' }} type="date" className="form-control" name="contractInfo.startingDate" value={formData.contractInfo.startingDate} onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Months Duration</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.monthsDuration" placeholder="Months Duration" value={formData.contractInfo.monthsDuration} onChange={handleInputChange} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">End Date</label>
                                                        <input style={{ borderRadius: '10px' }} type="date" className="form-control" name="contractInfo.endDate" value={formData.contractInfo.endDate} onChange={handleInputChange} required />
                                                    </div>
                                                </div>



                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Contract Amount</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.totalContractAmount" placeholder="Total Contract Amount" value={formData.contractInfo.totalContractAmount} onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">VAT</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.VAT" placeholder="VAT %" value={formData.contractInfo.VAT} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Other Cost</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.otherCost" placeholder="Other Cost" value={formData.contractInfo.otherCost} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                {/* <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Discount</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.discount" placeholder="Discount" value={formData.contractInfo.discount} onChange={handleInputChange} />
                                                    </div>
                                                </div> */}
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Final Amount</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.finalAmount" placeholder="Final Amount" value={formData.contractInfo.finalAmount} onChange={handleInputChange} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Security Deposite</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.securitydeposite" placeholder="Security Deposite" value={formData.contractInfo.securitydeposite} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Radio button for parking */}
                                            {/* <div className="form-group">
                                                <label>Parking:</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                                                    <label className="radio-inline">
                                                        <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="true" checked={formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                        <span>Yes</span>
                                                    </label>
                                                    <label className="radio-inline">
                                                        <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="false" checked={!formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                        <span>No</span>
                                                    </label>
                                                </div>
                                            </div>

                                            {formData.contractInfo.parking && (
                                                <div className="form-group">
                                                    <label htmlFor="unit">Parking Value</label>
                                                    <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contractInfo.parkingValue" placeholder="Parking Value" value={formData.contractInfo.parkingValue} onChange={handleInputChange} />
                                                </div>
                                            )} */}

                                            {/* <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Discount</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.discount" placeholder="Discount" value={formData.contractInfo.discount} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Final Amount</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.finalAmount" placeholder="Final Amount" value={formData.contractInfo.finalAmount} onChange={handleInputChange} required />
                                                    </div>
                                                </div>
                                            </div> */}


                                            <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Water and Electricity bill</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control py-3" name="contractInfo.Waterandelecbill" value={formData.contractInfo.Waterandelecbill} onChange={handleInputChange} required>
                                                            <option value="Owner">Owner</option>
                                                            <option value="Tenant">Tenant</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-md-3 mt-4">
                                                    <div className="form-group">
                                                        <label>Parking:</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                                                            <label className="radio-inline">
                                                                <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="true" checked={formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                                <span>Yes</span>
                                                            </label>
                                                            <label className="radio-inline">
                                                                <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="false" checked={!formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                                <span>No</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                    
                                               
                                            </div>

                                            {/* <div className="row">
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Number of Occupants</label>
                                                        <input style={{ borderRadius: '10px' }} type="number" className="form-control" name="contractInfo.numberofoccupants" placeholder="Number of Occupants" value={formData.contractInfo.numberofoccupants} onChange={handleInputChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Water and Electricity bill</label>
                                                        <select style={{ borderRadius: '10px' }} className="form-control py-3" name="contractInfo.Waterandelecbill" value={formData.contractInfo.Waterandelecbill} onChange={handleInputChange}>
                                                            <option value="owner">Owner</option>
                                                            <option value="tenant">Tenant</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div> */}

                                            <div className="row">
                                                {/* <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label htmlFor="pet">Pet</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <label className="radio-inline">
                                                                <span><input style={{ borderRadius: '10px' }} type="radio" name="pet" value="true" checked={formData.contractInfo.pet} onChange={(e) => handleInputChange(e)} /></span>
                                                                <span style={{ marginLeft: '3px' }}>Yes</span>
                                                            </label>
                                                            <label className="radio-inline">
                                                                <span> <input style={{ borderRadius: '10px' }} type="radio" name="pet" value="false" checked={!formData.contractInfo.pet} onChange={(e) => handleInputChange(e)} /></span>
                                                                <span style={{ marginLeft: '3px' }} >No</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <label>Parking:</label>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                                                            <label className="radio-inline">
                                                                <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="true" checked={formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                                <span>Yes</span>
                                                            </label>
                                                            <label className="radio-inline">
                                                                <span> <input style={{ borderRadius: '10px' }} type="radio" name="parking" value="false" checked={!formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                                <span>No</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div> */}

                                                {/* Conditional input field for parking value */}
                                                {formData.contractInfo.parking && (
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Parking Value</label>
                                                        <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contractInfo.parkingValue" placeholder="Parking Value" value={formData.contractInfo.parkingValue} onChange={handleInputChange} />
                                                    </div>
                                                )}
                                                {/* <div className="col-md-6 ">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Usage</label>
                                                        <select className="form-control py-3" name="contractInfo.usage" value={formData.contractInfo.usage} onChange={handleInputChange}>
                                                            <option value="commercial">Commercial</option>
                                                            <option value="residential">Residential</option>
                                                        </select>
                                                    </div>
                                                </div> */}
                                            </div>

                                        </Card.Body>
                                    </Card>

                                    <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                        <Card.Body>
                                            <Card.Title className='' >Payment Details</Card.Title>

                                            <div className="row">
                                                {/*  <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="unit">Bank</label>
                                                        <input type="text" className="form-control" name="bank" placeholder="Bank " value={formData.bank} onChange={handleInputChange} />
                                                    </div>
                                                </div> */}
                                                <div className="col-md-3">
                                                    <label htmlFor="unit" className='mb-2'>Total Checks</label>
                                                    <select style={{ borderRadius: '10px' }} className="form-control py-3" name="contractInfo.totalChecks" value={formData.contractInfo.totalChecks} onChange={handleTotalChecksChange}>
                                                        <option value=""> Total Checks</option>
                                                        {Array.from({ length: formData.contractInfo.monthsDuration }, (_, index) => index + 1).map((count) => (
                                                            <option key={count} value={count}>{count}</option>
                                                        ))}
                                                    </select>

                                                </div>
                                            </div>

                                            {/* Dynamically generated fields for check details */}
                                            {checkDetails.map((check, index) => (
                                                <div key={index}>
                                                    <div className="row">
                                                        <div className="col-md-3 ">
                                                            <div className="form-group">
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" placeholder="Bank" value={check.bank} onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 ">
                                                            <div className="form-group">
                                                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" placeholder="Check Number" value={check.checkNumber} onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)} required />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <div className="form-group">
                                                                <input style={{ borderRadius: '10px' }} type="number" className="form-control" placeholder="Amount" value={check.amount} onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-3 ">
                                                            <div className="form-group">
                                                                <input style={{ borderRadius: '10px' }} type="date" className="form-control" placeholder="Date" value={check.date} onChange={(e) => handleCheckDetailChange(index, 'date', e.target.value)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                    <div className='mb-5' style={{ width: '100%', margin: 'auto' }} >
                                        <button type="submit" className="btn btn-primary mt-4">Add Tenant</button>
                                    </div>

                                </form>
                            </div>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </>
    );
};

export default AddAdminTenants;