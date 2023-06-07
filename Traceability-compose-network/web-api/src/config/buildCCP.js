import appUtils from './AppUtils.js';

const getCCP = (org) => {
    let ccp;
    switch (org) {
        case 'org1':
            ccp = appUtils.buildCCPOrg1();
            break;
        case 'org2':
            ccp = appUtils.buildCCPOrg2();
            break;
        case 'org3':
            ccp = appUtils.buildCCPOrg3();
            break;
    }
    return ccp;
}

const getMongoDetails = (org) => {
    let mongoPort;
    let username;
    let password;
    let serviceName;

    switch(org) {
        case 'org1':
            mongoPort = 27018;
            username = "org1admin";
            password = "org1adminpassword";
            serviceName = "org1-mongodb";
            break;
        case 'org2':
            mongoPort = 27019;
            username = "org2admin";
            password = "org2adminpassword";
            serviceName = "org2-mongodb";
            break;
        case 'org3':
            mongoPort = 270110;
            username = "org3admin";
            password = "org3adminpassword";
            serviceName = "org3-mongodb";
            break;
    }
    return {mongoPort, username, password, serviceName};
}

export default {getCCP, getMongoDetails};