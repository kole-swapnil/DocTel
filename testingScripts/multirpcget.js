import Web3 from "web3"; // ES module syntax

// Define multiple RPC endpoints
const RPC_URLS = [
    "http://127.0.0.1:8553",
    "http://127.0.0.1:8547",
    "http://127.0.0.1:8545",
    "http://127.0.0.1:8549",
    "http://127.0.0.1:8551",
    "http://127.0.0.1:8555",
    "http://127.0.0.1:8557",
    "http://127.0.0.1:8559",
    "http://127.0.0.1:8561",
    "http://127.0.0.1:8563"
];

// Contract details
const contractAddress = "0xD6bE320401BA134224DaD28C1b755aAb947ceC8D";
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
const web3Instances = RPC_URLS.reduce((acc, url) => {
    acc[url] = new Web3(new Web3.providers.HttpProvider(url));
    return acc;
}, {});
const contractInstances = RPC_URLS.reduce((acc, url) => {
    acc[url] = new web3Instances[url].eth.Contract(abi, contractAddress);
    return acc;
}, {});
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// distribute 200 users randomly across RPC
const distributeUsers = () => {
    let remainingUsers = 512;
    let userDistribution = new Array(RPC_URLS.length).fill(40); // minimum 40 users per URL
    remainingUsers -= RPC_URLS.length * 40; // Subtract the allocated

    while (remainingUsers > 0) {
        for (let i = 0; i < RPC_URLS.length && remainingUsers > 0; i++) {
            let maxPossible = Math.min(70 - userDistribution[i], remainingUsers);
            let additionalUsers = Math.floor(Math.random() * (maxPossible + 1)); // Random allocation
            userDistribution[i] += additionalUsers;
            remainingUsers -= additionalUsers;
        }
    }
    return userDistribution;
};

// Generate promises using randomly selected methods

// response time for a given RPC URL and # of users
const measureResponseTime = async (rpcUrl, numUsers) => {
    console.log(`Starting ${numUsers} requests on ${rpcUrl}...`);
    const methods = [
        { name: "doctorCount", func: () => contract.methods.doctorCount().call() },
        { name: "patientCount", func: () => contract.methods.patientCount().call() },
        { name: "adminCount", func: () => contract.methods.adminCount().call() },
        { name: "treatmentCount", func: () => contract.methods.treatmentCount().call() },
    
        { name: "getTreatmentGone", func: () => contract.methods.getTreatmentGone(1247214214).call() },
        { name: "getdocTreatmentGone", func: () => contract.methods.getdocTreatmentGone(1).call() },
        { name: "getPrescriptionTreat", func: () => contract.methods.getPrescriptionTreat(1).call() },
        { name: "getReportTreat", func: () => contract.methods.getReportTreat(1).call() },
    
        { name: "patientIds", func: () => contract.methods.patientIds(1).call() },
        { name: "patientAadhars", func: () => contract.methods.patientAadhars(1247214214).call() },
    
        { name: "doctorIds", func: () => contract.methods.doctorIds(1).call() },
        { name: "doctorAadhars", func: () => contract.methods.doctorAadhars(1212121212).call() },
        { name: "doctorAddrs", func: () => contract.methods.doctorAddrs("0x901F829c16b274da1dDD8765Fc94d38060A0397E").call() },
    
        { name: "adminIds", func: () => contract.methods.adminIds(1).call() },
        { name: "adminAadhars", func: () => contract.methods.adminAadhars(7894324234).call() },
        { name: "adminAddrs", func: () => contract.methods.adminAddrs("0x258764F4F44b8a39e5Ac329B304328C83Bb24FC0").call() },
    
        { name: "treatments", func: () => contract.methods.treatments(1).call() }
    ];
    
    const contract = contractInstances[rpcUrl]; // Reuse the globally created contract instance
const startTime = Date.now();
const promises = Array.from({ length: numUsers }, () => {
    const selectedMethods = methods.sort(() => 0.5 - Math.random()).slice(0, 4); // Get 4 random methods
    const randomMethod = selectedMethods[Math.floor(Math.random() * 4)]; // Pick one

    // console.log(`${randomMethod.name}`); // Log function name
    return randomMethod.func(); // Call the function
});

try {
    await Promise.all(promises);
    return Date.now() - startTime; // Return total response time
} catch (err) {
    console.error(`Error on ${rpcUrl}:`, err);
    return null;
}
};

// Run a single full test with 200 users across 4 RPCs
const runSingleTest = async () => {
    const userDistribution = distributeUsers();
    console.log(`User distribution:`, RPC_URLS.map((url, i) => `${url}: ${userDistribution[i]} users`).join(" | "));

    const startTime = Date.now();

    const testPromises = RPC_URLS.map((rpcUrl, i) => measureResponseTime(rpcUrl, userDistribution[i]));
    await Promise.all(testPromises); // Run all RPCs in parallel

    const totalTime = Date.now() - startTime;
    console.log(`Total time for users: ${totalTime} ms`);
    sleep(5000);
    return totalTime;
};

const runAllTestsSync = () => {
    console.log("scalability test...");

    let totalTimeSum = 0;
    let validRuns = 0;

    let promiseChain = Promise.resolve();

    for (let i = 0; i < 50; i++) {
        promiseChain = promiseChain.then(() => {
            console.log(`Run ${i + 1}/50...`);
            return runSingleTest().then((totalTime) => {
                if (totalTime !== null) {
                    totalTimeSum += totalTime;
                    validRuns++;
                }
            });
        });
    }

    return promiseChain.then(() => {
        const avgTime = validRuns > 0 ? totalTimeSum / validRuns : "N/A";
        console.log(`Final Average Total Time: ${avgTime} ms`);
    });
};



// Execute the full test
runAllTestsSync();
