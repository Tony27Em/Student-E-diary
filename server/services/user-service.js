const bcrypt = require('bcrypt');
const UserDTO = require('../dtos/user-dto');
const tokenService = require('./token-service');
const UserModel = require('../models/user-model');
const UserDataModel = require('../models/userData-model');
const GroupModel = require('../models/group-model');

class UserService {
  async registration(username, password) {
    const candidate = await UserModel.findOne({ username });

    if(candidate) {
      return 'Пользователь с таким именем уже существует';
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const newUser = await UserModel.create({ username, password: hashedPassword });
    const userDTO = new UserDTO(newUser);

    return { newUser: userDTO };
  }

  async login(username, password) {
    const user = await UserModel.findOne({ username });

    if(!user) {
      console.log('Пользователь с таким именем не существует');
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if(!isPasswordMatch) {
      console.log('Неверный пароль');
      return;
    }

    const userDTO = new UserDTO(user);
    const tokens = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveToken(userDTO.id, tokens.refreshToken.value);    

    return { 
      user: userDTO, 
      tokens,
    };
  }

  async logout(refreshToken) {
    const tokenData = await tokenService.removeToken(refreshToken);
    return tokenData;
  }

  async refresh(refreshToken) {
    if(!refreshToken) {
      throw new Error();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken(refreshToken);

    if(!userData || !tokenFromDB) {
      throw new Error();
    }

    const user = await UserModel.findById(userData.id);
    const userDTO = new UserDTO(user);
    const tokens = tokenService.generateTokens({ ...userDTO });

    return {
      user: userDTO,
      tokens,
    }
  }

  async getUserData(userID) {
    const userData = await UserDataModel.findOne({ userID });

    const groupID = userData.data.academic_info.groups[0].groupID;
    const groupData = await GroupModel.findById(groupID);

    const studentsData = await UserDataModel.aggregate([
      { $match: { userID: { $in: groupData.students_list } } },
      { $project: 
        { 
          'userID': 1,
          'data.personal_info.name': 1,
          'data.academic_info.stepcoins': 1,
        }
      },
    ]);
    
    const streamData = await UserDataModel.aggregate([
      { $project: 
        {
          'userID': 1,
          'data.personal_info.name': 1,
          'data.academic_info.stepcoins': 1,
        }
      }
    ])

    return { userData, groupData, studentsData, streamData };
  }

  async changePersonalData(userID, data) {
    console.log(data);

    const user = await UserDataModel.findOneAndUpdate(
      { userID },
      { $set: {
        'data.personal_info.social_media': data.social,
        'data.personal_info.name': data.about.name,
        'data.personal_info.email': data.about.email,
        'data.personal_info.phone_number': data.about.phone_number,
        'data.personal_info.birthdate': data.about.birthdate,
        'data.personal_info.address': data.about.address,
        'data.personal_info.education': data.about.education,
      } },
      { new: true }
    );
    return user.data;
  }

  async changePassword(username, oldPassword, newPassword) {   
    const user = await UserModel.findOne({ username }) 
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if(!isPasswordMatch) {
      console.log('Неправильный пароль');
      return
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 3);
    const updatedUser = await UserModel.findOneAndUpdate(
      { username },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    const userDTO = new UserDTO(updatedUser);
    const tokens = tokenService.generateTokens({ ...userDTO });
    await tokenService.saveToken(userDTO.id, tokens.refreshToken.value);  
    
    return { 
      user: userDTO, 
      tokens,
    };
  }

  async changeAvatar(userID, fileName) {
    return await UserDataModel.findOneAndUpdate(
      { userID },
      { $set: { 'data.personal_info.image': fileName } },
    )
  }
}

module.exports = new UserService();
