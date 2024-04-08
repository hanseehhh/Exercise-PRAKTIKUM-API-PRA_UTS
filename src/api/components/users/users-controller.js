const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    
    // CODE UNTUK MENGECEK APAKAH ADA EMAIL SAMA YANG SUDAH DIBENTUK OLEH USER SEBELUMNYA
    const checkmail = await usersService.CheckMail(email);
    if (!checkmail){
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email Already Used'
      );
    }

    // MEMBUAT HAL UNTUK MENGECEK KESAMAAN PASSWORD YANG DARIA AWAL SUDAH DIBENTUK
    const cpass = request.body.cpass;
    if (cpass !== password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password Tidak Sama'
      );
    }
  
    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;
    const checkmail = await usersService.CheckMail(email);

    const success = await usersService.updateUser(id, name, email);
    if (!checkmail){
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email Already Used'
      );
    }
    
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */

async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

async function changePass(request, response, next) {
  try {
    const id = request.params.id;
    const oldpass = request.body.oldpass;
    const newpass = request.body.newpass;
    const copass = request.body.copass;
    const changePass = await usersService.changePass(id, oldpass, newpass, copass);

    if (!changePass) {
      throw new Error('Something Error');
    }

    return response
      .status(200)
      .json({ message: 'Password Changed Successfully' });
    } 
    catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePass
};
