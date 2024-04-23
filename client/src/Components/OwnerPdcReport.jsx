import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Table } from 'react-bootstrap';

const OwnerPdcReport = () => {
    const [tenants, setTenants] = useState([]);
    const { state } = useContext(AuthContext);
    const [error, setError] = useState(''); 

    useEffect(() => {
        // Fetch all tenants for the owner by ownerId
        axios.get(`/api/tenants/tenants-by-owner/${state.user._id}`)
            .then(response => {
                setTenants(response.data);
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
                setError('Error fetching tenants');
            });
    }, [state.user._id]);

    // Calculate total PDC amount
    const totalPdcAmount = tenants.reduce((total, tenant) => {
        return total + tenant.contractInfo.pdc.reduce((pdcTotal, pdc) => pdcTotal + pdc.amount, 0);
    }, 0);

    return (
        <div className="row">
            <div className="col-12 grid-margin">
                <div className="card" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                    <div className="card-body" >
                        <h4 className="card-title">Post Deposite Checks Report</h4>
                        {error && <p className="text-danger">{error}</p>}
                        <p>Total PDC Amount: {totalPdcAmount}</p>
                        <div className="table-responsive" >
                            <Table bordered striped responsive >
                                <thead>
                                    <tr>
                                        <th>Tenant Name</th>
                                        <th>Property Name</th>
                                        <th>Unit Number</th>
                                        <th>PDC Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tenants.map(tenant => (
                                        <tr key={tenant._id}>
                                            <td>{tenant.name}</td>
                                            <td>{tenant.property[0].name}</td>
                                            <td>{tenant.unitId.map(unit => unit.unitNo).join(', ')}</td>
                                            <td>
                                                <ul className="list-unstyled">
                                                    {tenant.contractInfo.pdc.map(pdc => (
                                                        <li key={pdc._id}>
                                                            Check Number: {pdc.checkNumber}, Date: {new Date(pdc.date).toLocaleDateString()}, Amount: {pdc.amount}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerPdcReport;
