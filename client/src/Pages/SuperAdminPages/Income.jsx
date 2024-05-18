import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Col, Row, Table } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';

const Income = () => {
    const { state } = useContext(AuthContext);
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [properties, setProperties] = useState([]);

    console.log(tenants, 'tenantstenants')

    // Fetch all owners
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

    // Fetch properties by selected owner
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

    // Fetch tenants by selected owner or property
    useEffect(() => {
        const fetchTenants = async () => {
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
        fetchTenants();
    }, [selectedOwner, selectedProperty, state.user.token]);

    // Fetch maintenance records by selected owner or property
    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                let response;
                if (selectedOwner && !selectedProperty) {
                    response = await axios.post('/api/maintenance/by-owner', {
                        ownerId: selectedOwner._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                } else if (selectedProperty) {
                    response = await axios.post('/api/maintenance/by-property', {
                        propertyId: selectedProperty._id
                    }, {
                        headers: {
                            Authorization: `Bearer ${state.user.token}`
                        }
                    });
                }
                if (response && response.data) {
                    setMaintenance(response.data);
                }
            } catch (error) {
                console.error('Error fetching maintenance records:', error);
            }
        };
        fetchMaintenance();
    }, [selectedOwner, selectedProperty, state.user.token]);

    // Filter maintenance records by date range
    useEffect(() => {
        const filterMaintenanceByDateRange = () => {
            if (startDate && endDate) {
                setMaintenance(prevMaintenance => {
                    const filteredMaintenance = prevMaintenance.filter(record => {
                        const maintenanceDate = new Date(record.date);
                        return maintenanceDate >= new Date(startDate) && maintenanceDate <= new Date(endDate);
                    });
                    return filteredMaintenance;
                });
            }
        };
        filterMaintenanceByDateRange();
    }, [startDate, endDate]);

    // Calculate subtotal amount for Payment
    const calculatePaymentTotalCash = () => {
        return tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'cash')
                .filter(payment => payment.paymentstatus === 'paid') // Filter payments with status 'paid'
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);
    };
    const calculatePaymentTotalBank = () => {
        return tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'bank')
                .filter(payment => payment.paymentstatus === 'paid') // Filter payments with status 'paid'
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);
    };



    // Calculate subtotal amount for Maintenance
    const calculateMaintenanceTotal = () => {
        return maintenance.reduce((total, record) => total + record.amount, 0);
    };

    // Function to calculate VAT for each tenant's contract
    const calculateVAT = (contract) => {
        return (contract.totalContractAmount * (contract.VAT / 100));
    };

    // Function to check if a date falls within a range
    const isWithinDateRange = (date, startDate, endDate) => {
        const checkDate = new Date(date);
        const rangeStartDate = new Date(startDate);
        const rangeEndDate = new Date(endDate);
        return checkDate >= rangeStartDate && checkDate <= rangeEndDate;
    };

    // Calculate total VAT from all tenants within the selected date range
    const calculateTotalVAT = () => {
        let totalVAT = 0;
        tenants.forEach(tenant => {
            const tenantVAT = calculateVAT(tenant.contractInfo);
            // Check if a date range is selected
            if (startDate && endDate) {
                // Check if tenant's contract falls within the selected date range
                if (isWithinDateRange(tenant.contractInfo.startDate, startDate, endDate)) {
                    totalVAT += tenantVAT;
                }
            } else {
                // If no date range is selected, include VAT for all tenants
                totalVAT += tenantVAT;
            }
        });
        return totalVAT;
    };

    // Prepare data for Total VAT table within the selected date range
    const totalVATData = tenants
        .filter(tenant => {
            // If a date range is selected, filter tenants by date range
            if (startDate && endDate) {
                return isWithinDateRange(tenant.contractInfo.startDate, startDate, endDate);
            } else {
                return true; // If no date range is selected, include all tenants
            }
        })
        .map(tenant => ({
            tenantName: tenant.name,
            totalVAT: calculateVAT(tenant.contractInfo)
        }));

    // Table columns for Total VAT
    const totalVATColumns = [
        {
            dataField: 'tenantName',
            text: 'Tenant Name'
        },
        {
            dataField: 'totalVAT',
            text: 'Total VAT'
        }
    ];

    // Define columns for Payment table
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
                            Method: {payment.paymentmethod}, Status: {payment.paymentstatus}, Amount: {payment.amount}, Bank: {payment.bank}, Date: {payment.date}
                        </li>
                    ))}
                </ul>
            )
        }
    ];

    // Define columns for Payment table
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

    // Define columns for Maintenance table
    const maintenanceColumns = [
        {
            dataField: 'property.name',
            text: 'Property Name'
        },
        {
            dataField: 'maintenanceType',
            text: 'Maintenance Type'
        },
        {
            dataField: 'description',
            text: 'Description'
        },
        {
            dataField: 'date',
            text: 'Date'
        }
    ];

    // Function to handle property change
    const handlePropertyChange = (e) => {
        const propertyId = e.target.value;
        if (propertyId === '') {
            setSelectedProperty(null);
        } else {
            // Ensure properties array has been populated
            if (properties.length > 0) {
                // Find the selected property from the properties list
                const foundProperty = properties.find(property => property._id === propertyId);

                if (foundProperty) {
                    setSelectedProperty(foundProperty);
                } else {
                    console.error('Property not found or missing ID');
                }
            }
        }
    };

    // Function to clear all fields
    const handleClear = () => {
        setSelectedOwner(null);
        setSelectedProperty(null);
        setStartDate('');
        setEndDate('');
        setTenants([]);
    };

    // Calculate Net Income
    const calculateNetIncome = () => {
        const totalPaidPayments = tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentstatus === 'paid')
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);
        return totalPaidPayments - calculateMaintenanceTotal() - calculateTotalVAT();
    };

    return (
        <>

            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '100px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <div>
                                <div>

                                    <div style={{ display: 'flex', gap: '20px' }}>

                                        {/* Owner select dropdown */}
                                        <select className='w-50 py-2 px-2' onChange={(e) => setSelectedOwner(owners.find(owner => owner._id === e.target.value))} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} >
                                            <option value="">Select Owner</option>
                                            {owners.map(owner => (
                                                <option key={owner._id} value={owner._id}>{owner.name}</option>
                                            ))}
                                        </select>

                                        {/* Property select dropdown */}
                                        <select className='w-50 py-2 px-2' onChange={handlePropertyChange} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }}>
                                            <option value="">Select Property</option>
                                            {properties && properties.length > 0 && properties.map(property => (
                                                <option key={property._id} value={property._id}>{property.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date range inputs */}
                                    <div style={{ display: 'flex', gap: '30px' }} className='mt-3'>

                                        <div>
                                            <label>Start Date:</label>
                                            <input className='w-100 py-2 px-2' type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} />
                                        </div>

                                        <div>
                                            <label>End Date:</label>
                                            <input className='w-100 py-2 px-2' type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} />
                                        </div>

                                    </div>

                                    <h2 className='mt-4'>Cash Payment Report (Subtotal: {calculatePaymentTotalCash('cash')})</h2>
                                    <Table striped bordered hover responsive>
                                        <thead style={{ backgroundColor: '#005f75', textAlign: 'center' }} >
                                            <tr style={{ color: '#ffff' }} >
                                                <th>Property Name</th>
                                                <th>Method</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                                <th>Invoice</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {tenants.map((Details, index) => (
                                                Details.contractInfo.payment
                                                    .filter(payment => payment.paymentmethod === 'cash')
                                                    .map((payment, paymentIndex) => (
                                                        <tr key={`${index}-${paymentIndex}`}>
                                                            <td style={{ textAlign: 'center' }}>{Details.property.name}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.paymentmethod}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.paymentstatus}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.amount} AED</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.checkorinvoice}</td>
                                                            <td style={{ textAlign: 'center' }}>{new Date(payment.collectiondate).toDateString()}</td>
                                                        </tr>
                                                    ))
                                            ))}
                                        </tbody>

                                    </Table>

                                    <h2 className='mt-5'>Bank Payment Report (Subtotal: {calculatePaymentTotalBank('bank')})</h2>

                                    <Table striped bordered hover responsive>
                                        <thead style={{ backgroundColor: '#005f75', textAlign: 'center' }}>
                                            <tr style={{ color: '#ffff' }}>
                                                <th>Property Name</th>
                                                <th>Method</th>
                                                <th>Status</th>
                                                <th>Amount</th>
                                                <th>Invoice</th>
                                                <th>Collection Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tenants.map((Details, index) => (
                                                Details.contractInfo.payment
                                                    .filter(payment => payment.paymentmethod === 'bank' && payment.paymentstatus === 'paid')
                                                    .map((payment, paymentIndex) => (
                                                        <tr key={`${index}-${paymentIndex}`}>
                                                            <td style={{ textAlign: 'center' }}>{Details.property.name}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.paymentmethod}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.paymentstatus}</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.amount} AED</td>
                                                            <td style={{ textAlign: 'center' }}>{payment.checkorinvoice}</td>
                                                            <td style={{ textAlign: 'center' }}>{new Date(payment.collectiondate).toDateString()}</td>
                                                        </tr>
                                                    ))
                                            ))}
                                        </tbody>
                                    </Table>


                                    <h2 className='mt-5'>Maintenance Report (Subtotal: {calculateMaintenanceTotal()})</h2>
                                    <Table striped bordered hover responsive className='mb-5' >
                                        <thead style={{ backgroundColor: '#005f75', textAlign: 'center' }} >
                                            <tr style={{ color: '#ffff' }} >
                                                <th>Property Name</th>
                                                <th>Maintenance Type</th>
                                                <th>Image</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                maintenance.map((maintenanceRecord, index) => {
                                                    console.log(maintenanceRecord, 'maintaincereceord');
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td style={{ textAlign: 'center' }} > {maintenanceRecord.property.name && maintenanceRecord.property.name} </td>
                                                                <td style={{ textAlign: 'center' }} > {maintenanceRecord.maintenanceType && maintenanceRecord.maintenanceType} </td>
                                                                <td style={{ textAlign: 'center' }}> {<img src={maintenanceRecord.image} alt="Image" />} </td>
                                                                <td style={{ textAlign: 'center' }} > {new Date(maintenanceRecord.date).toDateString()} </td>
                                                            </tr>
                                                        </>
                                                    )
                                                })
                                            }
                                        </tbody>

                                    </Table>

                                    <h2>Total VAT from Tenants (Subtotal: {calculateTotalVAT()})</h2>
                                    <Table striped bordered hover responsive className='mb-5' >
                                        <thead style={{ backgroundColor: '#005f75' }} >
                                            <tr style={{ color: '#ffff' }} >
                                                <th>Tenant Name</th>
                                                <th>Total VAT</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                totalVATData.map((tenantData, index) => (
                                                    <tr key={index}>
                                                        <td>{tenantData.tenantName}</td>
                                                        <td>{tenantData.totalVAT}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>

                                    <h1 className='mb-5'>Net Income: {calculateNetIncome()}</h1>






                                    {/* Clear button */}
                                    {/* <button onClick={handleClear}>Clear</button> */}

                                    {/* Display Payment tables */}
                                    {/* {tenants.length > 0 && (
                                        <div>
                                            <h2>Cash Payment Report (Subtotal: {calculatePaymentTotalCash('cash')})</h2>
                                            <BootstrapTable keyField='_id' data={tenants} columns={paymentColumnsCash} />
                                        </div>
                                    )} */}

                                    {/* {tenants.length > 0 && (
                                        <div>
                                            <h2>Bank Payment Report (Subtotal: {calculatePaymentTotalBank('bank')})</h2>
                                            <BootstrapTable keyField='_id' data={tenants} columns={paymentColumnsBank} />
                                        </div>
                                    )} */}

                                    {/* Display Maintenance table */}
                                    {/* {maintenance.length > 0 && (
                                        <div>
                                            <h2>Maintenance Report (Subtotal: {calculateMaintenanceTotal()})</h2>
                                            <BootstrapTable keyField='_id' data={maintenance} columns={maintenanceColumns} />
                                        </div>
                                    )} */}
                                </div>

                                {/* <div>
                                    <div className='mt-4'>
                                        <h2>Total VAT from Tenants (Subtotal: {calculateTotalVAT()})</h2>
                                        <BootstrapTable keyField='tenantName' data={totalVATData} columns={totalVATColumns} />
                                    </div>
                                </div> */}

                                {/* Display Net Income */}
                              
                            </div>
                        </Col>
                    </Row>
                </Col>

            </Row>
        </>

    );
};

export default Income;
