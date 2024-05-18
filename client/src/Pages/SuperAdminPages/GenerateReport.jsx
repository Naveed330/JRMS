import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import axios from 'axios';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { Col, Row, Table } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';

const GenerateReport = () => {
    const { state } = useContext(AuthContext);
    const [owners, setOwners] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [tenants, setTenants] = useState([]);
    const [maintenance, setMaintenance] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [properties, setProperties] = useState([]);

    console.log(maintenance, 'tenantsreport')

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

    // Filter PDC and Payment records by date range
    useEffect(() => {
        const filterRecordsByDateRange = () => {
            if (startDate && endDate) {
                setTenants(prevTenants => {
                    const filteredTenants = prevTenants.map(tenant => {
                        const filteredPDC = tenant.contractInfo.pdc.filter(check => {
                            const checkDate = new Date(check.date);
                            return checkDate >= new Date(startDate) && checkDate <= new Date(endDate);
                        });
                        const filteredPayment = tenant.contractInfo.payment.filter(payment => {
                            const paymentDate = new Date(payment.date);
                            return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
                        });
                        return {
                            ...tenant,
                            contractInfo: {
                                ...tenant.contractInfo,
                                pdc: filteredPDC,
                                payment: filteredPayment
                            }
                        };
                    });
                    return filteredTenants;
                });
            }
        };
        filterRecordsByDateRange();
    }, [startDate, endDate]);




    // Calculate subtotal amount for PDC
    const calculatePDCTotal = () => {
        return tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.pdc.reduce((subtotal, check) => subtotal + check.amount, 0);
        }, 0);
    };
    const calculatePaymentTotalCash = () => {
        return tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'cash')
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);
    };
    const calculatePaymentTotalBank = () => {
        return tenants.reduce((total, tenant) => {
            return total + tenant.contractInfo.payment
                .filter(payment => payment.paymentmethod === 'bank')
                .reduce((subtotal, payment) => subtotal + payment.amount, 0);
        }, 0);
    };

    // Calculate subtotal amount for Maintenance
    const calculateMaintenanceTotal = () => {
        return maintenance.reduce((total, record) => total + record.amount, 0);
    };

    // Define columns for PDC table
    const pdcColumns = [
        // {
        //     dataField: 'property.name',
        //     text: 'Property Name'
        // },
        // {
        //     dataField: 'contractInfo.pdc',
        //     text: 'PDC',
        //     formatter: (cell, row) => (
        //         <>
        //             {cell.map(check => {
        //                 return (
        //                     <ul>
        //                         <li key={check._id}>
        //                             Bank: {check.bank}
        //                         </li>

        //                         <li>
        //                             Amount: {check.amount}
        //                         </li>

        //                         <li>
        //                             Check Number: {check.checkNumber}
        //                         </li>

        //                         <li>
        //                             Date:  {new Date(check.date).toDateString()}
        //                         </li>

        //                     </ul>
        //                 )

        //             }
        //             )}
        //         </>
        //     )
        // }
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
                    {cell.filter(payment => payment.paymentmethod === 'bank').map(payment => (
                        <li key={payment._id}>
                            Method: {payment.paymentmethod}, Status: {payment.paymentstatus}, Amount: {payment.amount}, Bank: {payment.bank}, Date: {payment.date}
                        </li>
                    ))}
                </ul>
            )
        }
    ];
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
                    {cell.filter(payment => payment.paymentmethod === 'cash').map(payment => (
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

    const calculatePaymentTotal = (paymentStatus) => {
        let total = 0;
        tenants.forEach(tenant => {
            tenant.contractInfo.payment.forEach(payment => {
                if (payment.paymentmethod === 'bank' && payment.paymentstatus === paymentStatus) {
                    total += payment.amount;
                }
            });
        });
        return total;
    };

    const totalPaidAmount = calculatePaymentTotal('paid');
    const totalPendingAmount = calculatePaymentTotal('pending');


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

                                <div style={{ display: 'flex', gap: '20px' }} >
                                    {/* Owner select dropdown */}
                                    <select className='w-50 py-2 px-2' onChange={(e) => setSelectedOwner(owners.find(owner => owner._id === e.target.value))} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} >
                                        <option value="">Select Owner</option>
                                        {owners.map(owner => (
                                            <option key={owner._id} value={owner._id}>{owner.name}</option>
                                        ))}
                                    </select>

                                    {/* Property select dropdown */}
                                    <select className='w-50 py-2 px-2' onChange={handlePropertyChange} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} >
                                        <option value="">Select Property</option>
                                        {properties && properties.length > 0 && properties.map(property => (
                                            <option key={property._id} value={property._id}>{property.name}</option>
                                        ))}
                                    </select>
                                </div>


                                {/* Date range inputs */}
                                <div style={{ display: 'flex', gap: '30px' }} className='mt-3' >

                                    <div>
                                        <label>Start Date:</label>
                                        <input type="date" className='w-100 py-2 px-2' value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} />
                                    </div>

                                    <div>
                                        <label>End Date:</label>
                                        <input type="date" className='w-100 py-2 px-2' value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ borderRadius: '10px', border: '1px solid #ebedf2' }} />
                                    </div>

                                </div>

                                {/* Clear button */}
                                {/* <button onClick={handleClear}>Clear</button> */}

                                {/* Display PDC table */}
                                <h2 className='mt-4' >PDC Report (Subtotal: {calculatePDCTotal()})</h2>
                                <Table striped bordered hover responsive>
                                    <thead style={{ backgroundColor: '#005f75', textAlign: 'center' }} >
                                        <tr style={{ color: '#ffff' }} >
                                            <th>Property Name</th>
                                            <th>Bank</th>
                                            <th>Amount</th>
                                            <th>Check Number</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.map((Details, index) => (
                                            Details.contractInfo.pdc.map((paymentDetails, paymentIndex) => {
                                                const formattedDate = paymentDetails.date ? new Date(paymentDetails.date).toDateString() : '';
                                                return (
                                                    <tr key={`${index}-${paymentIndex}`}>
                                                        <td style={{ textAlign: 'center' }}>{Details.property.name}</td>
                                                        <td style={{ textAlign: 'center' }} >{paymentDetails.bank}</td>
                                                        <td style={{ textAlign: 'center' }} >{paymentDetails.amount} AED</td>
                                                        <td style={{ textAlign: 'center' }} >{paymentDetails.checkNumber}</td>
                                                        <td style={{ textAlign: 'center' }} >{formattedDate}</td>
                                                    </tr>
                                                );
                                            })
                                        ))}
                                    </tbody>
                                </Table>

                                {/* Display Cash table */}
                                <h2 className='mt-5'>Cash Payment Report (Subtotal: {calculatePaymentTotalCash('cash')})</h2>
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

                                {/* Display Bank paid table */}
                                <h2 className='mt-5'>Bank Payment Report (Subtotal: {totalPaidAmount} AED)</h2>
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

                                {/* Display Bank pending table */}
                                <h2 className='mt-5'>Bank Pending Report (Subtotal: {totalPendingAmount} AED)</h2>
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
                                                .filter(payment => payment.paymentmethod === 'bank' && payment.paymentstatus === 'pending')
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


                                {/* Display Maintenance table */}
                                <h2 className='mt-5'>MaintenanceReport (Subtotal: {calculateMaintenanceTotal('bank')})</h2>
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
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>

    );
};

export default GenerateReport;










