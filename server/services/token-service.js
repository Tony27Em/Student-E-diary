const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

const ACCESS_TOKEN_EXPIRATION_TIME = 60 * 60 * 1000 // 1h
const REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000 // 30days

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

    return {
      accessToken: {
        value: accessToken,
        expiresIn: Date.now() + ACCESS_TOKEN_EXPIRATION_TIME,
      },
      refreshToken: {
        value: refreshToken,
        expiresIn: Date.now() + REFRESH_TOKEN_EXPIRATION_TIME,
      },
    }
  }

  async saveToken(userID, refreshToken) {
    const tokenData = await tokenModel.findOne({ user: userID });

    if(tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const newToken = await tokenModel.create({ 
      user: userID, 
      refreshToken 
    });

    return newToken;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (e) {
      return null
    }
  }

  validateAccessToken(accessToken) {
    try {
      const userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (e) {
      return null
    }
  }

  async findToken(refreshToken) {
    const tokenData = await tokenModel.findOne({ refreshToken })
    return tokenData;
  }
}

module.exports = new TokenService();