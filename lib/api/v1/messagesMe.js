/**
 * Created by song on 2015/7/2.
 */
var logger = require('../../mlogger/mlogger.js');
var mongoose = require('mongoose');
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var messageDbSchema = new mongoose.Schema({
    messageId: {type: String},
    userId: {type: String},
    message: {type: String},
    email: {type: String},
    timestamp: {type: String},
    isHandled: {type: Boolean}
});
var OPERATION_SCHEMAS = {
    post:{
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "description": {
                "type": "string"
            },
            "email": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "description",
            "email"
        ]
    }
};

function messagesMe(conx){
    var saveDb = function(message, callback) {
        var db = mongoose.createConnection(conx.configurator.getConf("meshblu_server.db_url"));
        db.once('error', function (error) {
            logger.error(204006, error);
            callback(error, null);
        });

        db.once('open', function () {
            var model = db.model('messages', messageDbSchema);
            var entity = new model(message);
            entity.save(function (error, result) {
                callback(error, result);
                db.close();
            });
        });

    };
    this.post = function (request, userId, token, callback) {
        conx.messageValidate(request.body, OPERATION_SCHEMAS.post, function (error) {
            var res = JSON.parse(JSON.stringify(result));
            if (error) {
                res.weiwiz.MHome.errorId = error.retCode;
                res.weiwiz.MHome.errorMsg = error.description;
                callback(res);
            }
            else {
                var message = {};
                message.messageId = uuid.v4();
                message.message = request.body.description;
                message.email = request.body.email;
                message.userId = userId;
                message.timestamp = new Date().toISOString();
                message.isHandled = false;
                saveDb(message, function (error) {
                    if (error === null) {
                        res.weiwiz.MHome.errorId = 200;
                        res.weiwiz.MHome.response.messageId = message.messageId;
                    }
                    callback(res);
                })
            }
        });
    }
}

module.exports = messagesMe;
