/**
 * Created by song on 2015/7/20.
 */


exports.post = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "id": "http://jsonschema.net",
    "type": "object",
    "properties": {
        "userId": {
            "id": "http://jsonschema.net/userId",
            "type": "string"
        },
        "combine": {
            "id": "http://jsonschema.net/combine",
            "type": "string"
        },
        "name": {
            "id": "http://jsonschema.net/name",
            "type": "string"
        },
        "description": {
            "id": "http://jsonschema.net/description",
            "type": "string"
        },
        "location": {
            "id": "http://jsonschema.net/location",
            "type": "object",
            "properties": {
                "locationId": {
                    "id": "http://jsonschema.net/location/locationId",
                    "type": "string"
                },
                "locationType": {
                    "id": "http://jsonschema.net/location/locationType",
                    "type": "string"
                },
                "locationName": {
                    "id": "http://jsonschema.net/location/locationName",
                    "type": "string"
                }
            }
        },
        "icon": {
            "id": "http://jsonschema.net/icon",
            "type": "string"
        },
        "enable": {
            "id": "http://jsonschema.net/enable",
            "type": "boolean"
        },
        "owner": {
            "id": "http://jsonschema.net/owner",
            "type": "string"
        },
        "type": {
            "id": "http://jsonschema.net/type",
            "type": "object",
            "properties": {
                "id": {
                    "id": "http://jsonschema.net/type/id",
                    "type": "string"
                },
                "name": {
                    "id": "http://jsonschema.net/type/name",
                    "type": "string"
                },
                "icon": {
                    "id": "http://jsonschema.net/type/icon",
                    "type": "string"
                }
            }
        },
        "extra": {
            "id": "http://jsonschema.net/extra",
            "type": "object",
            "properties": {
                "oneOf": [
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "plantName": {
                                "id": "http://jsonschema.net/plantName",
                                "type": "string",
                                "title": "PlantName schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantName"
                            },
                            "plantFirm": {
                                "id": "http://jsonschema.net/plantFirm",
                                "type": "string",
                                "title": "PlantFirm schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantFirm"
                            },
                            "plantDate": {
                                "id": "http://jsonschema.net/plantDate",
                                "type": "string",
                                "title": "PlantDate schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantDate"
                            },
                            "plantPower": {
                                "id": "http://jsonschema.net/plantPower",
                                "type": "string",
                                "title": "PlantPower schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantPower"
                            },
                            "plantCountry": {
                                "id": "http://jsonschema.net/plantCountry",
                                "type": "string",
                                "title": "PlantCountry schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantCountry"
                            },
                            "plantCity": {
                                "id": "http://jsonschema.net/plantCity",
                                "type": "string",
                                "title": "PlantCity schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantCity"
                            },
                            "plantTimezone": {
                                "id": "http://jsonschema.net/plantTimezone",
                                "type": "integer",
                                "title": "PlantTimezone schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantTimezone"
                            },
                            "plantLng": {
                                "id": "http://jsonschema.net/plantLng",
                                "type": "string",
                                "title": "PlantLng schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantLng"
                            },
                            "plantLat": {
                                "id": "http://jsonschema.net/plantLat",
                                "type": "string",
                                "title": "PlantLat schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantLat"
                            },
                            "plantIncome": {
                                "id": "http://jsonschema.net/plantIncome",
                                "type": "integer",
                                "title": "PlantIncome schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantIncome"
                            },
                            "plantMoney": {
                                "id": "http://jsonschema.net/plantMoney",
                                "type": "string",
                                "title": "PlantMoney schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantMoney"
                            },
                            "plantCoal": {
                                "id": "http://jsonschema.net/plantCoal",
                                "type": "integer",
                                "title": "PlantCoal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantCoal"
                            },
                            "plantCo2": {
                                "id": "http://jsonschema.net/plantCo2",
                                "type": "integer",
                                "title": "PlantCo2 schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantCo2"
                            },
                            "plantSo2": {
                                "id": "http://jsonschema.net/plantSo2",
                                "type": "integer",
                                "title": "PlantSo2 schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantSo2"
                            },
                            "plantImg": {
                                "id": "http://jsonschema.net/plantImg",
                                "type": "string",
                                "title": "PlantImg schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantImg"
                            },
                            "plantMap": {
                                "id": "http://jsonschema.net/plantMap",
                                "type": "string",
                                "title": "PlantMap schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "plantMap"
                            },
                            "dataLogs": {
                                "id": "http://jsonschema.net/dataLogs",
                                "type": "array",
                                "title": "DataLogs schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "dataLogs",
                                "items": {
                                    "id": "http://jsonschema.net/dataLogs/0",
                                    "type": "object",
                                    "additionalProperties": true,
                                    "title": "0 schema.",
                                    "description": "An explanation about the puropose of this instance described by this schema.",
                                    "name": "0",
                                    "properties": {
                                        "datalog_sn": {
                                            "id": "http://jsonschema.net/dataLogs/0/datalog_sn",
                                            "type": "integer",
                                            "title": "Datalog_sn schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "datalog_sn"
                                        },
                                        "lost": {
                                            "id": "http://jsonschema.net/dataLogs/0/lost",
                                            "type": "boolean",
                                            "title": "Lost schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "lost"
                                        },
                                        "alias": {
                                            "id": "http://jsonschema.net/dataLogs/0/alias",
                                            "type": "string",
                                            "title": "Alias schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "alias"
                                        },
                                        "device_type": {
                                            "id": "http://jsonschema.net/dataLogs/0/device_type",
                                            "type": "integer",
                                            "title": "Device_type schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "device_type"
                                        },
                                        "updata_internal": {
                                            "id": "http://jsonschema.net/dataLogs/0/updata_internal",
                                            "type": "integer",
                                            "title": "Updata_internal schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "updata_internal"
                                        },
                                        "unit_id": {
                                            "id": "http://jsonschema.net/dataLogs/0/unit_id",
                                            "type": "integer",
                                            "title": "Unit_id schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "unit_id"
                                        },
                                        "client_url": {
                                            "id": "http://jsonschema.net/dataLogs/0/client_url",
                                            "type": "string",
                                            "title": "Client_url schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "client_url"
                                        }
                                    }
                                }
                            }
                        },
                        "required": [
                            "plantName",
                            "plantFirm",
                            "plantDate",
                            "plantPower",
                            "plantCountry",
                            "plantCity",
                            "plantTimezone",
                            "plantLng",
                            "plantLat",
                            "plantIncome",
                            "plantMoney",
                            "plantCoal",
                            "plantCo2",
                            "plantSo2",
                            "dataLogs"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "alias": {
                                "id": "http://jsonschema.net/alias",
                                "type": "string",
                                "title": "Alias schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "alias"
                            },
                            "address": {
                                "id": "http://jsonschema.net/address",
                                "type": "string",
                                "title": "Address schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "address"
                            },
                            "status:": {
                                "id": "http://jsonschema.net/status:",
                                "type": "integer",
                                "title": "Status: schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "status:"
                            },
                            "lost": {
                                "id": "http://jsonschema.net/lost",
                                "type": "boolean",
                                "title": "Lost schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "lost"
                            },
                            "time": {
                                "id": "http://jsonschema.net/time",
                                "type": "string",
                                "title": "Time schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "time"
                            },
                            "etotal": {
                                "id": "http://jsonschema.net/etotal",
                                "type": "integer",
                                "title": "Etotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "etotal"
                            },
                            "inverterID": {
                                "id": "http://jsonschema.net/inverterID",
                                "type": "integer",
                                "title": "InverterID schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "inverterID"
                            },
                            "pac": {
                                "id": "http://jsonschema.net/pac",
                                "type": "integer",
                                "title": "Pac schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "pac"
                            }
                        },
                        "required": [
                            "alias",
                            "address",
                            "status:",
                            "lost",
                            "time",
                            "etotal",
                            "inverterID",
                            "pac"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "StorageID": {
                                "id": "http://jsonschema.net/StorageID",
                                "type": "integer",
                                "title": "StorageID schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "StorageID"
                            },
                            "alias": {
                                "id": "http://jsonschema.net/alias",
                                "type": "string",
                                "title": "Alias schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "alias"
                            },
                            "address": {
                                "id": "http://jsonschema.net/address",
                                "type": "string",
                                "title": "Address schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "address"
                            },
                            "lost": {
                                "id": "http://jsonschema.net/lost",
                                "type": "boolean",
                                "title": "Lost schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "lost"
                            },
                            "time": {
                                "id": "http://jsonschema.net/time",
                                "type": "string",
                                "title": "Time schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "time"
                            },
                            "pCharge": {
                                "id": "http://jsonschema.net/pCharge",
                                "type": "integer",
                                "title": "PCharge schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "pCharge"
                            },
                            "pDischarge": {
                                "id": "http://jsonschema.net/pDischarge",
                                "type": "integer",
                                "title": "PDischarge schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "pDischarge"
                            },
                            "VPV": {
                                "id": "http://jsonschema.net/VPV",
                                "type": "integer",
                                "title": "VPV schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "VPV"
                            },
                            "IPV": {
                                "id": "http://jsonschema.net/IPV",
                                "type": "integer",
                                "title": "IPV schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "IPV"
                            },
                            "iCharge": {
                                "id": "http://jsonschema.net/iCharge",
                                "type": "integer",
                                "title": "ICharge schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "iCharge"
                            },
                            "iDischarge": {
                                "id": "http://jsonschema.net/iDischarge",
                                "type": "integer",
                                "title": "IDischarge schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "iDischarge"
                            },
                            "PPV": {
                                "id": "http://jsonschema.net/PPV",
                                "type": "integer",
                                "title": "PPV schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "PPV"
                            },
                            "vBuck": {
                                "id": "http://jsonschema.net/vBuck",
                                "type": "integer",
                                "title": "VBuck schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "vBuck"
                            },
                            "VAC": {
                                "id": "http://jsonschema.net/VAC",
                                "type": "integer",
                                "title": "VAC schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "VAC"
                            },
                            "iacToUser": {
                                "id": "http://jsonschema.net/iacToUser",
                                "type": "integer",
                                "title": "IacToUser schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "iacToUser"
                            },
                            "pacToUser": {
                                "id": "http://jsonschema.net/pacToUser",
                                "type": "integer",
                                "title": "PacToUser schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "pacToUser"
                            },
                            "iacToGrid": {
                                "id": "http://jsonschema.net/iacToGrid",
                                "type": "integer",
                                "title": "IacToGrid schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "iacToGrid"
                            },
                            "pacToGrid": {
                                "id": "http://jsonschema.net/pacToGrid",
                                "type": "integer",
                                "title": "PacToGrid schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "pacToGrid"
                            },
                            "vBat": {
                                "id": "http://jsonschema.net/vBat",
                                "type": "integer",
                                "title": "VBat schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "vBat"
                            },
                            "capacity": {
                                "id": "http://jsonschema.net/capacity",
                                "type": "integer",
                                "title": "Capacity schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "capacity"
                            },
                            "Temperature": {
                                "id": "http://jsonschema.net/Temperature",
                                "type": "integer",
                                "title": "Temperature schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "Temperature"
                            },
                            "IPM_Temperature": {
                                "id": "http://jsonschema.net/IPM_Temperature",
                                "type": "integer",
                                "title": "IPM_Temperature schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "IPM_Temperature"
                            },
                            "errorCode": {
                                "id": "http://jsonschema.net/errorCode",
                                "type": "string",
                                "title": "ErrorCode schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "errorCode"
                            },
                            "warnCode": {
                                "id": "http://jsonschema.net/warnCode",
                                "type": "string",
                                "title": "WarnCode schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "warnCode"
                            },
                            "faultCode": {
                                "id": "http://jsonschema.net/faultCode",
                                "type": "string",
                                "title": "FaultCode schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "faultCode"
                            },
                            "epvToday": {
                                "id": "http://jsonschema.net/epvToday",
                                "type": "integer",
                                "title": "EpvToday schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "epvToday"
                            },
                            "epvTotal": {
                                "id": "http://jsonschema.net/epvTotal",
                                "type": "integer",
                                "title": "EpvTotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "epvTotal"
                            },
                            "eChargeToday": {
                                "id": "http://jsonschema.net/eChargeToday",
                                "type": "integer",
                                "title": "EChargeToday schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eChargeToday"
                            },
                            "eChargeTotal": {
                                "id": "http://jsonschema.net/eChargeTotal",
                                "type": "integer",
                                "title": "EChargeTotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eChargeTotal"
                            },
                            "eDisChargeToday": {
                                "id": "http://jsonschema.net/eDisChargeToday",
                                "type": "integer",
                                "title": "EDisChargeToday schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eDisChargeToday"
                            },
                            "eDisChargeTotal": {
                                "id": "http://jsonschema.net/eDisChargeTotal",
                                "type": "integer",
                                "title": "EDisChargeTotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eDisChargeTotal"
                            },
                            "eToUserToday": {
                                "id": "http://jsonschema.net/eToUserToday",
                                "type": "integer",
                                "title": "EToUserToday schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eToUserToday"
                            },
                            "eToUserTotal": {
                                "id": "http://jsonschema.net/eToUserTotal",
                                "type": "integer",
                                "title": "EToUserTotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eToUserTotal"
                            },
                            "eToGridToday": {
                                "id": "http://jsonschema.net/eToGridToday",
                                "type": "integer",
                                "title": "EToGridToday schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eToGridToday"
                            },
                            "eToGridTotal": {
                                "id": "http://jsonschema.net/eToGridTotal",
                                "type": "integer",
                                "title": "EToGridTotal schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "eToGridTotal"
                            }
                        },
                        "required": [
                            "StorageID",
                            "alias",
                            "address",
                            "lost",
                            "time",
                            "pCharge",
                            "pDischarge",
                            "VPV",
                            "IPV",
                            "iCharge",
                            "iDischarge",
                            "PPV",
                            "vBuck",
                            "VAC",
                            "iacToUser",
                            "pacToUser",
                            "iacToGrid",
                            "pacToGrid",
                            "vBat",
                            "capacity",
                            "Temperature",
                            "IPM_Temperature",
                            "errorCode",
                            "warnCode",
                            "faultCode",
                            "epvToday",
                            "epvTotal",
                            "eChargeToday",
                            "eChargeTotal",
                            "eDisChargeToday",
                            "eDisChargeTotal",
                            "eToUserToday",
                            "eToUserTotal",
                            "eToGridToday",
                            "eToGridTotal"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "nodeId": {
                                "id": "http://jsonschema.net/nodeId",
                                "type": "string",
                                "title": "NodeId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "nodeId"
                            },
                            "homeId": {
                                "id": "http://jsonschema.net/homeId",
                                "type": "string",
                                "title": "HomeId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "homeId"
                            },
                            "vendorId": {
                                "id": "http://jsonschema.net/vendorId",
                                "type": "string",
                                "title": "VendorId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "vendorId"
                            },
                            "productTypeId": {
                                "id": "http://jsonschema.net/productTypeId",
                                "type": "integer",
                                "title": "ProductTypeId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "productTypeId"
                            },
                            "productId": {
                                "id": "http://jsonschema.net/productId",
                                "type": "integer",
                                "title": "ProductId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "productId"
                            },
                            "securityFailed": {
                                "id": "http://jsonschema.net/securityFailed",
                                "type": "integer",
                                "title": "SecurityFailed schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "securityFailed"
                            },
                            "securityFailedMessage": {
                                "id": "http://jsonschema.net/securityFailedMessage",
                                "type": "string",
                                "title": "SecurityFailedMessage schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "securityFailedMessage"
                            },
                            "zwaveProtocolVersion": {
                                "id": "http://jsonschema.net/zwaveProtocolVersion",
                                "type": "number",
                                "title": "ZwaveProtocolVersion schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "zwaveProtocolVersion"
                            },
                            "zwaveLibraryType": {
                                "id": "http://jsonschema.net/zwaveLibraryType",
                                "type": "integer",
                                "title": "ZwaveLibraryType schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "zwaveLibraryType"
                            },
                            "netId": {
                                "id": "http://jsonschema.net/netId",
                                "type": "integer",
                                "title": "NetId schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "netId"
                            },
                            "wakeupInterval": {
                                "id": "http://jsonschema.net/wakeupInterval",
                                "type": "integer",
                                "title": "WakeupInterval schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "wakeupInterval"
                            },
                            "applicationVersion": {
                                "id": "http://jsonschema.net/applicationVersion",
                                "type": "number",
                                "title": "ApplicationVersion schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "applicationVersion"
                            },
                            "totalEndPoint": {
                                "id": "http://jsonschema.net/totalEndPoint",
                                "type": "integer",
                                "title": "TotalEndPoint schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "totalEndPoint"
                            },
                            "endPoint": {
                                "id": "http://jsonschema.net/endPoint",
                                "type": "array",
                                "title": "EndPoint schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "endPoint",
                                "items": {
                                    "id": "http://jsonschema.net/endPoint/0",
                                    "type": "object",
                                    "additionalProperties": true,
                                    "title": "0 schema.",
                                    "description": "An explanation about the puropose of this instance described by this schema.",
                                    "name": "0",
                                    "properties": {
                                        "uniqueId": {
                                            "id": "http://jsonschema.net/endPoint/0/uniqueId",
                                            "type": "integer",
                                            "title": "UniqueId schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "uniqueId"
                                        },
                                        "deviceClassGeneric": {
                                            "id": "http://jsonschema.net/endPoint/0/deviceClassGeneric",
                                            "type": "integer",
                                            "title": "DeviceClassGeneric schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "deviceClassGeneric"
                                        },
                                        "deviceClassGenericName": {
                                            "id": "http://jsonschema.net/endPoint/0/deviceClassGenericName",
                                            "type": "string",
                                            "title": "DeviceClassGenericName schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "deviceClassGenericName"
                                        },
                                        "deviceClassSpecific": {
                                            "id": "http://jsonschema.net/endPoint/0/deviceClassSpecific",
                                            "type": "integer",
                                            "title": "DeviceClassSpecific schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "deviceClassSpecific"
                                        },
                                        "deviceClassSpecificName": {
                                            "id": "http://jsonschema.net/endPoint/0/deviceClassSpecificName",
                                            "type": "string",
                                            "title": "DeviceClassSpecificName schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "deviceClassSpecificName"
                                        },
                                        "totalCommand": {
                                            "id": "http://jsonschema.net/endPoint/0/totalCommand",
                                            "type": "integer",
                                            "title": "TotalCommand schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "totalCommand"
                                        },
                                        "interface": {
                                            "id": "http://jsonschema.net/endPoint/0/interface",
                                            "type": "array",
                                            "title": "Interface schema.",
                                            "description": "An explanation about the puropose of this instance described by this schema.",
                                            "name": "interface",
                                            "items": {
                                                "id": "http://jsonschema.net/endPoint/0/interface/0",
                                                "type": "object",
                                                "additionalProperties": true,
                                                "title": "0 schema.",
                                                "description": "An explanation about the puropose of this instance described by this schema.",
                                                "name": "0",
                                                "properties": {
                                                    "version": {
                                                        "id": "http://jsonschema.net/endPoint/0/interface/0/version",
                                                        "type": "integer",
                                                        "title": "Version schema.",
                                                        "description": "An explanation about the puropose of this instance described by this schema.",
                                                        "name": "version"
                                                    },
                                                    "id": {
                                                        "id": "http://jsonschema.net/endPoint/0/interface/0/id",
                                                        "type": "integer",
                                                        "title": "Id schema.",
                                                        "description": "An explanation about the puropose of this instance described by this schema.",
                                                        "name": "id"
                                                    },
                                                    "name": {
                                                        "id": "http://jsonschema.net/endPoint/0/interface/0/name",
                                                        "type": "string",
                                                        "title": "Name schema.",
                                                        "description": "An explanation about the puropose of this instance described by this schema.",
                                                        "name": "name"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "required": [
                            "nodeId",
                            "homeId",
                            "vendorId",
                            "productTypeId",
                            "productId",
                            "securityFailed",
                            "securityFailedMessage",
                            "zwaveProtocolVersion",
                            "zwaveLibraryType",
                            "netId",
                            "wakeupInterval",
                            "applicationVersion",
                            "totalEndPoint",
                            "endPoint"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "ip": {
                                "id": "http://jsonschema.net/ip",
                                "type": "string",
                                "title": "Ip schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "ip"
                            },
                            "port": {
                                "id": "http://jsonschema.net/port",
                                "type": "integer",
                                "title": "Port schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "port"
                            },
                            "mac": {
                                "id": "http://jsonschema.net/mac",
                                "type": "string",
                                "title": "Mac schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "mac"
                            },
                            "type": {
                                "id": "http://jsonschema.net/type",
                                "type": "string",
                                "title": "Type schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "type"
                            },
                            "usrName": {
                                "id": "http://jsonschema.net/usrName",
                                "type": "string",
                                "title": "UsrName schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "usrName"
                            },
                            "password": {
                                "id": "http://jsonschema.net/password",
                                "type": "string",
                                "title": "Password schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "password"
                            }
                        },
                        "required": [
                            "ip",
                            "port",
                            "mac",
                            "type",
                            "usrName",
                            "password"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "properties": {
                            "id": {
                                "id": "http://jsonschema.net/id",
                                "type": "string"
                            },
                            "name": {
                                "id": "http://jsonschema.net/name",
                                "type": "string"
                            },
                            "mac_address": {
                                "id": "http://jsonschema.net/mac_address",
                                "type": "string"
                            },
                            "firmware_version": {
                                "id": "http://jsonschema.net/firmware_version",
                                "type": "string"
                            },
                            "capabilities": {
                                "id": "http://jsonschema.net/capabilities",
                                "type": "string"
                            },
                            "cpuid": {
                                "id": "http://jsonschema.net/cpuid",
                                "type": "string"
                            },
                            "is_new_box": {
                                "id": "http://jsonschema.net/is_new_box",
                                "type": "boolean"
                            },
                            "remoteId": {
                                "id": "http://jsonschema.net/remoteId",
                                "type": "string"
                            },
                            "remoteProtocol": {
                                "id": "http://jsonschema.net/remoteProtocol",
                                "type": "string"
                            },
                            "remoteDomain": {
                                "id": "http://jsonschema.net/remoteDomain",
                                "type": "string"
                            },
                            "remoteDomainPort": {
                                "id": "http://jsonschema.net/remoteDomainPort",
                                "type": "string"
                            },
                            "remoteEventDomain": {
                                "id": "http://jsonschema.net/remoteEventDomain",
                                "type": "string"
                            }
                        },
                        "required": [
                            "id",
                            "name",
                            "mac_address",
                            "firmware_version",
                            "capabilities",
                            "cpuid",
                            "is_new_box",
                            "remoteId",
                            "remoteProtocol",
                            "remoteDomain",
                            "remoteDomainPort",
                            "remoteEventDomain"
                        ]
                    },
                    {
                        "$schema": "http://json-schema.org/draft-04/schema#",
                        "id": "http://jsonschema.net",
                        "type": "object",
                        "additionalProperties": true,
                        "title": "Root schema.",
                        "description": "An explanation about the puropose of this instance described by this schema.",
                        "name": "/",
                        "properties": {
                            "address": {
                                "id": "http://jsonschema.net/address",
                                "type": "string",
                                "title": "Address schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "address"
                            },
                            "isLE": {
                                "id": "http://jsonschema.net/isLE",
                                "type": "boolean",
                                "title": "IsLE schema.",
                                "description": "An explanation about the puropose of this instance described by this schema.",
                                "name": "isLE"
                            }
                        },
                        "required": [
                            "address",
                            "isLE"
                        ]
                    }
                ]
            }
        }
    },
    "required": [
        "userId",
        "combine",
        "name",
        "icon",
        "enable",
        "owner",
        "type",
        "extra"
    ]
}

