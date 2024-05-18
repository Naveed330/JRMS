import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';
import { Button, Table } from 'react-bootstrap';
import TenantsSection from './TenantsSection';
import { useNavigate } from 'react-router-dom';

const MainPanel = () => {
  const [propertyData, setPropertyData] = useState(null);
  const [tenantData, setTenantData] = useState([]);
  const { state } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const propertyResponse = await axios.get('/api/properties/allproperties', {
          headers: {
            Authorization: `Bearer ${state.user.token}`,
          },
        }
      );
        setPropertyData(propertyResponse.data);

        const tenantResponse = await fetch('/api/tenants/alltenants', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${state.user.token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!tenantResponse.ok) {
          throw new Error('Network response was not ok');
        }
        const tenantData = await tenantResponse.json();
        setTenantData(tenantData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [state]);

  const today = new Date();
  const todayPayments = [];

  tenantData.forEach(tenant => {
    tenant.contractInfo.pdc.forEach(check => {
      const paymentDate = new Date(check.date);
      if (paymentDate.toDateString() === today.toDateString()) {
        todayPayments.push({ tenant, check });
      }
    });
  });

  const todayPaymentsSlice = todayPayments.slice(0, 3);

  const upcomingPDC = [];
  const nextSevenDays = new Date(today);
  nextSevenDays.setDate(nextSevenDays.getDate() + 7);

  tenantData.forEach(tenant => {
    tenant.contractInfo.pdc.forEach(check => {
      const paymentDate = new Date(check.date);
      if (paymentDate > today && paymentDate <= nextSevenDays) {
        upcomingPDC.push({ tenant, check });
      }
    });
  });

  const returnedPDC = [];

  tenantData.forEach(tenant => {
    tenant.contractInfo.pdc.forEach(check => {
      if (check.pdcstatus === 'return') {
        returnedPDC.push({ tenant, check });
      }
    });
  });
  return (
    <>
      {propertyData && (
        <div className="main-panel">
          <div className="content-wrapper mt-5" style={{ backgroundColor: 'transparent' }} >
            <div className="page-header">
              <h3 className="page-title">
                <span className="page-title-icon bg-gradient-primary text-white me-2">
                  <i className="mdi mdi-home" />
                </span>{' '}
                Dashboard
              </h3>
              <nav aria-label="breadcrumb">
                <ul className="breadcrumb">
                  <li className="breadcrumb-item active" aria-current="page">
                    <span />
                    Overview{' '}
                    <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle" />
                  </li>
                </ul>
              </nav>
            </div>
            <div className="row">
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-danger card-img-holder text-white"  >
                  <div className="card-body">
                    <img
                      src="assets/images/dashboard/circle.svg"
                      className="card-img-absolute"
                      alt="circle-image"
                    />
                    <h4 className="font-weight-normal mb-3">
                      Total Properties{' '}
                      <i className="mdi mdi-chart-line mdi-24px float-right" />
                    </h4>
                    <h2 className="mb-5">{propertyData.length}</h2>
                    <h6 className="card-text">Total Enabled {propertyData.filter(property => property.status === 'enable').length}</h6>
                    <h6 className="card-text">Total Disabled {propertyData.filter(property => property.status === 'disable').length}</h6>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-info card-img-holder text-white">
                  <div className="card-body">
                    <img
                      src="assets/images/dashboard/circle.svg"
                      className="card-img-absolute"
                      alt="circle-image"
                    />
                    <h4 className="font-weight-normal mb-3">
                      Total Floors{' '}
                      <i className="mdi mdi-bookmark-outline mdi-24px float-right" />
                    </h4>
                    <h2 className="mb-5">{calculateTotalFloors(propertyData)}</h2>
                  </div>
                </div>
              </div>
              <div className="col-md-4 stretch-card grid-margin">
                <div className="card bg-gradient-success card-img-holder text-white">
                  <div className="card-body">
                    <img
                      src="assets/images/dashboard/circle.svg"
                      className="card-img-absolute"
                      alt="circle-image"
                    />
                    <h4 className="font-weight-normal mb-3">
                      Total Units{' '}
                      <i className="mdi mdi-diamond mdi-24px float-right" />
                    </h4>
                    <h2 className="mb-3">{calculateTotalUnits(propertyData)}</h2>
                    <div className="mb-3">Occupied: {calculateOccupiedUnits(propertyData)}</div>
                    <div>Vacant: {calculateVacantUnits(propertyData)}</div>
                  </div>
                </div>
              </div>

              <div className="col-md-12 grid-margin" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                <div className="card-body">
                  <h3 style={{color: '#4b2f00'}} >Today's PDC</h3>
                  {
                    todayPaymentsSlice.length >= 1 ?
                      <>
                        <Table striped bordered hover responsive >
                          <thead style={{  backgroundColor: '#005f75' }} >
                            <tr>
                              <th style={{ color: 'white' }} >Name</th>
                              <th style={{ color: 'white' }} >Property Name</th>
                              <th style={{ color: 'white' }} >Floor Name</th>
                              <th style={{ color: 'white' }} >Unit Name</th>
                              <th style={{ color: 'white' }} >Check Number</th>
                              <th style={{ color: 'white' }} >Bank</th>
                              <th style={{ color: 'white' }} >Date</th>
                              <th style={{ color: 'white' }} >Amount</th>
                              <th style={{ color: 'white' }} >Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {todayPaymentsSlice.map(({ tenant, check }, index) => (
                              <tr key={`today-${index}`}>
                                <td>{tenant.name || tenant.companyname}</td>
                                <td>{tenant.property && tenant.property.name}</td>
                                <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                                <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                                <td>{check.checkNumber && check.checkNumber}</td>
                                <td>{check.bank}</td>
                                <td>{new Date(check.date).toDateString()}</td>
                                <td>{check.amount} AED</td>
                                <td>
                                  
                                  <Button onClick={() => navigate('/pdc')} >More Information</Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </Table>
                      </>
                      :
                      <div className='mt-2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }} >
                        <h4 style={{ color: 'red' }} >Today's PDC is Not Available</h4>
                        <Button  onClick={()=>navigate('/pdc')} >More Information</Button>
                      </div>
                  }
                </div>
              </div>
            <div className="col-md-12 grid-margin" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <div className="card-body">
                <h3 style={{ color: '#4b2f00' }}>Weekly PDC</h3>
                {upcomingPDC.length >= 1 ? (
                  <Table striped bordered hover responsive>
                    <thead style={{  backgroundColor: '#005f75' }}>
                      <tr>
                        <th style={{ color: 'white' }}>Tenant Name</th>
                        <th style={{ color: 'white' }}>Property Name</th>
                        <th style={{ color: 'white' }}>Floor Name</th>
                        <th style={{ color: 'white' }}>Unit Name</th>
                        <th style={{ color: 'white' }}>Check NO</th>
                        <th style={{ color: 'white' }}>Bank</th>
                        <th style={{ color: 'white' }}>Date</th>
                        <th style={{ color: 'white' }}>Amount</th>
                        <th style={{ color: 'white' }}>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {upcomingPDC.map(({ tenant, check }, index) => (
                        <tr key={`upcoming-${index}`}>
                          <td>{tenant.name || tenant.companyname}</td>
                          <td>{tenant.property && tenant.property.name}</td>
                          <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                          <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                          <td>{check.checkNumber && check.checkNumber}</td>
                          <td>{check.bank}</td>
                          <td>{new Date(check.date).toDateString()}</td>
                          <td>{check.amount} AED</td>
                          <td>
                            <Button onClick={() => navigate('/pdc')}>More Information</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className='mt-2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h4 style={{ color: 'red' }}>No upcoming PDC for the next 7 days</h4>
                  </div>
                )}
              </div>
            </div>
              <div className="col-md-12 grid-margin" style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
                <div className="card-body">
                  <h3 style={{ color: '#4b2f00' }}>Returned PDC</h3>
                  {returnedPDC.length >= 1 ? (
                    <Table striped bordered hover responsive>
                      <thead style={{  backgroundColor: '#005f75' }}>
                        <tr>
                          <th style={{ color: 'white' }}>Tenant Name</th>
                          <th style={{ color: 'white' }}>Property Name</th>
                          <th style={{ color: 'white' }}>Floor Name</th>
                          <th style={{ color: 'white' }}>Unit Name</th>
                          <th style={{ color: 'white' }}>Check NO</th>
                          <th style={{ color: 'white' }}>Bank</th>
                          <th style={{ color: 'white' }}>Date</th>
                          <th style={{ color: 'white' }}>Amount</th>
                          <th style={{ color: 'white' }}>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {returnedPDC.map(({ tenant, check }, index) => (
                          <tr key={`returned-${index}`}>
                            <td>{tenant.name || tenant.companyname}</td>
                            <td>{tenant.property && tenant.property.name}</td>
                            <td>{tenant.floorId ? tenant.floorId.name : 'N/A'}</td>
                            <td>{tenant.unitId.length > 0 ? tenant.unitId[0].unitNo : 'N/A'}</td>
                            <td>{check.checkNumber && check.checkNumber}</td>
                            <td>{check.bank}</td>
                            <td>{new Date(check.date).toDateString()}</td>
                            <td>{check.amount} AED</td>
                            <td>
                              <Button onClick={() => navigate('/pdc')}>More Information</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className='mt-2' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <h4 style={{ color: 'red' }}>No returned PDC</h4>
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-12 grid-margin" >
                <TenantsSection />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



const calculateTotalFloors = (propertyData) => {
  let totalFloors = 0;
  propertyData.forEach((property) => {
    totalFloors += property.floors.length;
  });
  return totalFloors;
};

const calculateTotalUnits = (propertyData) => {
  let totalUnits = 0;
  propertyData.forEach((property) => {
    property.floors.forEach((floor) => {
      totalUnits += floor.units.length;
    });
  });
  return totalUnits;
};

const calculateOccupiedUnits = (propertyData) => {
  let occupiedUnits = 0;
  propertyData.forEach((property) => {
    property.floors.forEach((floor) => {
      occupiedUnits += floor.units.filter(unit => unit.occupied).length;
    });
  });
  return occupiedUnits;
};

const calculateVacantUnits = (propertyData) => {
  let vacantUnits = 0;
  propertyData.forEach((property) => {
    property.floors.forEach((floor) => {
      vacantUnits += floor.units.filter(unit => !unit.occupied).length;
    });
  });
  return vacantUnits;
};

export default MainPanel;