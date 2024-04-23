import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddAdministrationFee = () => {
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
        // Fetch all tenants from the API
        axios.get('/api/tenants/alltenants')
            .then(response => {
                setTenants(response.data);
            })
            .catch(error => {
                console.error('Error fetching tenants:', error);
            });
    }, []);

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
        <div className='mt-5'>
            <h2>Add Administration Fee</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="tenantId">Tenant:</label>
                    <select name="tenantId" id="tenantId" value={formData.tenantId} onChange={handleChange} required>
                        <option value="">Select Tenant</option>
                        {tenants.map(tenant => (
                            <option key={tenant._id} value={tenant._id}>{tenant.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="contractIssuingFees">Contract Issuing Fees:</label>
                    <input type="text" name="contractIssuingFees" id="contractIssuingFees" value={formData.contractIssuingFees} onChange={handleChange} />
                </div>
                <div>
                    <label htmlFor="ejariFee">Ejari Fee:</label>
                    <input type="text" name="ejariFee" id="ejariFee" value={formData.ejariFee} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="transferFees">Transfer Fees:</label>
                    <input type="text" name="transferFees" id="transferFees" value={formData.transferFees} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="terminationFees">Termination Fees:</label>
                    <input type="text" name="terminationFees" id="terminationFees" value={formData.terminationFees} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="contractExpiryFees">Contract Expiry Fees:</label>
                    <input type="text" name="contractExpiryFees" id="contractExpiryFees" value={formData.contractExpiryFees} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="maintenanceSecurityDeposit">Maintenance Security Deposit:</label>
                    <input type="text" name="maintenanceSecurityDeposit" id="maintenanceSecurityDeposit" value={formData.maintenanceSecurityDeposit} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="refundableGuarantee">Refundable Guarantee:</label>
                    <input type="text" name="refundableGuarantee" id="refundableGuarantee" value={formData.refundableGuarantee} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="lateRenewalFees">Late Renewal Fees:</label>
                    <input type="text" name="lateRenewalFees" id="lateRenewalFees" value={formData.lateRenewalFees} onChange={handleChange}  />
                </div>
                <div>
                    <label htmlFor="postponeChequeFees">Postpone Cheque Fees:</label>
                    <input type="text" name="postponeChequeFees" id="postponeChequeFees" value={formData.postponeChequeFees} onChange={handleChange}  />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default AddAdministrationFee;
