import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { addMonths, format } from 'date-fns';
const AddTenantForm = () => {
    const initialFormData = {
        name: '',
        email: '',
        contact: '',
        nid: '',
        passport: '',
        address: '',
        property: '',
        floorId: '',
        unitId: '',
        propertyType: 'apartments',
        contractInfo: {
            startingDate: '',
            monthsDuration: '',
            endDate: '',
            totalContractAmount: '',
            VAT: '',
            otherCost: '',
            parking: false,
            parkingValue: '',
            discount: '',
            finalAmount: '',
            status: 'Active',
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
    
        // Update formData with the changed input value
        if (name.startsWith("contractInfo.")) {
            updatedFormData = {
                ...formData,
                contractInfo: {
                    ...formData.contractInfo,
                    [name.split('.')[1]]: value
                }
            };
        } else {
            updatedFormData = {
                ...formData,
                [name]: value
            };
        }
    
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
    
    const handleParkingChange = (e, updatedFormData) => {
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
            finalAmount: calculateFinalAmount(updatedFormData.contractInfo, parkingSelected, formData.parkingValue)
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
        if (!isNaN(totalChecks)) {
            const finalAmountPerCheck = (parseFloat(formData.contractInfo.finalAmount) / totalChecks).toFixed(2);
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
        }
    };
    
    

    const handleCheckDetailChange = (index, field, value) => {
        const updatedCheckDetails = [...checkDetails];
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
    
            // Update payload with formatted checkDetails inside contractInfo and totalChecks
            const payload = {
                ...formData,
                contractInfo: {
                    ...formData.contractInfo,
                    pdc: formattedCheckDetails, // Include formatted checkDetails in contractInfo
                    totalChecks: formattedCheckDetails.length // Update totalChecks with the length of formattedCheckDetails array
                }
            };
    
            // Make API request with formatted payload
            const response = await axios.post('/api/tenants/addtenant', payload, {
                headers: {
                    Authorization: `Bearer ${state.user.token}`
                }
            });
            console.log('Tenant added:', response.data);
            setFormData({ ...initialFormData }); // Reset form after successful submission
        } catch (error) {
            console.error('Error adding tenant:', error);
        }
    };
    
    
    return (
        <div className='m-5'>
        <form onSubmit={handleSubmit}>
            <div className="row">
                {/* Select property */}
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <label htmlFor="property">Select Apartment:</label>
                        <select className="form-control" id="property" name="property" onChange={handlePropertyChange} value={formData.property}>
                            <option value="">Select Apartment</option>
                            {properties.map(property => {
                                const allOccupied = property.floors.every(floor => {
                                    return floor.units.every(unit => unit.occupied);
                                });
                                if (!allOccupied) {
                                    return <option key={property._id} value={property._id}>{property.name}</option>;
                                }
                                return null;
                            })}
                        </select>
                    </div>
                </div>

                {/* Select floor */}
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <label htmlFor="floor">Select Floor:</label>
                        <select className="form-control" id="floor" name="floorId" value={formData.floorId} onChange={handleInputChange}>
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

            {/* Select unit */}
            <div className="form-group mb-3">
                <label htmlFor="unit">Select Unit:</label>
                <select className="form-control" id="unit" name="unitId" value={formData.unitId} onChange={handleInputChange}>
                    <option value="">Select Unit</option>
                    {formData.floorId &&
                        properties
                            .find(property => property._id === formData.property)
                            .floors
                            .find(floor => floor._id === formData.floorId)
                            .units
                            .filter(unit => !unit.occupied)
                            .map(unit => (
                                <option key={unit._id} value={unit._id}>{unit.name}</option>
                            ))
                    }
                </select>
            </div>

            {/* Input fields for tenant information */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="text" className="form-control" name="name" placeholder="Tenant Name" value={formData.name} onChange={handleInputChange} required />
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
                        <input type="text" className="form-control" name="nid" placeholder="NID" value={formData.nid} onChange={handleInputChange} />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="text" className="form-control" name="passport" placeholder="Passport" value={formData.passport} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="text" className="form-control" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
                    </div>
                </div>
            </div>

            {/* Additional fields for contract information */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="date" className="form-control" name="contractInfo.startingDate" value={formData.contractInfo.startingDate} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.monthsDuration" placeholder="Months Duration" value={formData.contractInfo.monthsDuration} onChange={handleInputChange} required />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="date" className="form-control" name="contractInfo.endDate" value={formData.contractInfo.endDate} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.totalContractAmount" placeholder="Total Contract Amount" value={formData.contractInfo.totalContractAmount} onChange={handleInputChange} required />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.VAT" placeholder="VAT %" value={formData.contractInfo.VAT} onChange={handleInputChange} required />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.otherCost" placeholder="Other Cost" value={formData.contractInfo.otherCost} onChange={handleInputChange} />
                    </div>
                </div>
            </div>

            {/* Radio button for parking */}
            <div className="form-group">
                <label>Parking:</label>
                <div>
                    <label className="radio-inline">
                        <input type="radio" name="parking" value="true" checked={formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} />
                        Yes
                    </label>
                    <label className="radio-inline">
                        <input type="radio" name="parking" value="false" checked={!formData.contractInfo.parking} onChange={(e) => handleParkingChange(e, formData)} />
                        No
                    </label>
                </div>
            </div>

            {/* Conditional input field for parking value */}
            {formData.contractInfo.parking && (
                <div className="form-group">
                    <input type="text" className="form-control" name="contractInfo.parkingValue" placeholder="Parking Value" value={formData.contractInfo.parkingValue} onChange={handleInputChange} />
                </div>
            )}

            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.discount" placeholder="Discount" value={formData.contractInfo.discount} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="contractInfo.finalAmount" placeholder="Final Amount" value={formData.contractInfo.finalAmount} onChange={handleInputChange} required />
                    </div>
                </div>
            </div>

            {/* Additional fields for bank and checks */}
            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="text" className="form-control" name="bank" placeholder="Bank " value={formData.bank} onChange={handleInputChange} />
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="form-group">
                        <input type="number" className="form-control" name="totalChecks" placeholder="Total Checks" value={formData.contractInfo.totalChecks} onChange={handleTotalChecksChange} />
                    </div>
                </div>
            </div>

            {/* Dynamically generated fields for check details */}
            {checkDetails.map((check, index) => (
                <div key={index}>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Bank" value={check.bank} onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="form-group">
                                <input type="text" className="form-control" placeholder="Check Number" value={check.checkNumber} onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
                            <div className="form-group">
                                <input type="number" className="form-control" placeholder="Amount" value={check.amount} onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)} />
                            </div>
                        </div>
                        <div className="col-md-3 mb-3">
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
    );
};

export default AddTenantForm;
