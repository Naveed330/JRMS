import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Col, Row, Form, FormControl, Dropdown } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const AllTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [filteredTenants, setFilteredTenants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [selectedTenant, setSelectedTenant] = useState(null);
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenants(response.data);
                setFilteredTenants(response.data); // Initialize filteredTenants with all tenants
            } catch (error) {
                setError('Failed to fetch tenants');
            }
        };
        fetchTenants();
    }, [state.user.token]);

    useEffect(() => {
        // Filter tenants based on search term
        const filtered = tenants.filter(tenant =>
            (tenant.name && tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tenant.companyname && tenant.companyname.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTenants(filtered);
    }, [searchTerm, tenants]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedTenant(null); // Reset selected tenant
    };

    const handleSelectTenant = (selectedOption) => {
        setSelectedTenant(selectedOption);
        setSearchTerm(selectedOption ? selectedOption.label : '');
    };

    const tenantOptions = tenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <SideBar />
                </Col>


                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }}>
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h2 className='text-center'>All Tenants</h2>
                            {error && <p>Error: {error}</p>}

                            <div style={{ width: '100%', maxWidth: '500px' }} >
                                <Select
                                    placeholder="Search by tenant name"
                                    value={selectedTenant}
                                    onChange={handleSelectTenant}
                                    options={tenantOptions}
                                    isClearable
                                    className='mb-4'
                                    style={{ width: '100%', maxWidth: '500px', backgroundColor: 'red' }}
                                />

                            </div>



                            <Table responsive striped bordered hover className='mt-1'>
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
                                                <td>{tenant?.contractInfo?.finalAmount && tenant?.contractInfo?.finalAmount}</td>
                                                <td>{tenant?.contractInfo?.paidAmount && tenant?.contractInfo?.paidAmount}</td>
                                                <td>{tenant?.unitId[0]?.type || 'No Unit Available'}</td>
                                                <td>{tenant.floorId.name && tenant.floorId.name}</td>
                                                <td>
                                                    <Link
                                                        variant="primary"
                                                        to={`/tenantdetails/${tenant._id}`}
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



