import React, { useState, useEffect, useContext } from 'react';
import { PieChart, Pie, Tooltip, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Legend, LineChart, Line } from 'recharts';
import { AuthContext } from './AuthContext';
import axios from 'axios';
import Select from 'react-select';
import { Col, Row } from 'react-bootstrap';
import SideBar from '../Components/SideBar';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
const FinancialReport = () => {
    const [propertyData, setPropertyData] = useState([]);
    const [tenantsData, setTenantsData] = useState([]);
    const [propertyIncomeData, setPropertyIncomeData] = useState([]);
    const [ownerIncomeData, setOwnerIncomeData] = useState([]);
    const [occupancyData, setOccupancyData] = useState([]);
    const [yAxisDomain, setYAxisDomain] = useState([0, 500]);
    const [selectedOwner, setSelectedOwner] = useState(null); // Track selected owner
    const [ownerFinancialData, setOwnerFinancialData] = useState(null); // Store financial data for selected owner
    const { state } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch property data
                const propertyResponse = await axios.get('/api/properties/allproperties', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                const propertyData = propertyResponse.data;
                setPropertyData(propertyData);

                // Fetch tenant data
                const tenantResponse = await axios.get('/api/tenants/alltenants', {
                    headers: {
                        Authorization: `Bearer ${state.user.token}`,
                    },
                });
                const tenantsData = tenantResponse.data;
                setTenantsData(tenantsData);

                // Calculate income per property
                const incomeData = {};
                tenantsData.forEach(tenant => {
                    const propertyId = tenant.property._id;
                    const income = tenant.contractInfo.finalAmount;
                    const propertyName = tenant.property.name; // Get property name
                    if (incomeData[propertyId]) {
                        incomeData[propertyId].income += income;
                    } else {
                        incomeData[propertyId] = {
                            propertyName,
                            income
                        };
                    }
                });

                // Format data for recharts
                const formattedData = Object.keys(incomeData).map(propertyId => ({
                    propertyName: incomeData[propertyId].propertyName,
                    income: incomeData[propertyId].income
                }));

                // Calculate Y-axis domain
                const minIncome = Math.min(...Object.values(incomeData).map(item => item.income));
                const maxIncome = Math.max(...Object.values(incomeData).map(item => item.income));
                const minY = Math.floor(minIncome / 500) * 500;
                const maxY = Math.ceil(maxIncome / 500) * 500;
                setYAxisDomain([minY, maxY]);

                setPropertyIncomeData(formattedData);

                // Calculate income per owner
                const ownerIncome = {};
                tenantsData.forEach(tenant => {
                    const ownerId = tenant.ownerId._id;
                    const income = tenant.contractInfo.finalAmount;
                    if (ownerIncome[ownerId]) {
                        ownerIncome[ownerId].income += income;
                    } else {
                        ownerIncome[ownerId] = {
                            ownerName: tenant.ownerId.name, // Get owner name
                            income,
                            cash: 0,
                            bank: 0,
                            pdc: 0
                        };
                    }
                    // Calculate total amounts for PDC, cash, and bank
                    tenant.contractInfo.pdc.forEach(check => {
                        ownerIncome[ownerId].pdc += check.amount;
                    });
                    tenant.contractInfo.payment.forEach(payment => {
                        if (payment.paymentmethod === 'cash') {
                            ownerIncome[ownerId].cash += payment.amount;
                        } else if (payment.paymentmethod === 'bank') {
                            ownerIncome[ownerId].bank += payment.amount;
                        }
                    });
                });

                const formattedOwnerIncomeData = Object.keys(ownerIncome).map(ownerId => ({
                    ownerName: ownerIncome[ownerId].ownerName,
                    income: ownerIncome[ownerId].income,
                    cash: ownerIncome[ownerId].cash,
                    bank: ownerIncome[ownerId].bank,
                    pdc: ownerIncome[ownerId].pdc
                }));

                setOwnerIncomeData(formattedOwnerIncomeData);

                // Calculate occupancy status
                const totalProperties = propertyData.length;
                const totalOccupiedUnits = tenantsData.filter(tenant => tenant.unitId.length > 0).length;
                const totalVacantUnits = tenantsData.filter(tenant => tenant.unitId.length === 0).length;
                const occupancyChartData = [
                    { name: 'Occupied', value: totalOccupiedUnits },
                    { name: 'Vacant', value: totalVacantUnits }
                ];
                setOccupancyData(occupancyChartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [state.user.token, propertyData.length, tenantsData.length]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const handleOwnerSelect = (selectedOption) => {
        setSelectedOwner(selectedOption);
        // Fetch financial data for selected owner
        if (selectedOption) {
            const selectedOwnerData = ownerIncomeData.find(owner => owner.ownerName === selectedOption.label);
            setOwnerFinancialData(selectedOwnerData);
        } else {
            setOwnerFinancialData(null);
        }
    };

    const handleClearOwner = () => {
        setSelectedOwner(null);
        setOwnerFinancialData(null);
    };

    const customStyles = {
        control: base => ({
            ...base,
            borderRadius: '0.5rem',
            boxShadow: 'none',
        }),
    };

    return (
        <>
            <Row>

                <Col xs={6} sm={6} md={3} lg={2} xl={2}>
                    <div>
                        <SideBar />
                    </div>
                </Col>

                <Col xs={12} sm={12} md={12} lg={10} xl={10} style={{ marginTop: '65px' }} >
                    <Row xs={1} md={2} lg={3}>
                        <Col xs={12} sm={12} md={12} lg={10} xl={10} >
                            <div> <h2 className='mt-4 text-center' >Financial Report</h2> </div>
                            {/* Bar chart for income per owner */}
                            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} >
                                <Card.Body>
                                    <h3>Income Per Owner</h3>

                                    <div style={{ width: '500px' }} className='mb-3' >
                                        <Select
                                            onChange={handleOwnerSelect}
                                            value={selectedOwner}
                                            options={ownerIncomeData.map(owner => ({ value: owner.ownerName, label: owner.ownerName }))}
                                            placeholder="Select Owner"
                                            styles={customStyles}
                                            isClearable
                                            isSearchable
                                        />
                                    </div>
                                    {/* Close icon to clear selected owner */}
                                    {/* {selectedOwner && (
                                        <button onClick={handleClearOwner} className="clear-button">
                                            <i className="fas fa-times-circle">Close</i>
                                        </button>
                                    )} */}
                                    {/* Display financial data for selected owner in a table */}
                                    {selectedOwner && ownerFinancialData && (
                                        <Table striped bordered hover responsive className='mb-3 mt-2'  >
                                            <thead style={{ backgroundColor: '#005f75' }} >
                                                <tr style={{ color: '#ffff' }}>
                                                    <th>Owner Name</th>
                                                    <th>Total Income</th>
                                                    <th>Cash</th>
                                                    <th>Bank</th>
                                                    <th>PDC</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{ownerFinancialData.ownerName}</td>
                                                    <td>{ownerFinancialData.income} AED</td>
                                                    <td>{ownerFinancialData.cash} AED</td>
                                                    <td>{ownerFinancialData.bank} AED</td>
                                                    <td>{ownerFinancialData.pdc} AED</td>
                                                </tr>
                                            </tbody>
                                        </Table>
                                    )}
                                    <BarChart width={1200} height={400} data={ownerIncomeData}>
                                        <Bar dataKey="income" fill="#8884d8" />
                                        <Bar dataKey="cash" fill="#82ca9d" />
                                        <Bar dataKey="bank" fill="#FFBB28" />
                                        <Bar dataKey="pdc" fill="#FF8042" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="ownerName" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                    </BarChart>
                                </Card.Body>
                            </Card>


                            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4' >
                                <Card.Body>
                                    <h3>Income Per Tenant</h3>
                                    <LineChart width={1200} height={400} data={tenantsData}>
                                        <Line type="monotone" dataKey="contractInfo.finalAmount" stroke="#8884d8" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                    </LineChart>
                                </Card.Body>
                            </Card>

                            <Card style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }} className='mt-4 mb-5' >
                                <Card.Body>
                                    <h3 className='m-3'>Income Per Property</h3>
                                    <BarChart width={1200} height={400} data={propertyIncomeData}>
                                        <Bar dataKey="income" fill="#82ca9d" />
                                        <CartesianGrid stroke="#ccc" />
                                        <XAxis dataKey="propertyName" />
                                        <YAxis domain={yAxisDomain} />
                                        <Tooltip />
                                        <Legend />
                                    </BarChart>
                                </Card.Body>
                            </Card>

                        </Col>
                    </Row>
                </Col>
            </Row>

        </>
    );
}

export default FinancialReport;