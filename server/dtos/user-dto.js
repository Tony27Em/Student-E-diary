module.exports = class UserDTO {
  id;
  username;

  constructor(model) {
    this.id = model._id;
    this.username = model.username;
  }
}