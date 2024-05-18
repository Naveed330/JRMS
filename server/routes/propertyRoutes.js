import express from 'express';
import Property from '../models/propertyModel.js';
import User from '../models/userModel.js'; // Assuming the user model is imported
import { isAuth, isSuperAdmin, isAdmin, isOwner } from '../utils.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import expressAsyncHandler from 'express-async-handler';
import Floor from '../models/floorModel.js';
import Unit from '../models/unitModel.js';

const propertyRouter = express.Router();

cloudinary.config({
    cloud_name: 'dn1oz4vt9',
    api_key: '376365558848471',
    api_secret: 'USb46ns9p4V7fAWMppTP54xiv00'
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
});

const upload = multer({ storage }).single('image');

const uploadToCloudinary = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: 'Invalid file format' });
        } else if (err) {
            return res.status(500).send({ message: 'Internal server error' });
        }
        next();
    });
};

// Endpoint to add property by Super admin
propertyRouter.post('/addproperty', uploadToCloudinary, isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { 
            name, 
            userId,
            cname,
            ccontact,
            cemail,
            address, 
            contactinfo,
            propertyImage,
            status, 
            propertyType, 
            municipality, 
            zone, 
            sector, 
            roadName, 
            plotNo, 
            plotAddress, 
            onwaniAddress, 
            propertyNo, 
            propertyRegistrationNo,
            city,
            area,
            bondtype,
            bondno,
            bonddate,
            govermentalno,
            pilotno,
            buildingname,
            nameandstreet,
            propertytype,
            description,
            propertyno,
            joveracommission
        } = req.body;

        // Check if required fields are provided
    //    if (!name || !userId  || !status || !propertyType) {
      //      return res.status(400).send({ message: 'Missing required fields' });
       // }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a property image' });
        }

        const property = new Property({
            name,
            user: userId,
            cname,
            ccontact,
            cemail,
            address,
            contactinfo,
            propertyImage: req.file.path,
            status,
            propertyType,
            municipality,
            zone,
            sector,
            roadName,
            plotNo,
            plotAddress,
            onwaniAddress,
            propertyNo,
            propertyRegistrationNo,
            city,
            area,
            bondtype,
            bondno,
            bonddate,
            govermentalno,
            pilotno,
            buildingname,
            nameandstreet,
            propertytype,
            description,
            propertyno,
            joveracommission
        });

        const savedProperty = await property.save();

        res.status(201).json(savedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// API to Add floor in the property 
propertyRouter.post('/floor/:propertyId/addFloor', isAuth, isSuperAdmin,async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { name, units } = req.body;
  
      // Check if the property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      // Create the floor
      const floor = new Floor({
        name,
        units
      });
  
      // Save the floor
      await floor.save();
  
      // Add the floor to the property
      property.floors.push(floor);
      await property.save();
  
      res.status(201).json({ message: 'Floor added to property successfully', floor });
    } catch (error) {
      console.error('Error adding floor to property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API to Delete floor from the property 
// API to Delete floor from the property 
propertyRouter.put('/floor/:propertyId/deleteFloor/:floorId', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { propertyId, floorId } = req.params;
        const { propertyName, floorName } = req.body;

        // Check if the property exists
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ error: 'Property not found' });
        }

        // Check if the floor exists in the property
        const floorIndex = property.floors.findIndex(floor => floor._id.toString() === floorId);
        if (floorIndex === -1) {
            return res.status(404).json({ error: 'Floor not found in the property' });
        }

        // Update the DelStatus of the floor
        property.floors[floorIndex].DelStatus = true;
        await property.save();

        // Optionally, you can also update the units associated with the floor

        // Send the property and floor names in the response
        res.status(200).json({ message: 'Floor marked as deleted from property successfully', propertyName, floorName });
    } catch (error) {
        console.error('Error marking floor as deleted from property:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
    // API endpoint to edit floor 
    propertyRouter.put('/floor/:floorId', isAuth, isSuperAdmin, async (req, res) => {
        try {
            const { floorId } = req.params;
            const { name, units } = req.body;
    
            // Check if the floor exists
            const floor = await Floor.findById(floorId);
            if (!floor) {
                return res.status(404).json({ error: 'Floor not found' });
            }
    
            // Update floor details
            if (name) floor.name = name;
            if (units) floor.units = units;
    
            await floor.save();
    
            res.status(200).json({ message: 'Floor updated successfully' });
        } catch (error) {
            console.error('Error updating floor:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
    

// API endpoint to add a unit to a floor
propertyRouter.post('/:floorId/addUnit', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { floorId } = req.params;
        const {  type, occupied, premiseNo, unitRegNo, unitNo } = req.body;

        // Check if the floor exists
        const floor = await Floor.findById(floorId);
        if (!floor) {
            return res.status(404).json({ error: 'Floor not found' });
        }

        // Create the unit
        const unit = new Unit({
            type,
            occupied,
            premiseNo,
            unitRegNo,
            unitNo
        });

        // Save the unit
        await unit.save();

        // Add the unit to the floor
        floor.units.push(unit);
        await floor.save();

        res.status(201).json({ message: 'Unit added to floor successfully', unit });
    } catch (error) {
        console.error('Error adding unit to floor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


  //API To Delete unit 
  propertyRouter.delete('/:floorId/deleteUnit/:unitId', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { floorId, unitId } = req.params;
        console.log('Floor ID:', floorId);
        console.log('Unit ID:', unitId);

        // Check if the floor exists
        const floor = await Floor.findById(floorId);
        if (!floor) {
            console.error('Floor not found');
            return res.status(404).json({ error: 'Floor not found' });
        }

        // Check if the unit exists on the floor
        const unitIndex = floor.units.findIndex(unit => unit._id.toString() === unitId);
        if (unitIndex === -1) {
            console.error('Unit not found on the floor');
            return res.status(404).json({ error: 'Unit not found on the floor' });
        }

        // Remove the unit from the floor
        floor.units.splice(unitIndex, 1);
        await floor.save();

        console.log('Unit deleted from floor successfully');
        return res.status(200).json({ message: 'Unit deleted from floor successfully' });
    } catch (error) {
        console.error('Error deleting unit from floor:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


// Edit unit route
// Update the route handler
propertyRouter.put('/:floorId/editUnit/:unitId', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { floorId, unitId } = req.params;
        const { type, occupied, premiseNo,  unitRegNo, unitNo } = req.body;

        // Check if the floor exists
        const floor = await Floor.findById(floorId);
        if (!floor) {
            console.error('Floor not found');
            return res.status(404).json({ error: 'Floor not found' });
        }

        // Find the unit by ID
        const unit = await Unit.findById(unitId);
        if (!unit) {
            console.error('Unit not found');
            return res.status(404).json({ error: 'Unit not found' });
        }

        // Update the unit fields
        unit.type = type;
        unit.occupied = occupied;
        unit.premiseNo = premiseNo;
        unit.unitRegNo = unitRegNo;
        unit.unitNo = unitNo;
        await unit.save();

        console.log('Unit edited successfully');
        return res.status(200).json({ message: 'Unit edited successfully' });
    } catch (error) {
        console.error('Error editing unit:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
  

// Endpoint to get all properties (for superadmin) with user and floor details populated
propertyRouter.get('/allproperties', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('user', 'name email contact') // Populate user details
            .populate({
                path: 'floors', // Populate floors field
                populate: {
                    path: 'units' // Populate units field within each floor
                }
            });
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get all properties (for superadmin) with user and floor details populated
propertyRouter.get('/singleproperty/:propertyId?', isAuth, isSuperAdmin, async (req, res) => {
    try {
        const { propertyId } = req.params;
        if (propertyId) {
            const property = await Property.findById(propertyId)
                .populate('user', 'name email contact') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            return res.status(200).json(property);
        } else {
            const properties = await Property.find()
                .populate('user', 'name email') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            return res.status(200).json(properties);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
 





// Endpoit to delete property (for Superadmin) 
propertyRouter.delete(
    '/:id',
    isAuth,
    isSuperAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const property = await Property.findOne({ _id: req.params.id });

            if (!property) {
                return res.status(404).send({ message: 'property not found' });
            }

            await Property.deleteOne({ _id: req.params.id });
            res.send({ message: 'Property deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ message: 'Error deleting user' });
        }
    })
);


// Endpoint to edit property (for Superadmin)
propertyRouter.put(
    '/edit/:id',
    uploadToCloudinary,
    isAuth,
    isSuperAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const { name, user, address, status, propertyType , contactinfo,  cname, ccontact,cemail,municipality,zone, sector, roadName, plotNo,plotAddress, onwaniAddress, propertyNo, propertyRegistrationNo, city,area, joveracommission} = req.body;
            
            const property = await Property.findOne({ _id: req.params.id });

            if (!property) {
                return res.status(404).send({ message: 'Property not found' });
            }

            // Update the property details
            property.name = name;
            property.user = user;
            property.status = status;
            property.address = address;
            property.propertyType = propertyType;
            property.contactinfo = contactinfo;
            property.cname = cname;
            property.ccontact = ccontact;
            property.cemail = cemail;
            property.municipality = municipality;
            property.zone = zone;
            property.sector = sector;
            property.roadName = roadName;
            property.plotNo = plotNo;
            property.plotAddress = plotAddress;
            property.onwaniAddress = onwaniAddress;            
            property.propertyNo = propertyNo;
            property.propertyRegistrationNo = propertyRegistrationNo;
            property.city = city;
            property.area = area;
            property.address = joveracommission;

           


            
           if(req.file){
                // If a new image is uploaded, update the path
                property.propertyImage= req.file.path; 
           }
           
           // Update other fields as needed
           property.status= status;
           property.propertyType= propertyType;
           property.contactinfo= contactinfo;

          const updatedProperty= await property.save();

     res.send(updatedProperty);
         
        } catch (error) {
            console.error('Error editing user:', error);
             res.status(500).send({ message: 'Error editing user' });
        }
    })
);

propertyRouter.post('/properties-by-user', isAuth, isSuperAdmin, async (req, res) => {
    const { userId } = req.body; // Get userId from request body

    try {
        // Find properties where the user ID matches
        const properties = await Property.find({ user: userId });

        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



////   Admin Property Routes //// 
////   Admin Property Routes //// 
////   Admin Property Routes //// 


propertyRouter.post('/addpropertyforadmin', uploadToCloudinary, isAuth, isAdmin, async (req, res) => {
    try {
        const { 
            name, 
            userId,
            cname,
            ccontact,
            cemail,
            address, 
            contactinfo,
            propertyImage,
            status, 
            propertyType, 
            municipality, 
            zone, 
            sector, 
            roadName, 
            plotNo, 
            plotAddress, 
            onwaniAddress, 
            propertyNo, 
            propertyRegistrationNo,
            city,
            area,
            bondtype,
            bondno,
            bonddate,
            govermentalno,
            pilotno,
            buildingname,
            nameandstreet,
            propertytype,
            description,
            propertyno,
        } = req.body;

        // Check if required fields are provided
    //    if (!name || !userId  || !status || !propertyType) {
      //      return res.status(400).send({ message: 'Missing required fields' });
       // }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).send({ message: 'Please upload a property image' });
        }

        const property = new Property({
            name,
            user: userId,
            cname,
            ccontact,
            cemail,
            address,
            contactinfo,
            propertyImage: req.file.path,
            status,
            propertyType,
            municipality,
            zone,
            sector,
            roadName,
            plotNo,
            plotAddress,
            onwaniAddress,
            propertyNo,
            propertyRegistrationNo,
            city,
            area,
            bondtype,
            bondno,
            bonddate,
            govermentalno,
            pilotno,
            buildingname,
            nameandstreet,
            propertytype,
            description,
            propertyno
        });

        const savedProperty = await property.save();

        res.status(201).json(savedProperty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Endpoint to edit property (for Admin)
propertyRouter.put(
    '/propertyforadmin/edit/:id',
    uploadToCloudinary,
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const { name, user, address, status, propertyType , contactinfo} = req.body;
            
            const property = await Property.findOne({ _id: req.params.id });

            if (!property) {
                return res.status(404).send({ message: 'Property not found' });
            }

            // Update the property details
            property.name = name;
            property.user = user;
            property.address = address;
            
           if(req.file){
                // If a new image is uploaded, update the path
                property.propertyImage= req.file.path; 
           }
           
           // Update other fields as needed
           property.status= status;
           property.propertyType= propertyType;
           property.contactinfo= contactinfo;

          const updatedProperty= await property.save();

     res.send(updatedProperty);
         
        } catch (error) {
            console.error('Error editing user:', error);
             res.status(500).send({ message: 'Error editing user' });
        }
    })
);
 // API to Add floor in the property 
propertyRouter.post('/floorforadmin/:propertyId/addFloor', isAuth, isAdmin,async (req, res) => {
    try {
      const { propertyId } = req.params;
      const { name, units } = req.body;
  
      // Check if the property exists
      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ error: 'Property not found' });
      }
  
      // Create the floor
      const floor = new Floor({
        name,
        units
      });
  
      // Save the floor
      await floor.save();
  
      // Add the floor to the property
      property.floors.push(floor);
      await property.save();
  
      res.status(201).json({ message: 'Floor added to property successfully', floor });
    } catch (error) {
      console.error('Error adding floor to property:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });


    // API endpoint to edit floor 
    propertyRouter.put('/floorforadmin/:floorId', isAuth, isAdmin, async (req, res) => {
        try {
            const { floorId } = req.params;
            const { name, units } = req.body;
    
            // Check if the floor exists
            const floor = await Floor.findById(floorId);
            if (!floor) {
                return res.status(404).json({ error: 'Floor not found' });
            }
    
            // Update floor details
            if (name) floor.name = name;
            if (units) floor.units = units;
    
            await floor.save();
    
            res.status(200).json({ message: 'Floor updated successfully' });
        } catch (error) {
            console.error('Error updating floor:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    // API endpoint to add a unit to a floor
propertyRouter.post('/unitforadmin/:floorId/addUnit', isAuth, isAdmin, async (req, res) => {
    try {
        const { floorId } = req.params;
        const {  type, occupied, premiseNo, unitRegNo, unitNo } = req.body;

        // Check if the floor exists
        const floor = await Floor.findById(floorId);
        if (!floor) {
            return res.status(404).json({ error: 'Floor not found' });
        }

        // Create the unit
        const unit = new Unit({
            type,
            occupied,
            premiseNo,
            unitRegNo,
            unitNo
        });

        // Save the unit
        await unit.save();

        // Add the unit to the floor
        floor.units.push(unit);
        await floor.save();

        res.status(201).json({ message: 'Unit added to floor successfully', unit });
    } catch (error) {
        console.error('Error adding unit to floor:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

propertyRouter.put('/unitforadmin/:floorId/editUnit/:unitId', isAuth, isAdmin, async (req, res) => {
    try {
        const { floorId, unitId } = req.params;
        const { type, occupied, premiseNo,  unitRegNo, unitNo } = req.body;

        // Check if the floor exists
        const floor = await Floor.findById(floorId);
        if (!floor) {
            console.error('Floor not found');
            return res.status(404).json({ error: 'Floor not found' });
        }

        // Find the unit by ID
        const unit = await Unit.findById(unitId);
        if (!unit) {
            console.error('Unit not found');
            return res.status(404).json({ error: 'Unit not found' });
        }

        // Update the unit fields
        unit.type = type;
        unit.occupied = occupied;
        unit.premiseNo = premiseNo;
        unit.unitRegNo = unitRegNo;
        unit.unitNo = unitNo;
        await unit.save();

        console.log('Unit edited successfully');
        return res.status(200).json({ message: 'Unit edited successfully' });
    } catch (error) {
        console.error('Error editing unit:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
  


propertyRouter.get('/allpropertiesforadmin', isAuth, isAdmin, async (req, res) => {
    try {
        const properties = await Property.find()
            .populate('user') // Populate user details
            .populate({
                path: 'floors', // Populate floors field
                populate: {
                    path: 'units' // Populate units field within each floor
                }
            });
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
   ////  single property admin
propertyRouter.get('/singlepropertyforadmin/:propertyId?', isAuth, isAdmin, async (req, res) => {
    try {
        const { propertyId } = req.params;
        if (propertyId) {
            const property = await Property.findById(propertyId)
                .populate('user', 'name email contact') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            return res.status(200).json(property);
        } else {
            const properties = await Property.find()
                .populate('user', 'name email') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            return res.status(200).json(properties);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


propertyRouter.delete(
    '/deletebyadmin/:id',
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const property = await Property.findOne({ _id: req.params.id });

            if (!property) {
                return res.status(404).send({ message: 'property not found' });
            }

            await Property.deleteOne({ _id: req.params.id });
            res.send({ message: 'Property deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).send({ message: 'Error deleting user' });
        }
    })
);


propertyRouter.put(
    '/editbyadmin/:id',
    uploadToCloudinary,
    isAuth,
    isAdmin,
    expressAsyncHandler(async (req, res) => {
        try {
            const { name, userId, address, status, propertyType , contactinfo} = req.body;
            
            const property = await Property.findOne({ _id: req.params.id });

            if (!property) {
                return res.status(404).send({ message: 'Property not found' });
            }

            // Update the property details
            property.name = name;
            property.user = userId;
            property.address = address;
            
           if(req.file){
                // If a new image is uploaded, update the path
                property.propertyImage= req.file.path; 
           }
           
           // Update other fields as needed
           property.status= status;
           property.propertyType= propertyType;
           property.contactinfo= contactinfo;

          const updatedProperty= await property.save();

     res.send(updatedProperty);
         
        } catch (error) {
            console.error('Error editing user:', error);
             res.status(500).send({ message: 'Error editing user' });
        }
    })
);





////   Owner Property Routes //// 
////   Owner Property Routes //// 
////   Owner Property Routes //// 
propertyRouter.get('/myproperties', isAuth, isOwner, async (req, res) => {
    try {
        // Retrieve properties for the current user and populate the 'floors' field
        const properties = await Property.find({ user: req.user._id })
            .populate({
                path: 'floors',
                populate: { path: 'units' } // Populate the 'units' field within each 'floor' document
            });
        res.status(200).json(properties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get all properties (for owner) with user and floor details populated
propertyRouter.get('/singlepropertyforowners/:propertyId?', isAuth , async (req, res) => {
    try {
        const { propertyId } = req.params;
        if (propertyId) {
            const property = await Property.findById(propertyId)
                .populate('user', 'name email contact') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            if (!property) {
                return res.status(404).json({ error: 'Property not found' });
            }
            return res.status(200).json(property);
        } else {
            const properties = await Property.find()
                .populate('user', 'name email') // Populate user details
                .populate({
                    path: 'floors', // Populate floors field
                    populate: {
                        path: 'units' // Populate units field within each floor
                    }
                });
            return res.status(200).json(properties);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});




export default propertyRouter;


