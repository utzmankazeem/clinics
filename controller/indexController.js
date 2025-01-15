import Patient from '../models/patient.js'
import Diagnosis from '../models/diagnosis.js'

export const dashboard = async (req, res) => {
    if (!req.session.user_id) {
        req.flash('error_msg', "Please login to access app");
        return res.redirect('/users/login');
    } else {
        return res.render('dashboard', { u_id: req.session.user_id, uname: req.session.username });
    }
}

export const getAddPatient = async (req, res) => {
    if (!req.session.user_id) {
        req.flash("error_msg", 'please login to access app');
        return res.redirect('/users/login');
    } else {
        return res.render('add_patient', { u_id: req.session.user_id, uname: req.session.username })
    }
}

export const postAddPatient = async (req, res) => {
    if (!req.session.user_id) {
        return res.redirect('/users/login');
    }
    const { firstname, lastname, sex, phone, status, bloodGroup, genotype } = req.body;
    let errors = []; //WE CREATE AN EMPTY ARRAY

    if (!firstname || !lastname || !sex || !phone || !status || !bloodGroup || !genotype) {
        errors.push({ msg: "some fields are missing, please fill them up" });
    }
    if (errors.length > 0) {
        return res.render('add_patient', { errors, u_id: req.session.user_id, uname: req.session.username, firstname, lastname, sex, phone, status, bloodGroup, genotype });
    }
    try {
        await Patient.create({
            firstname,
            lastname,
            sex,
            phone,
            status,
            bloodGroup,
            genotype,
            username: req.session.username
        })
        req.flash("message", "patient now registered");
        return res.redirect('/viewpatient');
    } catch (error) {
        req.flash('error_msg', "there was a problem");
        return res.redirect("/addpatient");
    }
}

export const viewPatient = async (req, res) => {
    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        const patients = await Patient.find({username: req.session.username})
        return res.render("view_patient", {
            u_id: req.session.user_id,
            uname: req.session.username,
            patients
        })
    } catch (error) {
        req.flash("error_msg", 'hey Doc, you do not have any patient');
        return res.redirect("/addpatient");
    }
}

export const getPatientById = async (req, res) => {
    const _id = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        const ed = await Patient.findById({ _id })
        if (!ed) {
            req.flash("message", "patient not found ");
            return res.redirect("/viewpatient")
       } 
        return res.render("edit_patient", {
            u_id: req.session.user_id,
            uname: req.session.username,
            patient: ed
        }) 
        
    } catch (error) {
        req.flash('error_msg', "server error");
        return res.redirect("/viewpatient");
    }
}

export const postEditPatient = async (req, res) => {
    const edit = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        const patient = await Patient.updateOne({ _id: edit }, {$set: req.body})
        if (patient) {
            req.flash("message", "patient edited successfully");
            return res.redirect("/viewpatient")
        } else {
          req.flash('error_msg', 'update error');
          return res.redirect('/viewcustomer');
        }
    } catch (error) {
        req.flash("error_msg", "update failed");
        return res.redirect("/viewpatient")
    }

}

export const deletePatient = async (req, res) => {
    const del = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        await Patient.findByIdAndRemove({ _id:del })
        req.flash('message', "deleted this user");
        return res.redirect('/viewpatient')
    } catch (error) {
        console.log(error)
        req.flash('error_msg', "error deleting patient ");
        return res.redirect('/viewpatient')
    }
}

export const getPatientDiagnosis = async (req, res) => {
    const p_id = req.params.patientID
    if (!req.session.user_id) {
        return res.redirect('/users/login');
    } 
    try {
        const diag = await Diagnosis.findOne({patientid: p_id})
        if(diag){
            req.flash('message', "patient already diagnosed");
            return res.redirect('/viewDiagnosis/:patientID')
        } 
        return res.render('add_diagnosis', {
            u_id: req.session.user_id,
            uname: req.session.username,
            p_id: p_id
        });
    } catch (error) {
        console.log(error)
        req.flash('error_msg', "patient has no diag");
        return res.redirect('/viewpatient')
    }
}

export const postPatientDiagnosis = async (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/users/login');
    }
    const { patient_id, complaint, recommendation } = req.body;
    let errors = []; //WE CREATE AN EMPTY ARRAY

    if (!complaint || !recommendation) {
        errors.push({ msg: "some fields are missing, please fill them up" });
    }
    if (errors.length > 0) {
        res.render('add_diagnosis', { errors, u_id: req.session.user_id, uname: req.session.username, patient_id, complaint, recommendation });
    }
    try {
        await Diagnosis.create({
            patientid: patient_id,
            username: req.session.username,
            complaint,  
            recommendation
        })
        req.flash("message", "Diagnosis Added");
        return res.redirect('/viewDiagnosis/:patientID')
    } catch (error) {
        console.log(error)
        req.flash('error_msg', "there was a problem adding diagnosis");
        return res.redirect("/viewpatient");
    }
}

export const viewDiagnosisById = async (req, res) => {
    const pat = req.params.patientID;
    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return direct('/users/login');
    }
    try {
        const diag = await Diagnosis.findOne({ patientid:pat })
        if (!diag) {
            req.flash('error_msg', "patient has no diagnosis record");
            return res.redirect("/viewpatient");
        }
        return res.render("view_diagnosis", {
            u_id: req.session.user_id,
            uname: req.session.username,
            diags: diag
        });

    } catch (error) {
        req.flash('error_msg', "No diagnosis record");
        return res.redirect("/viewpatient");
    }
}

export const getEditDiagnosis = async (req, res) => {
    const diag = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        const editdiag = await Diagnosis.findOne({ patientid:diag })
        if (!editdiag) {
            req.flash('error_msg', "cannot get diagnosis record");
            return res.redirect("/viewpatient");
        }
        return res.render("edit_diagnosis", {
            u_id: req.session.user_id,
            uname: req.session.username,
            diags: editdiag
        });
    } catch (error) {
        req.flash('error_msg', "server error");
        return res.redirect("/viewpatient");
    }
}

export const postEditDiagnosis = async (req, res) => {
    const diag = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        const editdiag = await Diagnosis.updateOne({_id: diag },{$set: req.body})
        if (!editdiag) {
            req.flash('error_msg', "error updating diagnosis");
            return res.redirect("/viewpatient");
        }
        req.flash('message', " diagnosis updated");
        return res.redirect("/viewDiagnosis/:patientID");
    } catch (error) {
        console.log(error)
        req.flash('error_msg', "server error");
        return res.redirect("/viewpatient");
    }
}

export const deleteDiagnosis = async (req, res) => {
    const del = req.params.patientID;
    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        return res.redirect('/users/login');
    }
    try {
        // const diag = await Diagnosis.findByIdAndRemove({_id: del})
        await Diagnosis.deleteOne({_id: del})
        req.flash('message', "Diagnosis deleted");
        return res.redirect("/viewpatient")
    } catch (error) {
        req.flash('error_msg', "user not found");
        return res.redirect("/viewpatient")
    }
}