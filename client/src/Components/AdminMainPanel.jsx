import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Pages/AuthContext';

const AdminMainPanel = () => {
  const [propertyData, setPropertyData] = useState(null);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await axios.get('/api/properties/allpropertiesforadmin', {
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

  return (
    <>
      {propertyData && (
        <div className="main-panel mt-5">
          <div className="content-wrapper mt-5" style={{backgroundColor:'transparent'}} >
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
                <div className="card bg-gradient-danger card-img-holder text-white">
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

export default AdminMainPanel;
