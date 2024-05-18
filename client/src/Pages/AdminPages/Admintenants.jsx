import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AdminSideBar from '../../Components/AdminSideBar';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const AllTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [filteredTenants, setFilteredTenants] = useState([]);
    const [error, setError] = useState('');
    const { state } = useContext(AuthContext);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenantsforadmin', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                setTenants(response.data);
                setFilteredTenants(response.data);
            } catch (error) {
                setError('Failed to fetch tenants');
            }
        };
        fetchTenants();
    }, [state.user.token]);

    useEffect(() => {
        // Filter tenants based on selectedTenant
        if (selectedTenant) {
            const filteredData = tenants.filter(tenant => tenant.name === selectedTenant.label);
            setFilteredTenants(filteredData);
        } else {
            setFilteredTenants(tenants);
        }
    }, [selectedTenant, tenants]);

    const tenantOptions = tenants.map(tenant => ({ label: tenant.name || tenant.companyname, value: tenant._id }));

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <AdminSideBar />
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
                            <h2 className='text-center'>All Tenants</h2>
                            <div style={{ width: '100%', maxWidth: '500px' }} >
                                <Select
                                    placeholder="Search by tenant name"
                                    value={selectedTenant}
                                    onChange={setSelectedTenant}
                                    options={tenantOptions}
                                    isClearable
                                />
                            </div>
                            {error && <p>Error: {error}</p>}
                            <Table responsive striped bordered hover className='mt-3 mb-5'>
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr style={{ color: '#ffff' }} >
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
                                    {filteredTenants.map(tenant => {
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
                                                        variant="primary"
                                                        to={`/tenantdetailsofadmin/${tenant._id}`}
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

export default AllTenants;
