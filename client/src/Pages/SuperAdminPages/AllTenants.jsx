import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Col, Row, Form, FormControl, Dropdown, Button, Modal } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const AllTenants = () => {
    const [tenants, setTenants] = useState([]);
    const [filteredTenants, setFilteredTenants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const [selectedTenant, setSelectedTenant] = useState(null);
    // const [tenantStatus, setSelectedTenantStatus] = useState('')
    const [selectedTenantId, setSelectedTenantId] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [selectedTenantStatus, setSelectedTenantStatus] = useState('');
    const [tenantId, setTenantId] = useState('');
    const [status, setStatus] = useState('');
    // console.log(tenantStatus, 'tenantStatus');

    const { state } = useContext(AuthContext);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
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
        const filtered = tenants.filter(tenant =>
            (tenant.name && tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tenant.companyname && tenant.companyname.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTenants(filtered);
    }, [searchTerm, tenants]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
        setSelectedTenant(null);
    };

    const handleSelectTenant = (selectedOption) => {
        setSelectedTenant(selectedOption);
        setSelectedTenantId(selectedOption ? selectedOption.value : '');
        setSearchTerm(selectedOption ? selectedOption.label : '');
    };

    const tenantOptions = tenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    const toggleDropdown = (id) => {
        setShowStatusModal(true);
        setTenantId(id);
    };

    const handleStatusChange = () => {
        // Implement your logic to update tenant status here
        axios.put(`/api/tenants/updatestatus/${tenantId}`, { status: status }, {
            headers: {
                Authorization: `Bearer ${state.user.token}`
            }
        })
        setShowStatusModal(false);
        navigate('/allcasetenant')
    };

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
                                        <th className='text-center' >Action</th>
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
                                                        // variant="primary"
                                                        to={`/tenantdetails/${tenant._id}`}
                                                        style={{ backgroundColor: '#1bcfb4', color: 'white', textDecoration: 'none', }}
                                                        className='py-2 px-3'
                                                    >
                                                        Contract
                                                    </Link>
                                                    <Link
                                                        variant="primary"
                                                        to={`/tenantreport/${tenant._id}`}
                                                        style={{ backgroundColor: '#1bcfb4', color: 'white', textDecoration: 'none', margin: '2px' }}
                                                        className='py-2 px-3'
                                                    >
                                                        Report
                                                    </Link>

                                                    {/* <Button size='sm' className='py-2' style={{ backgroundColor: '#1bcfb4', color: 'white', border: 'none' }} onClick={() => ChangeStatusHandler(tenant._id)} >Status</Button> */}
                                                    <button
                                                        size='sm'
                                                        className='py-2'
                                                        style={{ backgroundColor: '#1bcfb4', color: 'white', border: 'none' }}
                                                        onClick={() => toggleDropdown(tenant._id)}
                                                    >
                                                        Action
                                                    </button>
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

            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title style={{ textAlign: 'center', fontSize: '25px' }} className='mt-2'>Tenants Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mt-4' style={{ width: '100%', maxWidth: '500px', margin: 'auto' }}>
                        <select
                            style={{ borderRadius: '8px', border: '1px solid #ebedf2' }}
                            className='w-100 py-2'
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">Select Status</option>
                            <option value="Case"  >Case</option>
                            {/* <option value="Cancel">Cancel</option> */}
                        </select>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='mt-4' variant="secondary" onClick={() => setShowStatusModal(false)}>Close</Button>
                    <Button className='mt-4' variant="primary" onClick={handleStatusChange}>Change Status</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
};

export default AllTenants;

