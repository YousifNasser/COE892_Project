const fs = require('fs');
const Voting = artifacts.require("Voting");

module.exports = async function (deployer) {
    await deployer.deploy(Voting);
    const voting = await Voting.deployed();

    const contractData = {
        address: voting.address
    };

    fs.writeFileSync(
        "./public/contractAddress.json",
        JSON.stringify(contractData, null, 2)
    );
};