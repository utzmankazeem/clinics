const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');
const Diagnosis = require('../models/diagnosis');


router.get('/', (req, res) => {

    res.render("welcome")

})

router.get('/dashboard', (req, res) => {
    if (!req.session.user_id) {
        req.flash('error_msg', "Please login to access app");
        res.redirect('/login');
    } else {
        res.render('dashboard', { u_id: req.session.user_id, uname: req.session.username });
    }
})

router.get('/addpatient', (req, res) => {
    if (!req.session.user_id) {
        req.flash("error_msg", 'please login to access app');
        res.redirect('/login');
    } else {
        res.render('add_patient', { u_id: req.session.user_id, uname: req.session.username })
    }
})

router.post('/addpatient', (req, res) => {
    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        const { firstname, lastname, sex, phone, status, bloodGroup, genotype } = req.body;
        let errors = []; //WE CREATE AN EMPTY ARRAY

        if (!firstname || !lastname || !sex || !phone || !status || !bloodGroup || !genotype) {
            errors.push({ msg: "some fields are missing, please fill them up" });
        }
        if (errors.length > 0) {
res.render('add_patient', { errors, u_id: req.session.user_id, uname: req.session.username, firstname, lastname, sex, phone, status, bloodGroup, genotype });
        } else {
            const patient = new Patient({
                firstname,
                lastname,
                sex,
                phone,
                status,
                bloodGroup,
                genotype,
                username: req.session.username
            })
            patient.save((er) => {
                if (er) {
                    req.flash('error_msg', "there was a problem adding patient");
                    res.redirect("/addpatient");
                } else {
                    req.flash("message", "patient now registered");
                    res.redirect('/viewpatient');
                }
            })
        }
    }
})

router.get('/viewpatient', (req, res) => {

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Patient.find({ username: req.session.username }, (er, patients) => {
            if (er) {
                req.flash("error_msg", 'please login to access app');
                console.log(er)
            } else {
                res.render("view_patient", {
                    u_id: req.session.user_id,
                    uname: req.session.username,
                    patients
                });
            }
        })
    }
})

router.get('/edit/:patientID', (req, res) => {
    const edit = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Patient.findById(edit, (er, ed) => {
            //console.log(ed)
            if (er) {
                req.flash('error_msg', "no patient with this id");
            } else {
                res.render("edit_patient", {
                    u_id: req.session.user_id,
                    uname: req.session.username,
                    patient: ed
                });
            }
        })
    }
})

router.post('/edit/:patientID', (req, res) => {
    const edit = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Patient.updateOne({_id: edit },
                          {$set: req.body},
            (er, editpat) => {
                console.log(editpat);
                if (er) {
                    console.log(er);
                } else {
                    req.flash("message", "patient edited successfully");
                    res.redirect("/viewpatient")
            }
        })
    }
})

router.get('/delete/:patientID', (req, res) => {
    const del = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Patient.findByIdAndRemove(del, (er, ed) => {
            console.log(ed)
            if (er) {
                req.flash('error_msg', "no patient with this id");
            } else {
                req.flash('message', "deleted this user");
                res.redirect('/viewpatient')
            }
        })
    }
})

router.get('/addDiagnosis/:patientID', (req, res) => {

    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        res.render('add_diagnosis', {
            u_id: req.session.user_id,
            uname: req.session.username,
            p_id: req.params.patientID
        });
    }
})

router.post('/addDiagnosis', (req, res) => {

    if (!req.session.user_id) {
        res.redirect('/login');
    } else {
        const { patient_id, complaint, recommendation } = req.body;
        let errors = []; //WE CREATE AN EMPTY ARRAY

        if (!complaint || !recommendation) {
            errors.push({ msg: "some fields are missing, please fill them up" });
        }
        if (errors.length > 0) {
            res.render('add_diagnosis', { errors, u_id: req.session.user_id, uname: req.session.username, patient_id, complaint, recommendation });
        } else {
            const diagnosis = new Diagnosis({
                patientid: patient_id,
                username: req.session.username,
                complaint,
                recommendation
            })
            diagnosis.save((er) => {
                if (er) {
                    req.flash('error_msg', "there was a problem adding diagnosis");
                    res.redirect("/viewpatient");
                } else {
                    req.flash("message", "Diagnosis Added");
                    res.redirect('/viewDiagnosis/:patientID')
                }
            })
        }
    }
})

router.get('/viewDiagnosis/:patientID', (req, res) => {
    const pat = req.params.patientID;
    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Diagnosis.findOne({ patientid: pat }, (er, diag) => {
            if (er) {
                req.flash('error_msg', "No record");
                res.redirect("/viewpatient");
            }
            if(diag == undefined) {
                req.flash('error_msg', "patient has no diagnosis record");
                res.redirect("/viewpatient");
            } else {
                res.render("view_diagnosis", {
                    u_id: req.session.user_id,
                    uname: req.session.username,
                    diags: diag
                });
            }
        })
    }
})

router.get('/editDiagnosis/:patientID', (req, res) => {

    const diag = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Diagnosis.findOne({ patientid: diag }, (er, editdiag) => {
            if (er) {
                req.flash('error_msg', "user has no diagnosis");
                console.log(er);
            } else {
                res.render("edit_diagnosis", {
                    u_id: req.session.user_id,
                    uname: req.session.username,
                    diags: editdiag
                });
            }
        })
    }
})

router.post('/editDiagnosis/:patientID', (req, res) => {

    const diag = req.params.patientID;

    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Diagnosis.updateOne({ _id: diag },
                            {$set: req.body},
            (er, editdiag) => {
                if (er) {
                    req.flash('error_msg', "error updating diagnosis");
                    res.redirect("/viewpatient");
                }
                if (editdiag == undefined) {
                    req.flash('error_msg', "error updating diagnosis");
                    res.redirect("/viewpatient");
                } else {
                    req.flash('message', "updated diagnosis");
                    res.redirect("/viewpatient");
            }
        })
    }
})

router.get('/deleteDiagnosis/:patientID', (req, res) => {
    const deldiag = req.params.patientID;
    if (!req.session.user_id) {
        req.flash("error_msg", "please login");
        res.redirect("/login")
    } else {
        Diagnosis.findByIdAndRemove({_id: deldiag}, (er, diag) => {
            if (er) {
                req.flash('error_msg', "user not found");
                res.redirect("/viewpatient")
            }
            if (diag == undefined) {
                req.flash('error_msg', "no patient found");
                res.redirect("/viewpatient")
            } else {
                req.flash('message', "Diagnosis deleted");
                res.redirect("/viewpatient")
            }
        })
    }
})

module.exports = router;