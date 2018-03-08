/**
 * Created by song on 2015/7/20.
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
    "oneOf": [
      {
        "id": "http://jsonschema.net/phoneNumber",
        "type": "string",
        "title": "PhoneNumber schema.",
        "description": "An explanation about the puropose of this instance described by this schema.",
        "name": "phoneNumber"
      },
      {
        "id": "http://jsonschema.net/email",
        "type": "string",
        "title": "Email schema.",
        "description": "An explanation about the puropose of this instance described by this schema.",
        "name": "email"
      },
      {
        "id": "http://jsonschema.net/name",
        "type": "string",
        "title": "Name schema.",
        "description": "An explanation about the puropose of this instance described by this schema.",
        "name": "name"
      }
    ],
    "password": {
      "id": "http://jsonschema.net/password",
      "type": "string",
      "title": "Password schema.",
      "description": "An explanation about the puropose of this instance described by this schema.",
      "name": "password"
    }
  },
  "required": [
    "password"
  ]
};