import mongoose from 'mongoose';

const patientSchema = {
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    sex: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

   status: {
        type: String,
        required: true
    },

    bloodGroup: {
        type: String,
        required: true
    },

    genotype: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    date_registered: {
        type: Date,
        default: Date.now
    },
}

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;