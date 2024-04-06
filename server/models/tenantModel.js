import mongoose from 'mongoose';

const { Schema } = mongoose;

const tenantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    nid: String,
    passport: String,
    address: String,
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    property: [{
        type: Schema.Types.ObjectId,
        ref: 'Property'
    }],
    floorId: {
        type: Schema.Types.ObjectId,
        ref: 'Floor'
    },
    unitId: {
        type: Schema.Types.ObjectId,
        ref: 'Unit'
    },
    propertyType: {
        type: String,
        enum: ['apartments'],
        required: true
    },
    contractInfo: {
        startingDate: {
            type: Date,
            required: true
        },
        monthsDuration: {
            type: Number,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        totalContractAmount: {
            type: Number,
            required: true
        },
        VAT: {
            type: Number,
            required: true
        },
        otherCost: Number,
        parking: Boolean,
        parkingValue: Number,
        discount: Number,
        finalAmount: {
            type: Number,
            required: true
        },
        paidAmount: Number,
        bank: String,
        totalChecks: Number,
        pdc: [{
            checkNumber: String,
            bank: String,
            date: Date,
            amount: Number,
        }],
        payment: [{
            paymentmethod : String,
            paymentstatus : String,
            amount: Number,
            checkorinvoice:String, 
            date: Date,
        }]
    }, 

    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
   
});

const Tenant = mongoose.model('Tenant', tenantSchema);

export default Tenant;
