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
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await axios.get('/api/properties/allproperties', {
          headers: {
            Authorization: `Bearer ${state.user.token}`,
          },
        });
        setPropertyData(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    }

    fetchProperties();
  }, [state]);

  // Tenants Data
  useEffect(() => {
    fetch('/api/tenants/alltenants', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${state.user.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setTenantData(data))
      .catch(error => console.error('Error fetching tenant data:', error));
  }, [state.user.token]); //

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

  // Slice to show only three records for today's date
  const todayPaymentsSlice = todayPayments.slice(0, 3);

  console.log(todayPaymentsSlice, 'todayPaymentsSlice');

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
                    {/* You can calculate the decrease percentage here */}
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
                  {/* Today's Payments Table */}
                  <h3 className=''>Today's PDC</h3>
                  {
                    todayPaymentsSlice.length >= 1 ?
                      <>
                        <Table striped bordered hover responsive >
                          <thead style={{ backgroundColor: '#005f75' }} >
                            <tr>
                              <th style={{ color: 'white' }} >Name</th>
                              <th style={{ color: 'white' }} >Property Name</th>
                              <th style={{ color: 'white' }} >Floor Name</th>
                              <th style={{ color: 'white' }} >Unit Name</th>
                              <th style={{ color: 'white' }} >PDC Information</th>
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
                                <td>{check.checkNumber && check.checkNumber} AED</td>
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
                        <Button onClick={()=>navigate('/pdc')} >More Information</Button>
                      </div>
                  }
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



// Function to calculate total floors
const calculateTotalFloors = (propertyData) => {
  let totalFloors = 0;
  propertyData.forEach((property) => {
    totalFloors += property.floors.length;
  });
  return totalFloors;
};

// Function to calculate total units
const calculateTotalUnits = (propertyData) => {
  let totalUnits = 0;
  propertyData.forEach((property) => {
    property.floors.forEach((floor) => {
      totalUnits += floor.units.length;
    });
  });
  return totalUnits;
};

// Function to calculate occupied units
const calculateOccupiedUnits = (propertyData) => {
  let occupiedUnits = 0;
  propertyData.forEach((property) => {
    property.floors.forEach((floor) => {
      occupiedUnits += floor.units.filter(unit => unit.occupied).length;
    });
  });
  return occupiedUnits;
};

// Function to calculate vacant units
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