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

export default {getCCP};