import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../AuthContext';
import { Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import OwnerSideBar from '../../Components/OwnerSideBar';

const AllTenantsForOwner = () => {
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
            });
    }, [state.user._id]);

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <OwnerSideBar />
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h2 className='text-center'>All Tenants</h2>
                            {error && <p>Error: {error}</p>}
                            <Table responsive striped bordered hover className='mt-3'>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Duration</th>
                                        <th>Final Amount</th>
                                        <th>Paid Amount</th>
                                        <th>Unit Type</th>
                                        <th>Floor Name</th>
                                        <th>Action</th>
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
                                                <td>{tenant?.contractInfo?.finalAmount && tenant?.contractInfo?.finalAmount}</td>
                                                <td>{tenant?.contractInfo?.paidAmount && tenant?.contractInfo?.paidAmount}</td>
                                                <td>{tenant?.unitId[0]?.type || 'No Unit Available'}</td>
                                                <td>{tenant.floorId.name && tenant.floorId.name}</td>
                                                <td>
                                                    <Link
                                                        variant="primary"
                                                        to={`/tenantdetailsforowner/${tenant._id}`}
                                                        style={{ backgroundColor: '#301bbe', color: 'white', textDecoration: 'none', borderRadius: '10px' }}
                                                        className='py-2 px-3'
                                                    >
                                                        View
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                </Col>
            </Row>
        </div>
    );
};

export default AllTenantsForOwner;
