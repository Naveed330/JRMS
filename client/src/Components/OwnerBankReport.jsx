import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Table } from 'react-bootstrap';

const OwnerBankReport = () => {
    const [tenants, setTenants] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTenants = async () => {
            try {
               
                const response = await axios.get(`/api/tenants/tenants-by-ownerforowner/${state.user._id}`, {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setTenants(response.data);
            } catch (error) {
                console.error('Error fetching tenants:', error);
                setError('Error fetching tenants');
            }
        };
    
        fetchTenants();
    }, [state.user._id, state.user.token]);
    

    // Calculate total amount for bank and cash payments
    const totalBankAmount = tenants.reduce((total, tenant) => {
        return total + tenant.contractInfo.payment
            .filter(payment => payment.paymentmethod === "bank")
            .reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);

    const totalCashAmount = tenants.reduce((total, tenant) => {
        return total + tenant.contractInfo.payment
            .filter(payment => payment.paymentmethod === "cash")
            .reduce((sum, payment) => sum + payment.amount, 0);
    }, 0);

    return (
        <div className="row">
            <div className="col-12 grid-margin">
                <div className="card" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                    <div className="card-body">
                        <h4 className="card-title">Bank Report</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="row">
                            <div className="col-md-6">
                                <h5>Total Bank Amount: {totalBankAmount}</h5>
                                <Table striped bordered hover responsive >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <tr style={{ color: 'white' }} >
                                            <th>Property Name</th>
                                            <th>Check No's</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.map(tenant => (
                                            tenant.contractInfo.payment
                                                .filter(payment => payment.paymentmethod === "bank")
                                                .map(payment => (
                                                    <tr key={payment._id}>
                                                        <td>{tenant.property.name}</td>
                                                        <td>{`${payment.checkorinvoice} AED`}</td>
                                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                        <td>{`${payment.amount} AED`}</td>
                                                    </tr>
                                                ))
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                            <div className="col-md-6">
                                <h5>Total Cash Amount: {totalCashAmount}</h5>
                                <Table striped bordered hover responsive >
                                    <thead style={{ backgroundColor: '#005f75' }} >
                                        <tr style={{ color: 'white' }} >
                                            <th>Property Name</th>
                                            <th>Invoice NO's</th>
                                            <th>Date</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tenants.map(tenant => (
                                            tenant.contractInfo.payment
                                                .filter(payment => payment.paymentmethod === "cash")
                                                .map(payment => (
                                                    <tr key={payment._id}>
                                                        <td>{tenant.property.name}</td>
                                                        <td>{`${payment.checkorinvoice} AED`}</td>
                                                        <td>{new Date(payment.date).toLocaleDateString()}</td>
                                                        <td>{`${payment.amount} AED`}</td>
                                                    </tr>
                                                ))
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerBankReport;
