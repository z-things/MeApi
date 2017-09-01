/**
 * Created by CXJ on 2016/5/14.
 */
var result = require('./model/http-client-response.json');
var logger = require('../../mlogger/mlogger.js');
var mongoose = require('mongoose');


var smartDataSchema = new mongoose.Schema({
    type: {type: "string"},
    uuid: {type: "string"},
    timestamp: {type: "string"},
    event: {type: "object"},
    current: {type: "object"},
    action: {type: "object"},
    status: {type: "number"}
});


function SmartData(conx) {
    this.conx = conx
}

SmartData.prototype.put = function (request, userId, token, callback) {
    var self = this;
    var res = JSON.parse(JSON.stringify(result));
    var db = mongoose.createConnection(self.conx.configurator.getConf("meshblu_server.db_url"));
    db.once('error', function (error) {
        res.flag = false;
        callback(res);
    });
    db.once('open', function () {
        var uuidArray = [];
        var seqArray = [];

        logger.debug(request);
        logger.debug(request.body);
        try{
            if (request.body && request.body.uuids) {
                uuidArray = JSON.parse(JSON.stringify(request.body)).uuids;
            }
        }catch (err) {
            logger.error(200000,{error:err,"body":request.body});
            res.flag = false;
            callback(res);
            return;
        }


        var querySort = {'event.seq': -1};
        var connectionName = "mhome_smart_data";

        if (!uuidArray) {
            res.flag = false;
            callback(res);
            return;
        }

        if (uuidArray === undefined ||uuidArray.length <1) {
            res.flag = false;
            callback(res);
            return;
        }

        var queryCondition = {
            'uuid': {'$in': uuidArray},
            'status': 0
        };

        db.collection(connectionName).find(queryCondition).sort(querySort).limit(uuidArray.length).toArray(function (error, result) {
            if (error) {
                logger.error(200000,error);
                res.flag = false;
                callback(res);
            }
            else {
                for (var i = 0; i < result.length; i++) {
                    seqArray.push(result[i]._id);
                }

                if(seqArray.length>0)
                {
                    var updateCondition = {
                        '_id': {'$in': seqArray}
                    }
                    db.collection(connectionName).update(updateCondition, {'$set': {'status': 1}}, {}, function (error) {
                        if (error) {
                            logger.error(200000,error);
                            res.flag = false;
                            callback(res);
                        } else {
                            res.flag = true;
                            res.errorId = 200;
                            res.response = result;
                            db.close();
                            callback(res);
                        }
                    })
                }else
                {
                    res.flag = true;
                    callback(res);
                }

            }
        });
    });
};
SmartData.prototype.get = function (request, userId, token, uuid,callback) {
    var res = JSON.parse(JSON.stringify(result));
    var db = mongoose.createConnection(self.conx.configurator.getConf("meshblu_server.db_url"));

    db.once('error', function (error) {
        logger.error(200000,error);
        res.flag = false;
        callback(res);
    });
    db.once('open', function () {
        var querySort = {'event.seq': -1};
        var connectionNameSmart = "mhome_smart_data";
        var connectionNameCal = "mhome_cal_data";
        var seq = "";
        var seqArray = [];
        db.collection(connectionNameCal).find({'uuid':uuid}).toArray(function (error, result) {
            if (error) {
                logger.error(200000, error);
                res.flag = false;
                callback(res);
            } else {
                if(result.length >0)
                {
                    seq = result[0].seq;
                    var queryCondition = {
                        'event.seq': seq,
                        'status': 0
                    };

                    db.collection(connectionNameSmart).find(queryCondition).sort(querySort).toArray(function (error, result) {
                        if (error) {
                            logger.error(200000, error);
                            res.flag = false;
                            callback(res);
                        }
                        else {

                            for (var i = 0; i < result.length; i++) {
                                seqArray.push(result[i]._id);
                            }

                            if (seqArray.length > 0) {
                                var updateCondition = {
                                    '_id': {'$in': seqArray}
                                }
                                db.collection(connectionNameSmart).update(updateCondition, {'$set': {'status': 1}}, {}, function (error) {
                                    if (error) {
                                        logger.error(200000, error);
                                        res.flag = false;
                                        callback(res);
                                    } else {
                                        res.flag = true;
                                        res.errorId = 200;
                                        res.response = result;
                                        db.close();
                                        callback(res);
                                    }
                                })
                            } else {
                                res.flag = true;
                                res.errorId = 200;
                                callback(res);
                            }

                        }
                    });
                }else
                {
                    res.flag = true;
                    res.errorId = 200;
                    callback(res);
                }
            }
        });

    });
};
module.exports = SmartData;