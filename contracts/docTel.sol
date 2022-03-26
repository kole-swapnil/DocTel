pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract DocTel{

    uint public patientCount = 0;
    uint public doctorCount = 0;
    uint public adminCount = 0;
    uint public treatmentCount = 0;

    struct Patient {
      uint patient_Id;
      uint patientAadhar;
      uint weight;
      uint height;
      uint gender;
      uint dob;
      uint bloodType;
      string location;
      uint[] gonetreatment;
    }

    struct Doctor {
        uint doctor_Id;
        uint doctorAadhar;
        address doctorAddress;
        string speciality;
        string[] certifications;
        uint[] doneTreatment;
        string location;
        string[] identity;
    }

    struct Admin {
        uint admin_Id;
        uint adminAadhar;
        address adminAddr;
        string role;
    }

    struct Treatment {
        uint treatment_Id;
        uint adminAadhar;
        uint patientAadhar;
        uint[] doctorAadhars;
        string[] prescription;
        string[] reports;
    }

    mapping(uint=>Patient) public patientIds;
    mapping(uint=>Patient) public patientAadhars;

    mapping(uint=>Doctor) public doctorIds;
    mapping(uint=>Doctor) public doctorAadhars;
    mapping(address=>Doctor) public doctorAddrs;

    mapping(uint=>Admin) public adminIds;
    mapping(uint=>Admin) public adminAadhars;
    mapping(address=>Admin) public adminAddrs;

    mapping(uint => Treatment) public treatments;

    function addPatient(uint _patientAadhar, uint _weight, uint _height, uint _gender, uint _dob, uint _bloodType, string calldata _location) public {
        bool isExisting = (patientAadhars[_patientAadhar].patient_Id != 0);
        if (!isExisting) {                    //add
            patientCount++;
            Patient memory pat;
            pat.patient_Id = patientCount;
            pat.patientAadhar = _patientAadhar;
            pat.weight = _weight;
            pat.height = _height;
            pat.gender = _gender;
            pat.dob = _dob;
            pat.bloodType = _bloodType;
            pat.location = _location;
            patientIds[patientCount] = pat;
            patientAadhars[_patientAadhar] = pat;  
        }
        else {                                  //modify
            Patient memory pat = patientAadhars[_patientAadhar];
            pat.patientAadhar = _patientAadhar;
            pat.weight = _weight;
            pat.height = _height;
            pat.gender = _gender;
            pat.dob = _dob;
            pat.bloodType = _bloodType;
            pat.location = _location;
            patientIds[patientCount] = pat;
            patientAadhars[_patientAadhar] = pat;      
        }
    }

    function addDoctor (uint _doctorAadhar, address _doctorAddress, string calldata _speciality, string calldata _location) public {
        bool isExisting = (doctorAadhars[_doctorAadhar].doctor_Id != 0);
        if (!isExisting) {
            doctorCount++;
            Doctor memory doc;
            doc.doctor_Id = doctorCount;
            doc.doctorAadhar = _doctorAadhar;
            doc.doctorAddress = _doctorAddress;
            doc.speciality = _speciality;
            doc.location = _location;
            doctorIds[doctorCount] = doc;
            doctorAadhars[_doctorAadhar] = doc;
            doctorAddrs[_doctorAddress] = doc;
        }                    
        else {
            Doctor memory doc = doctorAadhars[_doctorAadhar];
            doc.doctor_Id = doctorCount;
            doc.doctorAadhar = _doctorAadhar;
            doc.doctorAddress = _doctorAddress;
            doc.speciality = _speciality;
            doc.location = _location;
            doctorIds[doctorCount] = doc;
            doctorAadhars[_doctorAadhar] = doc;
            doctorAddrs[_doctorAddress] = doc;
            
        }
    }

    function addAdmin (uint _adminAadhar, address _adminAddr, string calldata _role) public {
        bool isExisting = (adminAadhars[_adminAadhar].admin_Id != 0);
        if (!isExisting) {
            adminCount++;
            Admin memory adm;
            adm.admin_Id = adminCount;
            adm.adminAadhar = _adminAadhar;
            adm.adminAddr = _adminAddr;
            adm.role = _role;
            adminIds[adminCount] = adm;
            adminAadhars[_adminAadhar] = adm;
            adminAddrs[_adminAddr] = adm;
        }   
        else {
            Admin memory adm;
            adm.adminAadhar = _adminAadhar;
            adm.adminAddr = _adminAddr;
            adm.role = _role;
            adminIds[adminCount] = adm;
            adminAadhars[_adminAadhar] = adm;
            adminAddrs[_adminAddr] = adm;    
        }    
    }

    function addTreatment ( uint _adminAadhar, uint _patientAadhar) public {
        treatmentCount++;
        Treatment memory aux;
        aux.treatment_Id = treatmentCount;
        aux.patientAadhar = _patientAadhar;
        aux.adminAadhar = _adminAadhar;
        treatments[treatmentCount] = aux;
        patientAadhars[_patientAadhar].gonetreatment.push(treatmentCount);

    }

    function addDoctorToTreatment (uint _treatment_Id, uint _doctorAadhar) public {
        treatments[_treatment_Id].doctorAadhars.push(_doctorAadhar);
    }

    function addPrescriptionTreat (uint _treatment_Id, string memory _prescription) public {
        treatments[_treatment_Id].prescription.push(_prescription);
    }

    function addReportTreat (uint _treatment_Id, string memory _report) public {
        treatments[_treatment_Id].reports.push(_report);
    }

    function getTreatmentGone(uint _patientAadhar)public view returns (uint[] memory){
        return patientAadhars[_patientAadhar].gonetreatment;
    }

}