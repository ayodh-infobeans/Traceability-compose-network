'use strict'

const { Contract } = require('fabric-contract-api');

class UserContract extends Contract{
    
  async registerUser(ctx, userId, password){
    // Check if the user already exists in the world state
    const userExists = await this.userExists(ctx, userId);
    if (userExists) {
      throw new Error(`User ${userId} already exists`);
    }

    // Create a new user object
    const newUser = {
      userId,
      email,
      password
    };

    // Convert the user object to a buffer
    const userBuffer = Buffer.from(JSON.stringify(newUser));

    // Store the user object in the world state
    await ctx.stub.putState(userId, userBuffer);
  }

  async login(ctx, identity) {
    // Check if the identity exists in the world state
    const existingIdentity = await ctx.stub.getState(identity);
    if (!existingIdentity || existingIdentity.length === 0) {
      throw new Error(`Identity ${identity.label} not found`);
    }

    // Check if the identity matches the stored credentials
    const storedIdentity = JSON.parse(existingIdentity.toString());
    if (identity.privateKey !== storedIdentity.privateKey) {
      throw new Error(`Invalid credentials for identity ${identity.label}`);
    }

    // Generate a session token and store it in the world state
    const sessionToken = Math.random().toString(36).substring(2, 15);
    await ctx.stub.putState(sessionToken, Buffer.from(JSON.stringify(identity)));

    // Return the session token to the client
    return sessionToken;
  }

  async logout(ctx, sessionToken) {
    // Check if the session token exists in the world state
    const existingIdentity = await ctx.stub.getState(sessionToken);
    if (!existingIdentity || existingIdentity.length === 0) {
      throw new Error(`Session ${sessionToken} not found`);
    }

    // Delete the session token from the world state
    await ctx.stub.deleteState(sessionToken);
  }

  async userExists(ctx, userId) {
    const userBuffer = await ctx.stub.getState(userId);
    return userBuffer && userBuffer.length > 0;
  }
}

module.exports = UserContract;