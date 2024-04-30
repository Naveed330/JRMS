import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { addMonths, format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Row } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';

const AddTenantForm = () => {
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
        propertyType: 'apartments',
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
            Waterandelecbill: 'owner',
            pet: false,
            usage: 'commercial',
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
                const response = await axios.get('/api/properties/allproperties', {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Ensure each checkDetails object includes both bank and checkNumber fields
            const formattedCheckDetails = checkDetails.map(check => ({
                bank: check.bank,
                checkNumber: check.checkNumber,
                ...check
            }));

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
            const response = await axios.post('/api/tenants/addtenant', payload, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            });

            console.log('Tenant added:', response.data);
            setFormData({ ...initialFormData });
            navigate('/alltenant');
        } catch (error) {
            console.error('Error adding tenant:', error);
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

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div style={{ marginTop: '70px' }}>
                                <h1 className='text-center mb-4'>Add Tenant</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        {/* Select property */}
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="property">Select Apartment:</label>
                                                <select className="form-control py-3" id="property" name="property" onChange={handlePropertyChange} value={formData.property}>
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
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="floor">Select Floor:</label>
                                                <select className="form-control py-3" id="floor" name="floorId" value={formData.floorId} onChange={handleInputChange}>
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
                                    </div>

                                    {/* Add Another Unit button */}


                                    <div className="row">
                                        <div className="col-md-9">
                                            {Array.from({ length: selectedUnitsCount }).map((_, index) => (
                                                <div key={index}>
                                                    <div className="form-group ">
                                                        <label htmlFor={`unitId${index + 1}`}>Select Unit {index + 1}</label>
                                                        <select style={{ border: '1px solid #ebedf2' }}name={`unitId${index + 1}`} value={formData.unitId[index]} onChange={handleInputChange} className='w-100 py-2'>
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
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-md-3" style={{display:'flex', justifyContent:'center', alignItems:'center'}} >
                                            <Button variant="success" onClick={handleAddAnotherUnit}>
                                                Add Another Unit
                                            </Button>
                                        </div>

                                    </div>


                                    {/* Input fields for tenant information */}
                                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" name="companyname" placeholder="Company Name" value={formData.companyname} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <input type="email" className="form-control" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" name="contact" placeholder="Contact" value={formData.contact} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" name="licenseno" placeholder="License No" value={formData.licenseno} onChange={handleInputChange} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        
                        <div className="col-md-6 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
                            </div>
                        </div>
                    </div>


                                    {/* Additional fields for contract information */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">Start Date</label>
                                                <input type="date" className="form-control" name="contractInfo.startingDate" value={formData.contractInfo.startingDate} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">MonthsDuration</label>
                                                <input type="number" className="form-control" name="contractInfo.monthsDuration" placeholder="Months Duration" value={formData.contractInfo.monthsDuration} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">End Date</label>
                                                <input type="date" className="form-control" name="contractInfo.endDate" value={formData.contractInfo.endDate} onChange={handleInputChange} required />
                                            </div>
                                        </div>


                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">ContractAmount</label>
                                                <input type="number" className="form-control" name="contractInfo.totalContractAmount" placeholder="Total Contract Amount" value={formData.contractInfo.totalContractAmount} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">VAT</label>
                                                <input type="number" className="form-control" name="contractInfo.VAT" placeholder="VAT %" value={formData.contractInfo.VAT} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">Other Cost</label>
                                                <input type="number" className="form-control" name="contractInfo.otherCost" placeholder="Other Cost" value={formData.contractInfo.otherCost} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Radio button for parking */}
                                    <div className="form-group">
                                        <label>Parking:</label>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} >
                                            <label className="radio-inline">
                                                <span> <input type="radio" name="parking" value="true" checked={formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                <span>Yes</span>
                                            </label>
                                            <label className="radio-inline">
                                                <span> <input type="radio" name="parking" value="false" checked={!formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} /> </span>
                                                <span>No</span>
                                            </label>
                                        </div>
                                    </div>

                                    {/* Conditional input field for parking value */}
                                    {formData.contractInfo.parking && (
                                        <div className="form-group">
                                            <label htmlFor="unit">Parking Value</label>
                                            <input type="text" className="form-control" name="contractInfo.parkingValue" placeholder="Parking Value" value={formData.contractInfo.parkingValue} onChange={handleInputChange} />
                                        </div>
                                    )}

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">Discount</label>
                                                <input type="number" className="form-control" name="contractInfo.discount" placeholder="Discount" value={formData.contractInfo.discount} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">Final Amount</label>
                                                <input type="number" className="form-control" name="contractInfo.finalAmount" placeholder="Final Amount" value={formData.contractInfo.finalAmount} onChange={handleInputChange} required />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">Security Deposite</label>
                                                <input type="number" className="form-control" name="contractInfo.securitydeposite" placeholder="Security Deposite" value={formData.contractInfo.securitydeposite} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">Grace Period</label>
                                                <input type="number" className="form-control" name="contractInfo.graceperiod" placeholder="Grace Period" value={formData.contractInfo.graceperiod} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">Number of Occupants</label>
                                                <input type="number" className="form-control" name="contractInfo.numberofoccupants" placeholder="Number of Occupants" value={formData.contractInfo.numberofoccupants} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">Waterandelecbill</label>
                                                <select className="form-control py-3" name="contractInfo.Waterandelecbill" value={formData.contractInfo.Waterandelecbill} onChange={handleInputChange}>
                                                    <option value="owner">Owner</option>
                                                    <option value="tenant">Tenant</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="pet">Pet</label>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <label className="radio-inline">
                                                        <span><input type="radio" name="pet" value="true" checked={formData.contractInfo.pet} onChange={(e) => handleInputChange(e)} /></span>
                                                        <span style={{ marginLeft: '3px' }}>Yes</span>
                                                    </label>
                                                    <label className="radio-inline">
                                                        <span> <input type="radio" name="pet" value="false" checked={!formData.contractInfo.pet} onChange={(e) => handleInputChange(e)} /></span>
                                                        <span style={{ marginLeft: '3px' }} >No</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6 ">
                                            <div className="form-group">
                                                <label htmlFor="unit">Usage</label>
                                                <select className="form-control py-3" name="contractInfo.usage" value={formData.contractInfo.usage} onChange={handleInputChange}>
                                                    <option value="commercial">Commercial</option>
                                                    <option value="residential">Residential</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    {/* Additional fields for bank and checks */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <label htmlFor="unit">Bank</label>
                                                <input type="text" className="form-control" name="bank" placeholder="Bank " value={formData.bank} onChange={handleInputChange} />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="unit">TotalChecks</label>
                                            <select className="form-control py-3" name="contractInfo.totalChecks" value={formData.contractInfo.totalChecks} onChange={handleTotalChecksChange}>
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
                                                        <input type="text" className="form-control" placeholder="Bank" value={check.bank} onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 ">
                                                    <div className="form-group">
                                                        <input type="text" className="form-control" placeholder="Check Number" value={check.checkNumber} onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3">
                                                    <div className="form-group">
                                                        <input type="number" className="form-control" placeholder="Amount" value={check.amount} onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 ">
                                                    <div className="form-group">
                                                        <input type="date" className="form-control" placeholder="Date" value={check.date} onChange={(e) => handleCheckDetailChange(index, 'date', e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button type="submit" className="btn btn-primary">Add Tenant</button>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Col>


            </Row>
        </>
    );
};

export default AddTenantForm;