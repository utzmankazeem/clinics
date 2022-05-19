const mongoose  = require("mongoose");

const diagnosisSchema = {
    patientid: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    complaint: {
        type: String,
        required: true
    },

    recommendation: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: Date.now
    }
}

const Diagnosis = new mongoose.model("Diagnosis", diagnosisSchema)

module.exports = Diagnosis;