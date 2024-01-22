const Router = require('express');
const { body } = require('express-validator');

const authMiddleware = require('../middlewares/authMiddleware');
const userController = require('../controllers/userController');
const commonDataController = require('../controllers/commonDataController');
const shopController = require('../controllers/shopController');
const fileManagerController = require('../controllers/fileManagercontroller');
const libraryController = require('../controllers/libraryController');

const router = new Router();

// USER CONTROLLER (AUTH AND USER DATA)
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.get('/getUserData', authMiddleware, userController.getUserData);
router.post('/changePersonalData', authMiddleware, userController.changePersonalData);
router.post('/changePassword', authMiddleware, userController.changePassword);
router.post('/changeAvatar', authMiddleware, userController.changeAvatar);

// COMMON DATA CONTROLLER
router.get('/getRewardsList', commonDataController.getRewardsList);
router.get('/getFaqData', commonDataController.getFaqData);
router.get('/getNewsData', authMiddleware, commonDataController.getNewsData);

// SHOP CONTROLLER
router.get('/getShopData', authMiddleware, shopController.getShopData);
router.post('/addToCart', authMiddleware, shopController.addToCart);
router.post('/removeFromCart', authMiddleware, shopController.removeFromCart);
router.get('/getCart', authMiddleware, shopController.getCart);
router.post('/order', authMiddleware, shopController.makeOrder);

// DATA LOADER CONTROLLER
  // STUDENT (TASKS, HOMEWORKS)
router.get('/downloadTask/:filename', authMiddleware, fileManagerController.downloadTask);
router.post('/uploadHomework', authMiddleware, fileManagerController.uploadHomework);

  // TEACHER (TASKS, HOMEWORKS)
router.get('/downloadHomework', authMiddleware, fileManagerController.downloadHomework);
router.post('/uploadTask', authMiddleware, fileManagerController.uploadTask);

  // LIBRARY
router.get('/getLibrary', libraryController.getLibrary);
router.get('/downloadPractical/:filename', libraryController.downloadPractical);



module.exports = router;