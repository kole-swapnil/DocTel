pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

contract DocTel {
    uint256 public patientCount = 0;
    uint256 public doctorCount = 0;
    uint256 public adminCount = 0;
    uint256 public treatmentCount = 0;

    struct Patient {
        uint256 patient_Id;
        uint256 patientAadhar;
        uint256 weight;
        uint256 height;
        uint256 gender;
        uint256 dob;
        uint256 bloodType;
        string location;
        uint256[] gonetreatment;
    }

    struct Doctor {
        uint256 doctor_Id;
        uint256 doctorAadhar;
        address doctorAddress;
        string speciality;
        string[] certifications;
        uint256[] doneTreatment;
        string location;
        string[] identity;
    }

    struct Admin {
        uint256 admin_Id;
        uint256 adminAadhar;
        address adminAddr;
        string role;
    }

    struct Treatment {
        uint256 treatment_Id;
        uint256 adminAadhar;
        uint256 patientAadhar;
        uint256[] doctorAadhars;
        string[] prescription;
        string[] reports;
        string temperature;
        string systolicBP;
        string diastolicBP;
        string heartRate;
    }

    mapping(uint256 => Patient) public patientIds;
    mapping(uint256 => Patient) public patientAadhars;

    mapping(uint256 => Doctor) public doctorIds;
    mapping(uint256 => Doctor) public doctorAadhars;
    mapping(address => Doctor) public doctorAddrs;

    mapping(uint256 => Admin) public adminIds;
    mapping(uint256 => Admin) public adminAadhars;
    mapping(address => Admin) public adminAddrs;

    mapping(uint256 => Treatment) public treatments;

    event treatAdded(
        uint256 indexed treatId,
        uint256 indexed patAadhar,
        uint256 indexed adminAadhar,
        uint256 times
    );
     event statsRecorded(
        uint256 indexed treatId,
        uint256 indexed patAadhar,
        string temperature,
        string systolicBP,
        string diastolicBP,
        string heartRate,
        uint256 times
    );

    event doctorAddedTreat(
        uint256 indexed treatId,
        uint256 indexed docAadhar,
        uint256 times
    );
    event PrescriptionAddedTreat(
        uint256 indexed treatId,
        string prescription,
        uint256 times
    );
    event ReportAddedTreat(
        uint256 indexed treatId,
        string report,
        uint256 times
    );

    modifier onlyAdmin() {
        require(adminAddrs[msg.sender].adminAddr != address(0x0), "Not Admin");
        _;
    }

    modifier onlyDoctor() {
        require(
            doctorAddrs[msg.sender].doctorAddress != address(0x0),
            "Not Admin"
        );
        _;
    }

    modifier onlyAdminDoctor() {
        require(
            (adminAddrs[msg.sender].adminAddr != address(0x0)) ||
                (doctorAddrs[msg.sender].doctorAddress != address(0x0)),
            "Not Admin"
        );
        _;
    }

    function addPatient(
        uint256 _patientAadhar,
        uint256 _weight,
        uint256 _height,
        uint256 _gender,
        uint256 _dob,
        uint256 _bloodType,
        string calldata _location
    ) public onlyAdminDoctor {
        bool isExisting = (patientAadhars[_patientAadhar].patient_Id != 0);
        if (!isExisting) {
            //add
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
        } else {
            //modify
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

    function addDoctor(
        uint256 _doctorAadhar,
        address _doctorAddress,
        string calldata _speciality,
        string calldata _location
    ) public onlyAdmin {
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
        } else {
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

    function addAdmin(
        uint256 _adminAadhar,
        address _adminAddr,
        string calldata _role
    ) public {
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
        } else {
            Admin memory adm;
            adm.adminAadhar = _adminAadhar;
            adm.adminAddr = _adminAddr;
            adm.role = _role;
            adminIds[adminCount] = adm;
            adminAadhars[_adminAadhar] = adm;
            adminAddrs[_adminAddr] = adm;
        }
    }

    function addTreatment(uint256 _adminAadhar, uint256 _patientAadhar, string memory _temperature, string memory _systolicBP,
        string memory _diastolicBP, string memory _heartRate)
        public
        onlyAdminDoctor
    {
        treatmentCount++;
        Treatment memory aux;
        aux.treatment_Id = treatmentCount;
        aux.patientAadhar = _patientAadhar;
        aux.adminAadhar = _adminAadhar;
        aux.temperature = _temperature;
        aux.systolicBP = _systolicBP;
        aux.diastolicBP = _diastolicBP;
        aux.heartRate = _heartRate;

        treatments[treatmentCount] = aux;
        patientAadhars[_patientAadhar].gonetreatment.push(treatmentCount);
        emit treatAdded(
            treatmentCount,
            _patientAadhar,
            _adminAadhar,
            block.timestamp
        );
        emit statsRecorded(treatmentCount,_patientAadhar, _temperature, _systolicBP, _diastolicBP, _heartRate, block.timestamp);
    }

    function addDoctorToTreatment(uint256 _treatment_Id, uint256 _doctorAadhar)
        public
        onlyAdminDoctor
    {
        treatments[_treatment_Id].doctorAadhars.push(_doctorAadhar);
        emit doctorAddedTreat(_treatment_Id, _doctorAadhar, block.timestamp);
    }

    function addPrescriptionTreat(
        uint256 _treatment_Id,
        string memory _prescription
    ) public onlyAdminDoctor {
        treatments[_treatment_Id].prescription.push(_prescription);
        emit PrescriptionAddedTreat(
            _treatment_Id,
            _prescription,
            block.timestamp
        );
    }

    function addReportTreat(uint256 _treatment_Id, string memory _report)
        public
        onlyAdminDoctor
    {
        treatments[_treatment_Id].reports.push(_report);
        emit ReportAddedTreat(_treatment_Id, _report, block.timestamp);
    }

    function getTreatmentGone(uint256 _patientAadhar)
        public
        view
        returns (uint256[] memory)
    {
        return patientAadhars[_patientAadhar].gonetreatment;
    }

    function getdocTreatmentGone(uint256 _treatment_Id)
        public
        view
        returns (uint256[] memory)
    {
        return treatments[_treatment_Id].doctorAadhars;
    }

    function getPrescriptionTreat(uint256 _treatment_Id)
        public
        view
        returns (string[] memory)
    {
        return treatments[_treatment_Id].prescription;
    }

    function getReportTreat(uint256 _treatment_Id)
        public
        view
        returns (string[] memory)
    {
        return treatments[_treatment_Id].reports;
    }
}
