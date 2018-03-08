/**
 * Created by jacky on 2015/10/19.
 */
/**
 * Created by jacky on 2015/10/19.
 */
'use strict';
var mongoose = require('mongoose');
var configurator = require('../../../../config.json');
var logger = require('../../../mlogger/mlogger');

// Create a sequence
function Sequence(name) {
  var SequenceSchema = new mongoose.Schema({
    nextSeqNumber: {type: Number, default: 1}
  });
  mongoose.connect(configurator.meshblu_server.db_url);
  var sequenceModel;
  var created = false;
  sequenceModel = mongoose.model(name + 'Seq', SequenceSchema);
  return {
    next: function (callback) {
      sequenceModel.find(function (err, data) {
        if (err) {
          logger.error(200000, err);
        }
        if (data.length < 1) {
          created = true;
          // create if doesn't exist create and return first
          sequenceModel.create({}, function (err, seq) {
            if (err) {
              logger.error(200000, err);
            }
            callback(seq.nextSeqNumber);
          });
        } else {
          // update sequence and return next
          sequenceModel.findByIdAndUpdate(data[0]._id, {$inc: {nextSeqNumber: 1}}, function (err, seq) {
            if (err) {
              throw(err);
            }
            callback(seq.nextSeqNumber);
          });
        }
      });
    }
  };
}

module.exports = {
  Sequence: Sequence
};