import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Button, Card, Col, Row } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { AuthContext } from '../AuthContext';

const AddAdministrationFee = () => {
    const { state } = useContext(AuthContext);
    const [tenants, setTenants] = useState([]);
    const [formData, setFormData] = useState({
        tenantId: '',
        contractIssuingFees: '',
        ejariFee: '',
        transferFees: '',
        terminationFees: '',
        contractExpiryFees: '',
        maintenanceSecurityDeposit: '',
        refundableGuarantee: '',
        lateRenewalFees: '',
        postponeChequeFees: ''
    });

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`
                    }
                });
                setTenants(response.data);
            } catch (error) {
                console.error('Error fetching tenants:', error);
            }
        };

        fetchTenants();
    }, [state.user.token]);

    const handleChange = event => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = event => {
        event.preventDefault();
        // Send form data to the API
        axios.post('/api/adminstrationfees/add-administration-fees', formData)
            .then(response => {
                console.log('Administration fee added:', response.data);
                // Optionally, reset the form
                setFormData({
                    tenantId: '',
                    contractIssuingFees: '',
                    ejariFee: '',
                    transferFees: '',
                    terminationFees: '',
                    contractExpiryFees: '',
                    maintenanceSecurityDeposit: '',
                    refundableGuarantee: '',
                    lateRenewalFees: '',
                    postponeChequeFees: ''
                });
            })
            .catch(error => {
                console.error('Error adding administration fee:', error);
            });
    };

    return (
        <div>
            <Row>
                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10}  >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                                <div className="bold text-center text-uppercase" style={{ marginTop: '95px' }}>
                                    <h3>Add Administration Fee</h3>
                                </div>
                                <Card.Body>


                                    <form onSubmit={handleSubmit}>
                                        <div className="row" >
                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="tenantId">Tenant:</label>
                                                <select
                                                    className='w-100 py-2 px-1'
                                                    style={{ borderRadius: '8px', border: '1px solid #ebedf2' }}
                                                    name="tenantId"
                                                    id="tenantId"
                                                    value={formData.tenantId}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Select Tenant</option>
                                                    {tenants.map(tenant => (
                                                        tenant.unitId.map(unit => (
                                                            <option key={tenant._id} value={tenant._id}>
                                                                {tenant.name}/{tenant.property.name}/{unit.unitNo}
                                                            </option>
                                                        ))
                                                    ))}
                                                </select>

                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="contractIssuingFees">Contract Issuing Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="contractIssuingFees" id="contractIssuingFees" value={formData.contractIssuingFees} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="ejariFee">Ejari Fee:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="ejariFee" id="ejariFee" value={formData.ejariFee} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6">
                                                <label htmlFor="transferFees">Transfer Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="transferFees" id="transferFees" value={formData.transferFees} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="terminationFees">Termination Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="terminationFees" id="terminationFees" value={formData.terminationFees} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="contractExpiryFees">Contract Expiry Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="contractExpiryFees" id="contractExpiryFees" value={formData.contractExpiryFees} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="maintenanceSecurityDeposit">Maintenance Security Deposit:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="maintenanceSecurityDeposit" id="maintenanceSecurityDeposit" value={formData.maintenanceSecurityDeposit} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="refundableGuarantee">Refundable Guarantee:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="refundableGuarantee" id="refundableGuarantee" value={formData.refundableGuarantee} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="lateRenewalFees">Late Renewal Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="lateRenewalFees" id="lateRenewalFees" value={formData.lateRenewalFees} onChange={handleChange} />
                                            </div>

                                            <div className="mb-3 col-md-6" >
                                                <label htmlFor="postponeChequeFees">Postpone Cheque Fees:</label>
                                                <input type="text" style={{ borderRadius: '10px' }} className="form-control" name="postponeChequeFees" id="postponeChequeFees" value={formData.postponeChequeFees} onChange={handleChange} />
                                            </div>
                                        </div>
                                        <Button variant="success" type="submit">Submit</Button>
                                    </form>
                                </Card.Body>
                            </Card>


                        </Col>
                    </Row>
                </Col>
            </Row>

        </div>
    );
};

export default AddAdministrationFee;