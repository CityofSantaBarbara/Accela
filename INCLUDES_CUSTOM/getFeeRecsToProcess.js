//*********************Begin********************//
//***** Written by Gray Quarter			//
//***** Deployed on 05/07/2020 			//
//***** Fees for online payment using CTRCA script//
//***** Updated on 05/22/2020 to include solar PV//
//********************End************************//
function getFeeRecsToProcess() {

    return [{
                "recType": ["Building/Demolition/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            },{
                "recType": ["Building/Reroof/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/EV Charging/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Electrical/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Mechanical/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Plumbing/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/SolarWater/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/SolarPV/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "252"
            }, {
                "recType": ["Building/SolarPV/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_5000",
                "feeAmount": "1"
            }, {
                "recType": ["Building/SolarPV/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_5001",
                "feeAmount": ".50"
            }, {
                "recType": ["Building/SolarPV/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0018",
                "feeAmount": "18.64"
            }, {
                "recType": ["Building/BlackWall/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/RetainingWalls/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/PoolSpa/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Sign/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Miscellaneous/NA/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/PreApplication/NA/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/SiteWork/Driveway/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Buildling/SiteWork/Grading/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType":["Building/Sitework/Paving/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Sitework/Restripe/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Sitework/Revision/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Commercial/Addition/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Commercial/Alteration/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Commercial/Miscellaneous/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "250"
            }, {
                "recType": ["Building/Commercial/New/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Commercial/Revison/NA"],
                "feeSchedule": "BLD NRS FY2021",
               "feeCode": "BLD_ITM_0015",
                "feeAmount": "250"
            }, {
                "recType": ["Building/Residential/Accessory/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Residential/Addition/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Residential/Alteration/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "250"
            }, {
                "recType": ["Building/Residential/Miscellaneous/NA"],
                "feeSchedule": "BLD LINE ITEMS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "250"
            }, {
                "recType": ["Building/Residential/New/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "1000"
            }, {
                "recType": ["Building/Residential/Revision/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Admin/BFE/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Admin/Appeal/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "250"
            }, {
                "recType": ["Building/Admin/CodeAlt/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }, {
                "recType": ["Building/Admin/SpecialEvent/NA"],
                "feeSchedule": "BLD NRS FY2021",
                "feeCode": "BLD_ITM_0015",
                "feeAmount": "100"
            }
    
        ]
    }
    
