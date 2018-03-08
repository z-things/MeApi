/**
 * Created by song on 2015/7/20.
 */


exports.put = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "additionalProperties": true,
  "title": "Root schema.",
  "description": "An explanation about the puropose of this instance described by this schema.",
  "name": "/",
  "properties": {
    "online": {
      "id": "http://jsonschema.net/online",
      "type": "boolean",
      "title": "Online schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "online"
    },
    "name": {
      "id": "http://jsonschema.net/name",
      "type": "string",
      "title": "Name schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "name"
    },
    "description": {
      "id": "http://jsonschema.net/description",
      "type": "string",
      "title": "Description schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "description"
    },
    "location": {
      "id": "http://jsonschema.net/location",
      "type": "object",
      "additionalProperties": true,
      "title": "Location schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "location",
      "properties": {
        "locationId": {
          "id": "http://jsonschema.net/location/locationId",
          "type": "string",
          "title": "LocationId schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "locationId"
        },
        "locationType": {
          "id": "http://jsonschema.net/location/locationType",
          "type": "string",
          "title": "LocationType schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "locationType"
        },
        "locationName": {
          "id": "http://jsonschema.net/location/locationName",
          "type": "string",
          "title": "LocationName schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "locationName"
        }
      }
    },
    "icon": {
      "id": "http://jsonschema.net/icon",
      "type": "string",
      "title": "Icon schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "icon"
    },
    "enable": {
      "id": "http://jsonschema.net/enable",
      "type": "boolean",
      "title": "Enable schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "enable"
    },
    "owner": {
      "id": "http://jsonschema.net/owner",
      "type": "string",
      "title": "Owner schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "owner"
    },
    "extra": {
      "id": "http://jsonschema.net/extra",
      "type": "object",
      "properties": {
        "oneOf": []
      }
    }
  },
  "required": [
    "name",
    "icon",
  ]
}


