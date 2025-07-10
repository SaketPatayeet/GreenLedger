const GreenLedger = artifacts.require("GreenLedger");

module.exports = function(deployer) {
  deployer.deploy(GreenLedger);
};
