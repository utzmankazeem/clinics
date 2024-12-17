import express from 'express'
const router = express.Router();
import {dashboard, deleteDiagnosis, deletePatient, postEditPatient, getAddPatient, getEditDiagnosis, getPatientById, getPatientDiagnosis, postAddPatient, postEditDiagnosis, postPatientDiagnosis, viewDiagnosisById, viewPatient} 
from '../controller/indexController.js'




router.get('/dashboard', dashboard)
router.get('/addpatient', getAddPatient)
router.post('/addpatient', postAddPatient)
router.get('/viewpatient', viewPatient)
router.get('/edit/:patientID', getPatientById)
router.post('/edit/:patientID', postEditPatient)
router.get('/delete/:patientID', deletePatient)
router.get('/addDiagnosis/:patientID', getPatientDiagnosis)
router.post('/addDiagnosis', postPatientDiagnosis)
router.get('/viewDiagnosis/:patientID', viewDiagnosisById)
router.get('/editDiagnosis/:patientID', getEditDiagnosis)
router.post('/editDiagnosis/:patientID', postEditDiagnosis)
router.get('/deleteDiagnosis/:patientID', deleteDiagnosis)

export default router; 