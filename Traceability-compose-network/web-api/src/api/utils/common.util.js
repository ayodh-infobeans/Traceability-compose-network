import crypto from 'crypto';

const getOrgNameFromMSP = (OrgMSP) =>{
    let substringToRemove = 'MSP';
    let newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
    let org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1);

    return org;
}

const generateUniqueIdentity = (username) =>{
  const hash = crypto.createHash('sha256');
  const uniqueIdentity = hash.update(username).digest('hex');
  return uniqueIdentity;
}

export default{
    getOrgNameFromMSP,
    generateUniqueIdentity
}