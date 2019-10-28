/**
 * Token Sale Dataset Evaluation.
 */
let scheduler = require('../lib/token-sale-evaluation');

module.exports = {

  friendlyName: 'Dataset Evaluation',

  inputs: {
    file: {
      description: `sails run dataset-evaluaion --path='./dataset/path'`,
      type: 'string',
      defaultsTo: undefined
    }
  },

  fn: function (inputs, exits) {

    return scheduler
      .process(inputs.path)
      .then((message) => {
        return exits.success(message);
      })
      .catch((error) => {
        return exits.success(error);
      })
  }
};
