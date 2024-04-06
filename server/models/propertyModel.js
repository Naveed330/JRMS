import mongoose from 'mongoose';

const { Schema } = mongoose;

const propertySchema = new Schema({
    name: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        validate: {
            validator: async function(userId) {
                const User = mongoose.model('User');
                const user = await User.findById(userId);
                return user && user.role === 'owner';
            },
            message: 'User does not have owner role.'
        }
    },
    address: String,
    contactinfo: String,
    propertyImage: String,
    status: {
        type: String,
        enum: ['enabled', 'disabled'],
        default: 'enable'
    },
    propertyType: {
        type: String,
        enum: [ 'apartments', ]
    },
    floors: [{
        type: Schema.Types.ObjectId,
        ref: 'Floor'
    }]
});

const Property = mongoose.model('Property', propertySchema);

export default Property;
