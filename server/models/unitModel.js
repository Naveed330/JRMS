import mongoose from 'mongoose';

const { Schema } = mongoose;

const unitSchema = new Schema({
    name: String,
    type: {
        type: String,
        enum: ['studio', '1BHK', '2BHK', '3BHK', 'penthouse'] 
    },
    occupied: {
        type: Boolean,
        default: false
    }
});

const Unit = mongoose.model('Unit', unitSchema);

export default Unit;
