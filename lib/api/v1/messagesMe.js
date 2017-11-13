/**
 * Created by song on 2015/7/2.
 */
var logger = require('../../mlogger/mlogger.js');
var mongoose = require('mongoose');
var result = require('./model/http-client-response.json');
var uuid = require('node-uuid');
var Sequence = require('./util/sequence').Sequence;
var sequence = new Sequence("message");
var messageDbSchema = new mongoose.Schema({
    index: {type: Number},
    type: {type: String},
    name: {type: String},
    messageId: {type: String},
    userId: {type: String},
    message: {type: String},
    email: {type: String},
    timestamp: {type: String},
    isHandled: {type: Boolean}
});
messageDbSchema.pre('save', function (next) {
    var doc = this;
    // get the next sequence
    sequence.next(function (nextSeq) {
        logger.debug("nextSeq = " + nextSeq);
        doc.index = nextSeq;
        next();
    });
});
var OPERATION_SCHEMAS = {
    post: {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "properties": {
            "type": {
                "type": "string"
            },
            "name": {
                "type": "string"
            },
            "description": {
                "type": "string"
            },
            "email": {
                "type": "string"
            }
        },
        "additionalProperties": false,
        "required": [
            "type",
            "name",
            "description",
            "email"
        ]
    }
};

function messagesMe(conx) {
    var saveToDb = function (message, callback) {
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
    var getFromDb = function (userId, callback) {
        var db = mongoose.createConnection(conx.configurator.getConf("meshblu_server.db_url"));
        db.once('error', function (error) {
            logger.error(204006, error);
            callback({errorId: 204006, errorMsg: JSON.stringify(error)});
        });

        db.once('open', function () {
            var model = db.model('messages', messageDbSchema);
            var queryCondition = {userId: userId, isHandled: false};
            logger.debug(queryCondition);
            var query = model.find(queryCondition).sort({index: "desc"});
            query.exec(function (error, result) {
                if (error) {
                   callback({errorId: 212000, errorMsg: JSON.stringify(error)});
                }
                else{
                    var retData = [];
                    for (var i1 = 0, len1 = result.length; i1 < len1; ++i1) {
                        retData.push(JSON.parse(JSON.stringify(result[i1]._doc)));
                    }
                    callback(null, retData);
                }
            });
        });

    };
    this.get = function (request, userId, token, callback) {
        var res = JSON.parse(JSON.stringify(result));
        getFromDb(userId, function (error, result) {
            if (!error) {
                res.weiwiz.MHome.errorId = error.errorId;
                res.weiwiz.MHome.errorMsg = error.errorMsg;
            }
            else {
                res.weiwiz.MHome.errorId = 200;
                res.weiwiz.MHome.errorMsg = "success";
                res.weiwiz.MHome.response = result;
            }
            callback(res);
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
                message.type = request.body.type;
                message.name = request.body.name;
                message.message = request.body.description;
                message.email = request.body.email;
                message.userId = userId;
                message.timestamp = new Date().toISOString();
                message.isHandled = false;
                saveToDb(message, function (error) {
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
