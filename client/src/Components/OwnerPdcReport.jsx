import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OwnerPdcReport = () => {
    const [tenants, setTenants] = useState([]);
    const [tenantData, setTenantData] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTenantData = async () => {
            try {
               
                const response = await axios.get(`/api/tenants/tenants-by-ownerforowner/${state.user._id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setTenantData(response.data);
            } catch (error) {
                console.error('Error fetching tenants:', error);
                setError('Error fetching tenants');
            }
        };

        fetchTenantData();
    }, [state.user._id, state.user.token]);

    // Calculate total PDC amount
    useEffect(() => {
        const totalPdcAmount = tenantData.reduce((total, tenant) => {
            return total + tenant.contractInfo.pdc.reduce((pdcTotal, pdc) => pdcTotal + pdc.amount, 0);
        }, 0);

        setTenants(totalPdcAmount);
    }, [tenantData]);

    const today = new Date();
    const todayPayments = [];

    tenantData.forEach(tenant => {
        tenant.contractInfo.pdc.forEach(check => {
            const paymentDate = new Date(check.date);
            if (paymentDate.toDateString() === today.toDateString()) {
                todayPayments.push({ tenant, check });
            }
        });
    });

    // Slice to show only three records for today's date
    const todayPaymentsSlice = todayPayments.slice(0, 3);

    return (
        <div className="row">
            <div className="col-12 grid-margin">
                <div className="card" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <div className="card-body">
                        <h4 className="card-title">Post Deposite Checks Report</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <p>Total PDC Amount: {tenants}</p>

                        {/* Today's Payments Table */}
                        <h3 className='mt-4'>Today's PDC</h3>
                        {todayPaymentsSlice.length >= 1 ? (
                            <Table striped bordered hover responsive>
                                <thead style={{ backgroundColor: '#005f75' }}>
                                    <tr>
                                        <th style={{ color: 'white' }}>Name</th>
                                        <th style={{ color: 'white' }}>Property Name</th>
                                        <th style={{ color: 'white' }}>Floor Name</th>
                                        <th style={{ color: 'white' }}>Unit Name</th>
                                        <th style={{ color: 'white' }}>Check Number</th>
                                        <th style={{ color: 'white' }}>Bank</th>
                                        <th style={{ color: 'white' }}>Date</th>
                                        <th style={{ color: 'white' }}>Amount</th>
                                        <th style={{ color: 'white' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayPaymentsSlice.map(({ tenant, check }, index) => (
                                        <tr key={`today-${index}`}>
                                            <td>{tenant.name || tenant.companyname}</td>
                                            <td>{tenant.property && tenant.property.name}</td>
                                            <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                                            <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                                            <td>{`${check.checkNumber && check.checkNumber} AED`}</td>
                                            <td>{check.bank}</td>
                                            <td>{new Date(check.date).toDateString()}</td>
                                            <td>{`${check.amount} AED`}</td>
                                            <td>
                                                <Button>Show More</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        ) : (
                            <div className='mt-2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h4 style={{ color: 'red' }}>Today's PDC is Not Available</h4>
                                <Button onClick={() => navigate('/allownerpdc')}>More Information</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerPdcReport;
