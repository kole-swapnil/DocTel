import Web3 from "web3"; // ES module syntax

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));



// Contract Address
const contractAddress = "0xD6bE320401BA134224DaD28C1b755aAb947ceC8D";

// Contract ABI
const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "treatId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "prescription",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			}
		],
		"name": "PrescriptionAddedTreat",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "treatId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "report",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			}
		],
		"name": "ReportAddedTreat",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "treatId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "docAadhar",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			}
		],
		"name": "doctorAddedTreat",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "treatId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "patAadhar",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "adminAadhar",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "times",
				"type": "uint256"
			}
		],
		"name": "treatAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_adminAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_role",
				"type": "string"
			}
		],
		"name": "addAdmin",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_doctorAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_speciality",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "addDoctor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_doctorAadhar",
				"type": "uint256"
			}
		],
		"name": "addDoctorToTreatment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_patientAadhar",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_weight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_height",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_gender",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_dob",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_bloodType",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_location",
				"type": "string"
			}
		],
		"name": "addPatient",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_prescription",
				"type": "string"
			}
		],
		"name": "addPrescriptionTreat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_report",
				"type": "string"
			}
		],
		"name": "addReportTreat",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_patientAadhar",
				"type": "uint256"
			}
		],
		"name": "addTreatment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "adminAadhars",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "admin_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "adminAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "adminAddrs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "admin_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "adminAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "adminCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "adminIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "admin_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "adminAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "role",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "doctorAadhars",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "doctor_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "doctorAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "speciality",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "doctorAddrs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "doctor_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "doctorAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "speciality",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "doctorCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "doctorIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "doctor_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "doctorAadhar",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "doctorAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "speciality",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			}
		],
		"name": "getPrescriptionTreat",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			}
		],
		"name": "getReportTreat",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_patientAadhar",
				"type": "uint256"
			}
		],
		"name": "getTreatmentGone",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_treatment_Id",
				"type": "uint256"
			}
		],
		"name": "getdocTreatmentGone",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientAadhars",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "patient_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "patientAadhar",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "height",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "gender",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dob",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bloodType",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "patientCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "patientIds",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "patient_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "patientAadhar",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "weight",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "height",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "gender",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dob",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bloodType",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "treatmentCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "treatments",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "treatment_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "adminAadhar",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "patientAadhar",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// Create Contract Instance
const contract = new web3.eth.Contract(abi, contractAddress);

(async () => {
  try {
	console.log(">>>>")
    const value = await contract.methods.doctorCount().call();
    console.log("Stored data:", value);
  } catch (err) {
    console.error("Error reading data:", err);
  }
})();
