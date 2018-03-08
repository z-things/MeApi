/**
 * Created by song on 2015/7/16.
 */

exports.post = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "additionalProperties": true,
  "title": "Root schema.",
  "description": "An explanation about the puropose of this instance described by this schema.",
  "name": "/",
  "properties": {
    "owner": {
      "id": "http://jsonschema.net/owner",
      "type": "string",
      "title": "Owner schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "owner"
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
    "type": {
      "id": "http://jsonschema.net/type",
      "type": "object",
      "additionalProperties": true,
      "title": "Type schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "type",
      "properties": {
        "id": {
          "id": "http://jsonschema.net/type/id",
          "type": "string",
          "title": "Id schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "id"
        },
        "name": {
          "id": "http://jsonschema.net/type/name",
          "type": "string",
          "title": "Name schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "name"
        },
        "icon": {
          "id": "http://jsonschema.net/type/icon",
          "type": "string",
          "title": "Icon schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "icon"
        }
      }
    },
    "extra": {
      "id": "http://jsonschema.net/extra",
      "type": "object",
      "additionalProperties": true,
      "title": "Extra schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "extra",
      "properties": {
        "phoneNumber": {
          "id": "http://jsonschema.net/extra/phoneNumber",
          "type": "string",
          "title": "PhoneNumber schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "phoneNumber"
        },
        "email": {
          "id": "http://jsonschema.net/extra/email",
          "type": "string",
          "title": "Email schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "email"
        },
        "password": {
          "id": "http://jsonschema.net/extra/Password",
          "type": "string",
          "title": "Password schema.",
          "description": "An explanation about the puropose of this instance described by this schema.",
          "name": "password",
          "pattern": "((?=.*\\d)(?=.*\\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,16}$"
        }
      },
      "required": [
        "phoneNumber",
        "password"
      ]
    }
  },
  "required": [
    "type",
    "extra"
  ]
};


exports.put = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "additionalProperties": true,
  "title": "Root schema.",
  "description": "An explanation about the puropose of this instance described by this schema.",
  "name": "/",
  "properties": {
    "name": {
      "id": "http://jsonschema.net/name",
      "type": "string",
      "title": "Name schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "name"
    },
    "icon": {
      "id": "http://jsonschema.net/icon",
      "type": "string",
      "title": "Icon schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "icon"
    }
  },
  "required": [
    "name",
    "icon"
  ]
};

exports.phoneNumber = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "additionalProperties": true,
  "title": "Root schema.",
  "description": "An explanation about the puropose of this instance described by this schema.",
  "name": "/",
  "properties": {
    "phoneNumber": {
      "id": "http://jsonschema.net/extra/phoneNumber",
      "type": "string",
      "title": "PhoneNumber schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "phoneNumber"
      //"pattern": "^(\\(\\+86\\))((13[0-9])|(15[^4,\\D])|(18[0,3,5-9]))\\d{8}$"
    }
  },
  "required": [
    "phoneNumber"
  ]
};


exports.forgotPassword = {
  "$schema": "http://json-schema.org/draft-04/schema#",
  "id": "http://jsonschema.net",
  "type": "object",
  "additionalProperties": true,
  "title": "Root schema.",
  "description": "An explanation about the puropose of this instance described by this schema.",
  "name": "/",
  "properties": {
    "captcha": {
      "id": "http://jsonschema.net/captcha",
      "type": "string",
      "title": "Captcha schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "captcha"
    },
    "password": {
      "id": "http://jsonschema.net/extra/Password",
      "type": "string",
      "title": "Password schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "password"
      //"pattern": "((?=.*\\d)(?=.*\\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,16}$"
    }
  },
  "required": [
    "password"
  ]
};