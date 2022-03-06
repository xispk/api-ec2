"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = require("../controllers/user.controller");
var validateResources_1 = require("../middlewares/validateResources");
var user_schema_1 = require("../schemas/user.schema");
var router = express_1.default.Router();
// rota para criar usuarios
router.post('/api/users', (0, validateResources_1.validateResouce)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
// rota para verificacao de email
router.get('/api/users/verify/:id/:verificationCode', (0, validateResources_1.validateResouce)(user_schema_1.verifyUserSchema), user_controller_1.verifyUserHandler);
// rota para reenviar info para verificacao de email
router.post('/api/users/resendverify', (0, validateResources_1.validateResouce)(user_schema_1.resendVerifySchema), user_controller_1.resendVerifyHandler);
// rota para solicitar alteracao de senha
router.post('/api/users/forgotpassword', (0, validateResources_1.validateResouce)(user_schema_1.forgotPasswordSchema), user_controller_1.forgotPasswordHandler);
// rota para alterar senha
router.post('/api/users/resetpassword/:id/:resetPasswordCode', (0, validateResources_1.validateResouce)(user_schema_1.resetPasswordSchema), user_controller_1.resetPasswordHandler);
router.get('/api/users/me', user_controller_1.meHandler);
exports.default = router;
