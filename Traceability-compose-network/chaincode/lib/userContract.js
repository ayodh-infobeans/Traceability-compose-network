
'use strict'

const { Contract } = require('fabric-contract-api');

class UserContract extends Contract{
    
    async registerUser(ctx, username, password, userType) {
        const exists = await this.userExists(ctx, username);
        if (exists) {
          throw new Error("The user ${username} already exists.");
        }
        const clientIdentity = new ClientIdentity(ctx.stub);
        if (clientIdentity.getMSPID() !== 'adminmsp') {
          throw new Error("Only admin users can register new users.");
        }
        const user = {
          username,
          password,
          userType
        };
        await ctx.stub.putState(username, Buffer.from(JSON.stringify(user)));
    }
    
    async loginUser(ctx, username, password) {
        const userBytes = await ctx.stub.getState(username);
        if (!userBytes || userBytes.length === 0) {
          throw new Error("The user ${username} does not exist.");
        }
        const user = JSON.parse(userBytes.toString());
        if (user.password !== password) {
          throw new Error("Incorrect password for user ${username}.");
        }
        const response = {
          username: user.username,
          userType: user.userType,
          token: 'JWT token' // Generate a JWT token here
        };
        return JSON.stringify(response);
    }
    
    async userExists(ctx, username) {
        const userBytes = await ctx.stub.getState(username);
        return userBytes && userBytes.length > 0;
    }
}

module.exports = UserContract;
