// Importing the MemoryToken artifact
const MemoryToken = artifacts.require("MemoryToken");

module.exports = function(deployer) {
    // We deploy MemoryToken contract after importing its' artifact above
    deployer.deploy(MemoryToken);

};
