import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { addMonths, format } from 'date-fns'; // Importing necessary functions from date-fns
import { Button, Card, Col, Row } from 'react-bootstrap';
import SideBar from '../../Components/SideBar';
import { AuthContext } from '../AuthContext';

const RenewalContract = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    tenantId: id,
    contractInfo: {
      startingDate: '',
      securitydeposite: '',
      graceperiod: '',
      numberofoccupants: '',
      Waterandelecbill: '',
      pet: false,
      usage: '',
      monthsDuration: '',
      endDate: '',
      totalContractAmount: '',
      VAT: 0,
      otherCost: 0,
      parking: false,
      parkingValue: '',
      discount: '',
      finalAmount: '', // Initialize finalAmount field
      paidAmount: '',
      bank: '',
      totalChecks: '',
      pdc: [
        {
          checkNumber: '',
          isTransfer: false,
          bank: '',
          date: '',
          amount: '',
          pdcstatus: '',
          submissiondate: '',
          type: '',
          remarks: '',
        },
      ],
      payment: [],
    },
  });

  const [tenantDetails, setTenantDetails] = useState(null);
  const [error, setError] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const { state } = useContext(AuthContext);

  console.log(tenantDetails, 'tenantDetails')

  useEffect(() => {
    calculateContractDetails();
  }, []);

  useEffect(() => {
    const fetchTenantDetails = async () => {
      try {
        const response = await axios.get(`/api/tenants/tenant/${id}`, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        setTenantDetails(response.data);
      } catch (error) {
        setError('Failed to fetch tenant details');
      }
    };
    fetchTenantDetails();
  }, [id, state.user.token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedFormData = { ...formData };

    // For nested fields inside contractInfo object
    if (name.includes('contractInfo.')) {
      const fieldName = name.split('.')[1];
      updatedFormData.contractInfo[fieldName] = type === 'checkbox' ? checked : value;

      // Check if monthsDuration or startingDate is updated
      if (fieldName === 'monthsDuration' || fieldName === 'startingDate') {
        const { startingDate, monthsDuration } = updatedFormData.contractInfo;
        if (startingDate && monthsDuration) {
          let endDate = addMonths(new Date(startingDate), parseInt(monthsDuration));
          // Subtract one day from the calculated end date
          endDate = new Date(endDate.getTime() - (1 * 24 * 60 * 60 * 1000)); // Subtracting one day in milliseconds
          updatedFormData.contractInfo.endDate = format(endDate, 'yyyy-MM-dd');
        }
      }

      // Recalculate final amount
      calculateContractDetails(updatedFormData);
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };


  const calculateContractDetails = () => {
    const updatedFormData = { ...formData };

    // Calculate finalAmount
    let finalAmount = parseFloat(updatedFormData.contractInfo.totalContractAmount);

    // If discount is provided, deduct it from the totalContractAmount
    if (updatedFormData.contractInfo.discount) {
      const discount = parseFloat(updatedFormData.contractInfo.discount);
      finalAmount -= discount;
    }

    // Calculate VAT amount
    const VATAmount = (finalAmount * parseFloat(updatedFormData.contractInfo.VAT)) / 100;

    // Add VAT amount to the final amount
    finalAmount += VATAmount;

    // Add other cost
    finalAmount += parseFloat(updatedFormData.contractInfo.otherCost);

    // Add parking value if parking is selected
    if (updatedFormData.contractInfo.parking) {
      const parkingValue = parseFloat(updatedFormData.contractInfo.parkingValue);
      finalAmount += parkingValue;
    }

    // Update formData with calculated finalAmount
    updatedFormData.contractInfo.finalAmount = finalAmount.toFixed(2); // Round to 2 decimal places

    // Update formData state
    setFormData(updatedFormData);
  };

  const handleTotalChecksChange = (e) => {
    const totalChecks = parseInt(e.target.value);
    const monthsDuration = parseInt(formData.contractInfo.monthsDuration);

    if (!isNaN(totalChecks) && totalChecks <= monthsDuration) {
      const finalAmountPerCheck = Math.round(parseFloat(formData.contractInfo.finalAmount) / totalChecks); // Round to the nearest whole number
      const updatedPdc = [];

      for (let i = 0; i < totalChecks; i++) {
        const checkDate = addMonths(new Date(formData.contractInfo.startingDate), i);
        updatedPdc.push({
          bank: '',
          checkNumber: '',
          amount: finalAmountPerCheck,
          date: format(checkDate, 'yyyy-MM-dd'),
        });
      }

      const updatedFormData = {
        ...formData,
        contractInfo: {
          ...formData.contractInfo,
          totalChecks: totalChecks,
          pdc: updatedPdc,
        },
      };

      setFormData(updatedFormData);
    } else {
      console.error('Total checks should not exceed months duration.');
      // You can also set an error state here if needed
    }
  };

  const handleSecurityDepositChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      contractInfo: {
        ...formData.contractInfo,
        securitydeposite: value
      }
    });
  };

  const handleCheckDetailChange = (index, field, value) => {
    const updatedPdc = [...formData.contractInfo.pdc];
    const originalAmount = updatedPdc[index].amount;

    if (field === 'amount') {
      value = parseFloat(value);
      if (!isNaN(value)) {
        value = Math.round(value);
      }

      const difference = originalAmount - value;
      updatedPdc[index][field] = value;

      const remainingChecks = updatedPdc.length - (index + 1);
      if (remainingChecks > 0) {
        const adjustment = Math.floor(difference / remainingChecks);
        for (let i = index + 1; i < updatedPdc.length; i++) {
          updatedPdc[i].amount += adjustment;
        }
      }
    } else {
      updatedPdc[index][field] = value;
    }

    const updatedFormData = {
      ...formData,
      contractInfo: {
        ...formData.contractInfo,
        pdc: updatedPdc,
      },
    };

    setFormData(updatedFormData);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tenants/renewtenant', formData , {
        headers: {
          Authorization: `Bearer ${state.user.token}`
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Row>
        <Col xs={6} sm={6} md={3} lg={2} xl={2}>
          <div>
            <SideBar />
          </div>
        </Col>

        <Col xs={12} sm={12} md={12} lg={10} xl={10}>
          <Row xs={1} md={2} lg={3}>
            <Col xs={12} sm={12} md={12} lg={10} xl={10}>
              <div style={{ marginTop: '90px' }}>
                <h2>Renewal Contract Form</h2>
                <form onSubmit={handleSubmit}>

                  <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                    <Card.Body>

                      {/* <div className="col-md-4">
                        <div className="form-group">
                          <label htmlFor="unit">Usage</label>
                          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} >
                            <select className='w-100 py-2 px-2' style={{ borderRadius: '8px', border: '1px solid #ebedf2' }} name="contractInfo.usage" value={formData.contractInfo.usage} onChange={handleInputChange} required>
                              <option value="Commercial">Commercial</option>
                              <option value="Residential">Residential</option>
                            </select>
                          </div>
                        </div>
                      </div> */}

                      <Card.Title className='mb-4' > Tenant  Details </Card.Title>

                      {formData.contractInfo.usage === 'Commercial' && (
                        <>
                          <div className="row">

                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">License Number</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="licenseno" placeholder="License Number" value={tenantDetails?.licenseno} onChange={handleInputChange} required />
                              </div>
                            </div>
                            <div className="col-md-3 ">
                              <div className="form-group">
                                <label htmlFor="unit">Company Name</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="companyname" placeholder="Company Name" value={tenantDetails?.companyname && tenantDetails?.companyname} onChange={handleInputChange} required />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">Contact</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contact" placeholder="Contact" value={tenantDetails?.contact} onChange={handleInputChange} required />
                              </div>
                            </div>

                            <div className="col-md-3 ">
                              <div className="form-group">
                                <label htmlFor="unit">Email</label>
                                <input style={{ borderRadius: '10px' }} type="email" className="form-control" name="email" placeholder="Email" value={tenantDetails?.email && tenantDetails?.email} onChange={handleInputChange} required />
                              </div>
                            </div>

                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">Nationality</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="nationality" placeholder="nationality" value={tenantDetails?.ownerId?.nationality && tenantDetails?.ownerId?.nationality} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                  required />
                              </div>
                            </div>


                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">Address</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="address" placeholder="Address" value={tenantDetails?.address && tenantDetails?.address} />
                              </div>
                            </div>



                          </div>
                        </>
                      )}

                      <div className="row">
                        {formData.contractInfo.usage === 'Commercial' ? null :
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="nid">Emirates ID No.</label>
                              <input
                                style={{ borderRadius: '10px' }}
                                type="text"
                                className="form-control"
                                name="nid"
                                placeholder="Emirates ID No."
                                value={tenantDetails?.nid && tenantDetails?.nid}
                                onChange={handleInputChange}
                                // onBlur={handleNIDChange}
                                required
                              />
                            </div>
                          </div>
                        }
                        {formData.contractInfo.usage === 'Commercial' ? null :
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="unit">Tenant Name</label>
                              <input
                                style={{ borderRadius: '10px' }}
                                type="text"
                                className="form-control"
                                name="name"
                                placeholder="Tenant Name"
                                value={tenantDetails?.name}
                                onChange={handleInputChange}
                                required
                                readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                              />
                            </div>
                          </div>
                        }

                        {
                          formData.contractInfo.usage === 'Commercial' ? null :
                            <div className="col-md-3 ">
                              <div className="form-group">
                                <label htmlFor="unit">Email</label>
                                <input style={{ borderRadius: '10px' }} type="email" className="form-control" name="email" placeholder="Email" value={tenantDetails?.email && tenantDetails?.email} onChange={handleInputChange} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                  required />
                              </div>
                            </div>
                        }

                        {formData.contractInfo.usage === 'Commercial' ? null :
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="unit">Contact</label>
                              <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contact" placeholder="Contact" value={tenantDetails?.contact} onChange={handleInputChange} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                required />
                            </div>
                          </div>
                        }

                        {
                          formData.contractInfo.usage === 'Commercial' ? null :
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">Nationality</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="nationality" placeholder="nationality" value={tenantDetails?.ownerId?.nationality && tenantDetails?.ownerId?.nationality} onChange={handleInputChange} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                  required />
                              </div>
                            </div>
                        }

                        {
                          formData.contractInfo.usage === 'Commercial' ? null :
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="unit">Address</label>
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="address" placeholder="Address" value={tenantDetails?.address && tenantDetails?.address} onChange={handleInputChange} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                  required />
                              </div>
                            </div>
                        }


                        {formData.contractInfo.usage === 'Commercial' ? null :
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="unit">Passport No</label>
                              <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="passport" placeholder="Passport" value={tenantDetails?.passport} onChange={handleInputChange} readOnly={isDataFetched} // Add readOnly attribute based on isDataFetched
                                required />
                            </div>
                          </div>
                        }


                      </div>
                    </Card.Body>
                  </Card>

                  <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                    <Card.Body>

                      <Card.Title className='mb-4' > Property Details </Card.Title>

                      <div className="row">

                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="unit">Apartment Name</label>
                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="licenseno" placeholder="Apartment Name" value={tenantDetails?.property?.name} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="col-md-4 ">
                          <div className="form-group">
                            <label htmlFor="unit">Floor Name</label>
                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="companyname" placeholder="Floor Name" value={tenantDetails?.floorId?.name && tenantDetails?.floorId?.name} onChange={handleInputChange} required />
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="form-group">
                            <label htmlFor="unit">Unit No</label>
                            <input style={{ borderRadius: '10px' }} type="text" className="form-control" name="contact" placeholder="Unit Name" value={tenantDetails?.unitId.map(unit => unit?.unitNo)} onChange={handleInputChange} required />
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >

                    <Card.Body>
                      <Card.Title className='mb-4' >  Contract Details</Card.Title>
                      <div className='row' >

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="startingDate">Starting Date</label>
                            <div>
                              <input
                                type="date"
                                id="startingDate"
                                name="contractInfo.startingDate"
                                className="form-control"
                                value={formData.contractInfo.startingDate}
                                onChange={handleInputChange}
                                style={{ borderRadius: '10px' }}
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="monthsDuration">Months Duration</label>
                            <div>
                              <input
                                type="text"
                                id="monthsDuration"
                                name="contractInfo.monthsDuration"
                                value={formData.contractInfo.monthsDuration}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Months Duration'
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <div>
                              <input
                                type="date"
                                id="endDate"
                                name="contractInfo.endDate"
                                value={formData.contractInfo.endDate}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                required
                                disabled
                              />
                            </div>
                          </div>
                        </div>
                        {/* 
                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="securitydeposite">Security Deposit</label>
                            <div>
                              <input
                                type="text"
                                id="securitydeposite"
                                name="contractInfo.securitydeposite"
                                value={formData.contractInfo.securitydeposite}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Security Deposite'
                                required
                              />
                            </div>
                          </div>
                        </div> */}
                        {/* 
                        <div className="col-md-3" >
                          <div className="form-group">
                            <label htmlFor="Waterandelecbill">Water and Electricity Bill</label>
                            <div>
                              <input
                                type="text"
                                id="Waterandelecbill"
                                name="contractInfo.Waterandelecbill"
                                value={formData.contractInfo.Waterandelecbill}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Water and Electricity Bill'
                                required
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="usage">Usage</label>
                            <div>
                              <input
                                type="text"
                                id="usage"
                                name="contractInfo.usage"
                                value={formData.contractInfo.usage}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Usage'
                                required
                              />
                            </div>
                          </div>
                        </div> */}

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="unit">Contract Amount</label>
                            <input style={{ borderRadius: '10px' }}
                              type="number"
                              className="form-control"
                              name="contractInfo.totalContractAmount"
                              placeholder="Total Contract Amount"
                              value={formData.contractInfo.totalContractAmount}
                              onChange={handleInputChange} required />
                          </div>
                        </div>

                        {/* <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="totalContractAmount">Total Contract Amount</label>
                            <div>
                              <input
                                type="text"
                                id="totalContractAmount"
                                name="contractInfo.totalContractAmount"
                                value={formData.contractInfo.totalContractAmount}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Total Contract Amount'
                                required
                              />
                            </div>
                          </div>
                        </div> */}

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="VAT">VAT</label>
                            <div>
                              <input
                                type="text"
                                id="VAT"
                                name="contractInfo.VAT"
                                value={formData.contractInfo.VAT}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='VAT'
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="otherCost">Other Cost</label>
                            <div>
                              <input
                                type="text"
                                id="otherCost"
                                name="contractInfo.otherCost"
                                value={formData.contractInfo.otherCost}
                                onChange={handleInputChange}
                                className="form-control"
                                style={{ borderRadius: '10px' }}
                                placeholder='Other Cost'
                                required
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="unit">Parking Value</label>
                            <input style={{ borderRadius: '10px' }}
                              type="text"
                              className="form-control"
                              name="contractInfo.parkingValue"
                              placeholder="Parking Value"
                              value={formData.contractInfo.parkingValue} onChange={handleInputChange} />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <div className="form-group">
                            <label htmlFor="unit">Discount</label>
                            <input style={{ borderRadius: '10px' }}
                              type="number" className="form-control"
                              name="contractInfo.discount"
                              placeholder="Discount"
                              value={formData.contractInfo.discount}
                              onChange={handleInputChange} />
                          </div>
                        </div>

                        <div className="col-md-3">
                          <label htmlFor="finalAmount">Final Amount</label>
                          <input
                            type="number"
                            id="finalAmount"
                            name="contractInfo.finalAmount"
                            value={formData.contractInfo.finalAmount}
                            onChange={handleInputChange}
                            style={{ borderRadius: '10px' }}
                            className="form-control"
                            required
                          />
                        </div>

                        {/* <div className="col-md-3">
                          <label htmlFor="totalChecks">Total Checks:</label>
                          <select
                            id="totalChecks"
                            name="contractInfo.totalChecks"
                            value={formData.contractInfo.totalChecks}
                            onChange={handleTotalChecksChange}
                            required
                            style={{ borderRadius: '10px' }}
                            className="form-control py-3"
                          >
                            <option value="">Total Checks</option>
                            {Array.from({ length: formData.contractInfo.monthsDuration }, (_, index) => index + 1).map((count) => (
                              <option key={count} value={count}>{count}</option>
                            ))}
                          </select>
                        </div> */}



                      </div>
                    </Card.Body>
                  </Card>

                  <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4'>
                    <Card.Body>
                      <Card.Title>Security Deposit</Card.Title>
                      <div className='row'>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Security Deposit</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <label className="radio-inline">
                                <input
                                  style={{ borderRadius: '10px' }}
                                  type="radio"
                                  name="securitydeposite"
                                  value="bank"
                                  checked={formData.contractInfo.securitydeposite === 'bank'}
                                  onChange={handleSecurityDepositChange}
                                />
                                <span style={{ marginLeft: '3px' }} >Bank</span>
                              </label>
                              <label className="radio-inline">
                                <input
                                  style={{ borderRadius: '10px' }}
                                  type="radio"
                                  name="securitydeposite"
                                  value="cash"
                                  checked={formData.contractInfo.securitydeposite === 'cash'}
                                  onChange={handleSecurityDepositChange}
                                />
                                <span style={{ marginLeft: '3px' }} >Cash</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        {formData.contractInfo.securitydeposite === 'bank' ? (
                          <div className='row'>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="depositechk">Check Number</label>
                                <input
                                  style={{ borderRadius: '10px' }}
                                  type="text"
                                  className="form-control"
                                  name="contractInfo.depositechk"
                                  placeholder="Check Number"
                                  value={formData.contractInfo.depositechk}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="depositeDate">Check Date</label>
                                <input
                                  style={{ borderRadius: '10px' }}
                                  type="date"
                                  className="form-control"
                                  name="contractInfo.depositeDate"
                                  placeholder="Check Date"
                                  value={formData.contractInfo.depositeDate}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <label htmlFor="depositeamount">Amount</label>
                                <input
                                  style={{ borderRadius: '10px' }}
                                  type="number"
                                  className="form-control"
                                  name="contractInfo.depositeamount"
                                  placeholder="Amount"
                                  value={formData.contractInfo.depositeamount}
                                  onChange={handleInputChange}
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="col-md-3">
                            <div className="form-group">
                              <label htmlFor="depositecash">Deposit Cash</label>
                              <input
                                style={{ borderRadius: '10px' }}
                                type="number"
                                className="form-control"
                                name="depositecash"
                                placeholder="cash"
                                value={formData.contractInfo.depositecash}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Card.Body>
                  </Card>

      
                  <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4'>
                    <Card.Body>
                      <Card.Title>Total Checks</Card.Title>
                      <div className="col-md-3">
                        <label htmlFor="totalChecks">Total Checks:</label>
                        <select
                          id="totalChecks"
                          className="form-control py-3"
                          style={{ borderRadius: '10px' }}
                          name="contractInfo.totalChecks"
                          value={formData.contractInfo.totalChecks}
                          onChange={handleTotalChecksChange}
                          required
                        >
                          <option value="">Total Checks</option>
                          {Array.from({ length: formData.contractInfo.monthsDuration }, (_, index) => index + 1).map((count) => (
                            <option key={count} value={count}>{count}</option>
                          ))}
                        </select>
                      </div>
                      {formData.contractInfo.pdc.map((check, index) => (
                        <div key={index} className='row' >
                          <div className="col-md-3  ">
                            <label htmlFor={`bank_${index}`}>Bank:</label>
                            <input
                              type="text"
                              id={`bank_${index}`}
                              name={`contractInfo.pdc[${index}].bank`}
                              style={{ borderRadius: '10px' }}
                              className="form-control"
                              value={formData.contractInfo.pdc[index].bank}
                              onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-3 ">
                            <label htmlFor={`checkNumber_${index}`}>Check Number:</label>
                            <input
                              type="text"
                              id={`checkNumber_${index}`}
                              name={`contractInfo.pdc[${index}].checkNumber`}
                              style={{ borderRadius: '10px' }}
                              className="form-control"
                              value={formData.contractInfo.pdc[index].checkNumber}
                              onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-3 ">
                            <label htmlFor={`amount_${index}`}>Amount:</label>
                            <input
                              type="text"
                              id={`amount_${index}`}
                              name={`contractInfo.pdc[${index}].amount`}
                              style={{ borderRadius: '10px' }}
                              className="form-control"
                              value={formData.contractInfo.pdc[index].amount}
                              onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)}
                              required
                            />
                          </div>
                          <div className="col-md-3 ">
                            <label htmlFor={`date_${index}`}>Date:</label>
                            <input
                              type="date"
                              id={`date_${index}`}
                              name={`contractInfo.pdc[${index}].date`}
                              style={{ borderRadius: '10px' }}
                              className="form-control"
                              value={formData.contractInfo.pdc[index].date}
                              onChange={(e) => handleCheckDetailChange(index, 'date', e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>

                  {/* <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                    <Card.Body>
                      <Card.Title className=''>Payment Details</Card.Title>

                      <div className="row">

                        <div className="col-md-3">
                          <label htmlFor="unit" className='mb-2'>Total Checks</label>
                          <select style={{ borderRadius: '10px' }} className="form-control py-3" name="contractInfo.totalChecks" value={formData.contractInfo.totalChecks} onChange={handleTotalChecksChange} >
                            <option value=""> Total Checks</option>
                            {Array.from({ length: formData.contractInfo.monthsDuration }, (_, index) => index + 1).map((count) => (
                              <option key={count} value={count}>{count}</option>
                            ))}
                          </select>

                        </div>
                      </div>

                      {checkDetails.map((check, index) => (
                        <div key={index}>
                          <div className="row">
                            <div className="col-md-3 ">
                              <div className="form-group">
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" placeholder="Bank" value={check.bank} onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)} required />
                              </div>
                            </div>
                            <div className="col-md-3 ">
                              <div className="form-group">
                                <input style={{ borderRadius: '10px' }} type="text" className="form-control" placeholder="Check Number" value={check.checkNumber} onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)} required />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <div className="form-group">
                                <input style={{ borderRadius: '10px' }} type="number" className="form-control" placeholder="Amount" value={check.amount} onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)} />
                              </div>
                            </div>
                            <div className="col-md-3 ">
                              <div className="form-group">
                                <input style={{ borderRadius: '10px' }} type="date" className="form-control" placeholder="Date" value={check.date} onChange={(e) => handleCheckDetailChange(index, 'date', e.target.value)} />
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                      <h3 className='mt-4' >Total Check Amount: {calculateTotalCheckAmount()}</h3>
                    </Card.Body>
                  </Card> */}



                  {/* <div>
                    <label htmlFor="totalChecks">Total Checks:</label>
                    <select
                      id="totalChecks"
                      name="contractInfo.totalChecks"
                      value={formData.contractInfo.totalChecks}
                      onChange={handleTotalChecksChange}
                      required
                    >
                      <option value="">Total Checks</option>
                      {Array.from({ length: formData.contractInfo.monthsDuration }, (_, index) => index + 1).map((count) => (
                        <option key={count} value={count}>{count}</option>
                      ))}
                    </select>
                  </div> */}
                  {/* Dynamically generated fields for check details */}
                  {/* {formData.contractInfo.pdc.map((check, index) => (
                    <div key={index}>
                      <div>
                        <label htmlFor={`bank_${index}`}>Bank:</label>
                        <input
                          type="text"
                          id={`bank_${index}`}
                          name={`contractInfo.pdc[${index}].bank`}
                          value={formData.contractInfo.pdc[index].bank}
                          onChange={(e) => handleCheckDetailChange(index, 'bank', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`checkNumber_${index}`}>Check Number:</label>
                        <input
                          type="text"
                          id={`checkNumber_${index}`}
                          name={`contractInfo.pdc[${index}].checkNumber`}
                          value={formData.contractInfo.pdc[index].checkNumber}
                          onChange={(e) => handleCheckDetailChange(index, 'checkNumber', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`amount_${index}`}>Amount:</label>
                        <input
                          type="text"
                          id={`amount_${index}`}
                          name={`contractInfo.pdc[${index}].amount`}
                          value={formData.contractInfo.pdc[index].amount}
                          onChange={(e) => handleCheckDetailChange(index, 'amount', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor={`date_${index}`}>Date:</label>
                        <input
                          type="date"
                          id={`date_${index}`}
                          name={`contractInfo.pdc[${index}].date`}
                          value={formData.contractInfo.pdc[index].date}
                          onChange={(e) => handleCheckDetailChange(index, 'date', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  ))} */}
                  <Button className='mt-3 mb-5' type="submit">Renew Contract</Button>
                </form>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

    </>);
};

export default RenewalContract;