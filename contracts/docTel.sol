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
        uint doctorAddress;
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
        uint[] doctorAadhar;
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

    function addPatient(uint _patient_Id, uint _patientAadhar, uint _weight, uint _height, uint _gender, uint _dob, uint _bloodType, string calldata _location) public {
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
        else {
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


}