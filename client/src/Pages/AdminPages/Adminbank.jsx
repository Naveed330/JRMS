import React, { useState, useEffect, useContext } from 'react';
import { Col, Row } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import AdminSideBar from '../../Components/AdminSideBar';
import { AuthContext } from '../AuthContext';
import Select from 'react-select';

const AdminBank = () => {
    const [bankTenants, setBankTenants] = useState([]);
    const [filteredTenants, setFilteredTenants] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchBankTenants = async () => {
            try {
                const response = await fetch('/api/tenants/alltenantsforadmin', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch tenant data');
                }
                const data = await response.json();
                // Filter tenants who made payment by bank
                const bankPaymentsTenants = data.filter(tenant =>
                    tenant.contractInfo.payment.some(payment => payment.paymentmethod === 'bank')
                );
                setBankTenants(bankPaymentsTenants);
                setFilteredTenants(bankPaymentsTenants); // Initialize filteredTenants with all bank tenants
            } catch (error) {
                console.error('Error fetching tenant data:', error);
            }
        };

        fetchBankTenants();
    }, [state.user.token]); // Depend on token

    useEffect(() => {
        // Filter tenants based on search term
        const filtered = bankTenants.filter(tenant =>
            (tenant.name && tenant.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (tenant.companyname && tenant.companyname.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredTenants(filtered);
    }, [searchTerm, bankTenants]);

    const handleInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectTenant = (selectedOption) => {
        setSearchTerm(selectedOption ? selectedOption.label : '');
    };

    const tenantOptions = bankTenants.map(tenant => ({
        label: tenant.name || tenant.companyname,
        value: tenant._id
    }));

    return (
        <>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <AdminSideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '90px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <h2 className='text-center' >Bank Payments</h2>

                            <div style={{width:'100%', maxWidth:'500px'}} >
                            <Select
                                placeholder="Search by tenant name"
                                onChange={handleSelectTenant}
                                options={tenantOptions}
                                isClearable
                                className='mb-4'
                            />
                            </div>
                          
                            <Table striped bordered hover responsive className='mb-5' >
                                <thead style={{ backgroundColor: '#005f75' }} >
                                    <tr style={{ color: '#ffff' }} >
                                        <th>Name</th>
                                        <th>Contact</th>
                                        <th>Property Name</th>
                                        <th>Floor Name</th>
                                        <th>Unit Name</th>
                                        <th>Amount</th>
                                        <th>Invoice</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTenants.map(tenant => (
                                        <tr key={tenant._id}>
                                            <td>{tenant.name || tenant.companyname}</td>
                                            <td>{tenant.contact && tenant.contact}</td>
                                            <td>{tenant.property && (tenant.property?.name || tenant.property?.buildingname)}</td>
                                            <td>{tenant.floorId?.name}</td>
                                            <td>
                                                {tenant.unitId && tenant.unitId.map(unit => unit.type).join(', ')}
                                            </td>
                                            {tenant.contractInfo.payment.map(payment => (
                                                payment.paymentmethod === 'bank' && (
                                                    <React.Fragment key={payment._id}>
                                                        <td>{`${payment.amount && payment.amount} AED`}</td>
                                                        <td>{`${payment.checkorinvoice && payment.checkorinvoice} AED`}</td>
                                                        <td>{new Date(payment.date && payment.date).toLocaleDateString()}</td>
                                                    </React.Fragment>
                                                )
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </Col>

            </Row>
        </>
    );
};

export default AdminBank;
