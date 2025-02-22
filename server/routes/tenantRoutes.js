// Import necessary modules
import express from 'express';
import Tenant from '../models/tenantModel.js';
import Unit from '../models/unitModel.js'; // Assuming there's a Unit model
import User from '../models/userModel.js';
import { isAuth, isSuperAdmin } from '../utils.js'; // Assuming only isAuth and isSuperAdmin are needed

// Create a router
const tenantRouter = express.Router();

// Route to add a new tenant
tenantRouter.post('/addtenant', isAuth, isSuperAdmin, async (req, res) => {
    try {
        // Destructure and validate request body
        const {
            name,
            email,
            contact,
            nid,
            passport,
            address,
            ownerId,
            property,
            floorId,
            unitId,
            propertyType,
            contractInfo,
            status,
        } = req.body;

        // Check if any required fields are missing
        const requiredFields = ['name', 'email', 'contact', 'ownerId', 'property', 'floorId', 'unitId', 'propertyType', 'contractInfo'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ error: `Field '${field}' is required` });
            }
        }
              // Set paidAmount to 0 if not provided
           if (!contractInfo.paidAmount) {
            contractInfo.paidAmount = 0;
        }

        // Create a new tenant instance
        const newTenant = new Tenant({
            name,
            email,
            contact,
            nid,
            passport,
            address,
            ownerId,
            property,
            floorId,
            unitId,
            propertyType,
            contractInfo,
            status,
        });

        // Save the new tenant to the database
        const savedTenant = await newTenant.save();

        // Update the corresponding unit to mark it as occupied
        const updatedUnit = await Unit.findByIdAndUpdate(unitId, { occupied: true }, { new: true });

        // Send a success response
        res.status(201).json(savedTenant);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get all tenants and populate by owner, apartments, floor, and units
tenantRouter.get('/alltenants', async (req, res) => {
    try {
        const tenants = await Tenant.find({})
            .populate('ownerId', 'name') // Populate owner with only name
            .populate('property', 'name') // Populate property with only name
            .populate('floorId', 'name') // Populate floor with only number
            .populate('unitId', 'name'); // Populate unit with only number

        res.status(200).json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Route to update payment information for a specific tenant and PDC
tenantRouter.put('/:tenantId/pdc/:pdcId/payments', async (req, res) => {
    try {
        const { tenantId, pdcId } = req.params;
        const { paymentmethod, paymentstatus, amount, date,  checkorinvoice } = req.body;

        // Find the tenant by ID
        const tenant = await Tenant.findById(tenantId);

        // Find the PDC by ID
        const pdcIndex = tenant.contractInfo.pdc.findIndex(pdc => pdc._id.toString() === pdcId);
        if (pdcIndex === -1) {
            return res.status(404).json({ error: 'PDC not found' });
        }

        // Calculate new paidAmount
        const newPaidAmount = (Number(tenant.contractInfo.paidAmount) || 0) + Number(amount);

        // Update payment details
        tenant.contractInfo.payment.push({ paymentmethod, paymentstatus, amount, date ,checkorinvoice });
        tenant.contractInfo.paidAmount = newPaidAmount;

        // Remove the PDC
        tenant.contractInfo.pdc.splice(pdcIndex, 1);

        // Save the updated tenant
        await tenant.save();

        res.status(200).json({ message: 'Payment information updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// Export the router
export default tenantRouter;
