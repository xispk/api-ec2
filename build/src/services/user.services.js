"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = exports.sendVerificationInfo = exports.findByEmail = void 0;
var user_model_1 = __importDefault(require("../models/user.model"));
var config_1 = __importDefault(require("config"));
var sendMail_1 = __importDefault(require("../utils/sendMail"));
var create = function (input) {
    var newUser = user_model_1.default.create(input);
    return newUser;
};
var findById = function (id) {
    var user = user_model_1.default.findById(id);
    return user;
};
var findByEmail = function (email) {
    var user = user_model_1.default.findOne({ email: email });
    return user;
};
exports.findByEmail = findByEmail;
var sendVerificationInfo = function (user) {
    var port = config_1.default.get('port');
    var host = config_1.default.get('host');
    (0, sendMail_1.default)({
        from: config_1.default.get('senderMail'),
        to: user.email,
        subject: 'Verificação de email - API test ec2-aws',
        text: "".concat(host, ":").concat(port, "/api/users/verify/").concat(user._id, "/").concat(user.verificationCode),
    });
};
exports.sendVerificationInfo = sendVerificationInfo;
exports.userServices = {
    create: create,
    findById: findById,
    findByEmail: exports.findByEmail,
    sendVerificationInfo: exports.sendVerificationInfo,
};
