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

const generateResponsePayload = (error = null, status = null, code = null, data = null) =>{
  
  let errMessage;
  if(typeof error === 'string'){
    errMessage = error;
  }
  else{
    errMessage = error?.responses[0]?.response?.message;
  }
  
  return {
    message: errMessage,
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