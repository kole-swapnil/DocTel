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

}