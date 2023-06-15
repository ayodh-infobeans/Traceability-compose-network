import crypto from 'crypto';

const getOrgNameFromMSP = (OrgMSP) =>{
    const substringToRemove = 'MSP';
    const newOrg = OrgMSP.substring(0, OrgMSP.indexOf(substringToRemove));  
    const org = newOrg.substr(0, 1).toLowerCase() + newOrg.substr(1);
    return org;
}

const generateUniqueIdentity = (username) =>{
  const hash = crypto.createHash('sha256');
  const uniqueIdentity = hash.update(username).digest('hex');
  return uniqueIdentity;
}

const generateResponsePayload = (result = null, errorName = null, errorData = null) =>{
  return {
    result: result,
    error: errorName,
    errorData: errorData
  }
}

export default {
    getOrgNameFromMSP,
    generateUniqueIdentity,
    generateResponsePayload
}