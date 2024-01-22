const path = require('path');
const {  } = require('express-validator');
const userService = require('../services/user-service');
const createMulter = require('../config/multer');

const REFRESH_TOKEN_EXPIRATION_TIME = 30 * 24 * 60 * 60 * 1000 // 30days

class UserController {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      const userData = await userService.login(username, password); 

      res.cookie('refresh_token', JSON.stringify({
        refresh_token: userData.tokens.refreshToken, 
        user: userData.user
      }), { 
        maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
        httpOnly: true,
        sameSite: 'None',
        secure: true
      });

      return res.json(userData);
    } catch(err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const refresh_token = req.cookies.refresh_token.value;
      const token = await userService.logout(refresh_token);
      res.clearCookie('refresh_token');

      return res.json(token);
    } catch(err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const refresh_token = JSON.parse(req.cookies.refresh_token).refresh_token.value;
      const userData = await userService.refresh(refresh_token);

      if(!userData) {
        return res.status(401).res.json('Unauthorized without refresh token')
      }
      
      return res.json(userData)
    } catch(err) {
      next(err)
    }
  }

  async getUserData(req, res, next) {
    try {
      const userID = JSON.parse(req.cookies.refresh_token).user.id;
      const userData = await userService.getUserData(userID);

      return res.json(userData);
    } catch(err) {
      next(err)
    }
  }  

  async changePersonalData(req, res, next) {
    try {
      const userID = JSON.parse(req.cookies.refresh_token).user.id;
      const data = req.body;

      const result = await userService.changePersonalData(userID, data);
      return res.status(200).json({ message: 'Данные успешно изменены' });
    } catch (err) {
      next(err);
    }
  }

  async changePassword(req, res, next) {
    try {
      const username = JSON.parse(req.cookies.refresh_token).user.username;
      const { oldPassword, newPassword } = req.body;
      const userData = await userService.changePassword(username, oldPassword, newPassword);

      res.cookie('refresh_token', JSON.stringify({
        refresh_token: userData.tokens.refreshToken, 
        user: userData.user
      }), { 
        maxAge: REFRESH_TOKEN_EXPIRATION_TIME,
        httpOnly: true,
      });

      return res.json(userData);
    } catch(err) {
      next(err);
    }
  }

  async changeAvatar(req, res, next) {
    const userID = JSON.parse(req.cookies.refresh_token).user.id;
    const filePath = path.join(__dirname, '../public/avatars');
    const upload = createMulter(filePath);
    const uploadMiddleware = upload.single('avatar');

    try {
      uploadMiddleware(req, res, async (err) => {
        if(err) {
          console.error(err);
          return res.status(500).send('Произошла ошибка при загрузке файла');
        }

        const extension = path.extname(req.file.originalname);

        await userService.changeAvatar(userID, extension);

        res.json({ message: 'Изображение загружено' });
      })
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();