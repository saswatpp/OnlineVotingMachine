var LastVoted = artifacts.require("LastVoted");
module.exports = deployer => {
    deployer.deploy(LastVoted);
};