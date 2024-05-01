import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Col, Table } from 'react-bootstrap';
import { Link, useNavigate, } from 'react-router-dom';
import { AuthContext } from '../Pages/AuthContext';

const TenantsSection = () => {
    const [tenants, setTenants] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenants(response.data.slice(0, 3)); // Only get the first three tenants
            } catch (error) {
                setError('Failed to fetch tenants');
            }
        };
        fetchTenants();
    }, []);

    const handleShowMore = () => {
        navigate('/alltenant');
    };

    return (
        <div className="row">
            <div className="card" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-body">
                    <h3  style={{color: '#4b2f00'}}>Top Tenants</h3>
                    {error && <p>Error: {error}</p>}
                    <Table responsive striped bordered hover className='mt-1'>
                        <thead style={{ backgroundColor: '#d7aa47' }} >
                            <tr>
                                <th style={{ color: 'white' }} >Name</th>
                                <th style={{ color: 'white' }} >Contact</th>
                                <th style={{ color: 'white' }} >Start Date</th>
                                <th style={{ color: 'white' }} >End Date</th>
                                <th style={{ color: 'white' }} >Duration</th>
                                <th style={{ color: 'white' }} >Final Amount</th>
                                <th style={{ color: 'white' }} >Paid Amount</th>
                                <th style={{ color: 'white' }} >Unit Type</th>
                                <th style={{ color: 'white' }} >Floor Name</th>
                                <th style={{ color: 'white' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tenants.map(tenant => {
                                const startingDate = new Date(tenant.contractInfo.startingDate);
                                const endDate = new Date(tenant.contractInfo.endDate);

                                return (
                                    <tr key={tenant._id}>
                                        <td>{tenant.name || tenant.companyname}</td>
                                        <td>{tenant.contact && tenant.contact}</td>
                                        <td>{startingDate.toDateString()}</td>
                                        <td>{endDate.toDateString()}</td>
                                        <td>{`${tenant.contractInfo.monthsDuration && tenant.contractInfo.monthsDuration} month`}</td>
                                        <td>{`${tenant?.contractInfo?.finalAmount && tenant?.contractInfo?.finalAmount} AED`}</td>
                                        <td>{`${tenant?.contractInfo?.paidAmount && tenant?.contractInfo?.paidAmount} AED`}</td>
                                        <td>{tenant?.unitId[0]?.type || 'No Unit Available'}</td>
                                        <td>{tenant.floorId.name && tenant.floorId.name}</td>
                                        <td>
                                            <Link
                                                // variant="primary"
                                                to={`/tenantdetails/${tenant._id}`}
                                                style={{ backgroundColor: '#b3750e', color: 'black', textDecoration: 'none', borderRadius: '10px' }}
                                                className='py-2 px-3'
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <div className="text-center mt-2">
                            <button className="btn btn-primary" onClick={handleShowMore}>Show More</button>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default TenantsSection;