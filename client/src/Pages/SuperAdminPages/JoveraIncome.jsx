import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

const desiredKeys = [
    'contractIssuingFees',
    'ejariFee',
    'transferFees',
    'terminationFees',
    'contractExpiryFees',
    'maintenanceSecurityDeposit',
    'refundableGuarantee',
    'lateRenewalFees',
    'postponeChequeFees'
];

const JoveraIncome = () => {
    const { state } = useContext(AuthContext);
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [properties, setProperties] = useState([]);
    const [administrationFees, setAdministrationFees] = useState([]);
    const [administrationRecords, setAdministrationRecords] = useState([]);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const response = await axios.get('/api/users/all-owners', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setOwners(response.data);
            } catch (error) {
                console.error('Error fetching owners:', error);
            }
        };
        fetchOwners();
    }, [state.user.token]);

    useEffect(() => {
        const fetchTenantsData = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenants(response.data);
            } catch (error) {
                console.error('Error fetching tenants:', error);
            }
        };
        fetchTenantsData();
    }, [state.user.token]);

    useEffect(() => {
        const fetchPropertiesByOwner = async () => {
            if (selectedOwner) {
                try {
                    const response = await axios.post('/api/properties/properties-by-user', {
                        userId: selectedOwner._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                    setProperties(response.data);
                } catch (error) {
                    console.error('Error fetching properties by owner:', error);
                }
            }
        };
        fetchPropertiesByOwner();
    }, [selectedOwner, state.user.token]);

    useEffect(() => {
        const fetchTenantsByOwnerOrProperty = async () => {
            if (selectedOwner && !selectedProperty) {
                try {
                    const response = await axios.post('/api/tenants/tenants-by-owner', {
                        ownerId: selectedOwner._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                    setTenants(response.data);
                } catch (error) {
                    console.error('Error fetching tenants by owner:', error);
                }
            } else if (selectedProperty) {
                try {
                    const response = await axios.post('/api/tenants/tenants-by-property', {
                        propertyId: selectedProperty._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                    setTenants(response.data);
                } catch (error) {
                    console.error('Error fetching tenants by property:', error);
                }
            }
        };
        fetchTenantsByOwnerOrProperty();
    }, [selectedOwner, selectedProperty, state.user.token]);

    useEffect(() => {
        const fetchAdministrationFees = async () => {
            try {
                const response = await axios.get('/api/adminstrationfees/all-administration-fees', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setAdministrationFees(response.data);
            } catch (error) {
                console.error('Error fetching administration fees:', error);
            }
        };
        fetchAdministrationFees();
    }, [state.user.token]);
    useEffect(() => {
        const fetchAdministrationRecords = async () => {
            try {
                let response;
                if (selectedOwner) {
                    if (selectedProperty) {
                        // If both owner and property are selected, fetch administration records by property
                        response = await axios.post('/api/adminstrationfees/administration-fees-by-property', {
                            propertyId: selectedProperty._id
                        }, {
                            headers: {
                                Authorization: `Bearer ${state.user.token}`
                            }
                        });
                    } else {
                        // If only owner is selected, fetch administration records by owner
                        response = await axios.post('/api/adminstrationfees/administration-fees-by-owner', {
                            ownerId: selectedOwner._id
                        }, {
                            headers: {
                                Authorization: `Bearer ${state.user.token}`
                            }
                        });
                    }
                } else {
                    // If no owner is selected, fetch all administration records
                    response = await axios.get('/api/adminstrationfees/all-administration-fees', {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                }
                setAdministrationRecords(response.data);
            } catch (error) {
                console.error('Error fetching administration records:', error);
            }
        };
        fetchAdministrationRecords();
    }, [selectedOwner, selectedProperty, state.user.token]);
    


    const mapAdministrationRecordData = (record) => {
        return desiredKeys.map(key => ({
            key,
            value: record[key] || 0 // If the key doesn't exist, default to 0
        }));
    };

    const administrationRecordColumns = [
        {
            dataField: 'key',
            text: 'Service'
        },
        {
            dataField: 'value',
            text: 'Amount'
        }
    ];

    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        if (propertyId === '') {
            setSelectedProperty(null);
        } else {
            if (properties.length > 0) {
                const foundProperty = properties.find(property => property._id === propertyId);

                if (foundProperty) {
                    setSelectedProperty(foundProperty);
                } else {
                    console.error('Property not found or missing ID');
                }
            }
        }
    };

    const handleClear = () => {
        setSelectedOwner(null);
        setSelectedProperty(null);
        setStartDate('');
        setEndDate('');
        setTenants([]);
    };

    const filteredTenants = tenants.filter(tenant => {
        if (startDate && endDate) {
            return tenant.contractInfo.payment.some(payment => {
                const paymentDate = new Date(payment.date);
                return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
            });
        } else {
            return true;
        }
    });

    const calculatePaymentTotalCash = () => {
        return filteredTenants.reduce((total, tenant) => {
            return total + (tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'cash')
                .filter(payment => payment.paymentstatus === 'paid') // Filter payments with status 'paid'
                .reduce((subtotal, payment) => subtotal + payment.amount, 0) * 0.05);
        }, 0);
    };

    const calculatePaymentTotalBank = () => {
        return filteredTenants.reduce((total, tenant) => {
            return total + (tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'bank')
                .filter(payment => payment.paymentstatus === 'paid') // Filter payments with status 'paid'
                .reduce((subtotal, payment) => subtotal + payment.amount, 0) * 0.05);
        }, 0);
    };

    const calculateNetIncome = () => {
        const totalPaidPayments = filteredTenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentstatus === 'paid')
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);

        const totalAdministrationFees = administrationRecords.reduce((total, record) => {
            return total + desiredKeys.reduce((subtotal, key) => subtotal + (record[key] || 0), 0);
        }, 0);

        return (totalPaidPayments * 0.05) + totalAdministrationFees;
    };

    const paymentColumnsCash = [
        {
            dataField: 'property.name',
            text: 'Property Name'
        },
        {
            dataField: 'contractInfo.payment',
            text: 'Payment',
            formatter: (cell, row) => (
                <ul>
                    {cell.filter(payment => payment.paymentmethod === 'cash' && payment.paymentstatus === 'paid').map(payment => (
                        <li key={payment._id}>
                            Method: {payment.paymentmethod}, Status: {payment.paymentstatus}, Amount: {payment.amount}, Bank: {payment.bank}, Date: {payment.date}
                        </li>
                    ))}
                </ul>
            )
        }
    ];

    const paymentColumnsBank = [
        {
            dataField: 'property.name',
            text: 'Property Name'
        },
        {
            dataField: 'contractInfo.payment',
            text: 'Payment',
            formatter: (cell, row) => (
                <ul>
                    {cell.filter(payment => payment.paymentmethod === 'bank' && payment.paymentstatus === 'paid').map(payment => (
                        <li key={payment._id}>
                            Method: {payment.paymentmethod}, Status: {payment.paymentstatus}, Amount: {payment.amount}, Bank: {payment.bank}, Date: {new Date(payment.date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )
        }
    ];
    const calculateAdministrationSubtotal = (record) => {
        return desiredKeys.reduce((subtotal, key) => subtotal + (record[key] || 0), 0);
    };
    return (
        <div style={{ marginTop: "90px" }}>
            <div className='mt-5'>
                <select onChange={(e) => setSelectedOwner(owners.find(owner => owner._id === e.target.value))}>
                    <option value="">Select Owner</option>
                    {owners.map(owner => (
                        <option key={owner._id} value={owner._id}>{owner.name}</option>
                    ))}
                </select>

                <select onChange={handlePropertyChange}>
                    <option value="">Select Property</option>
                    {properties && properties.length > 0 && properties.map(property => (
                        <option key={property._id} value={property._id}>{property.name}</option>
                    ))}
                </select>

                <div>
                    <label>Start Date:</label>
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label>End Date:</label>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>

                <button onClick={handleClear}>Clear</button>

                {filteredTenants.length > 0 && (
                    <div>
                        <h2>Cash Payment Report (Subtotal: {calculatePaymentTotalCash()} AED)</h2>
                        <BootstrapTable keyField='_id' data={filteredTenants} columns={paymentColumnsCash} />
                    </div>
                )}

                {filteredTenants.length > 0 && (
                    <div>
                        <h2>Bank Payment Report (Subtotal: {calculatePaymentTotalBank()} AED)</h2>
                        <BootstrapTable keyField='_id' data={filteredTenants} columns={paymentColumnsBank} />
                    </div>
                )}
                {administrationRecords.length > 0 && (
                    <div>
                        {/* <h2>Administration Records ({totalAdministrationFees} AED)</h2> */}
                        {administrationRecords.map(record => (
                            <>
                                <h3> Administartion Fee Subtotal: {calculateAdministrationSubtotal(record)} AED</h3>
                                <div key={record._id}>
                                    <h3>Tenant Name: {record.tenantId.name}</h3>
                                    <BootstrapTable
                                        keyField='key'
                                        data={mapAdministrationRecordData(record)}
                                        columns={administrationRecordColumns}
                                    />
                                </div>
                            </>
                        ))}
                    </div>
                )}
            </div>

            <h1>Net Income: {calculateNetIncome()}</h1>
        </div>
    );
};

export default JoveraIncome;
