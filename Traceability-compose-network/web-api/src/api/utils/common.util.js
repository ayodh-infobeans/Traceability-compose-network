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

const generateResponsePayload = (message = null, status = null, code = null, data = null) =>{
  return {
    message: message,
    status: status,
    code: code,
    data: data
  }
}

export default {
    getOrgNameFromMSP,
    generateUniqueIdentity,
    generateResponsePayload
}