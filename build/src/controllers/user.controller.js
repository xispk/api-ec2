"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.meHandler = exports.resetPasswordHandler = exports.forgotPasswordHandler = exports.resendVerifyHandler = exports.verifyUserHandler = exports.createUserHandler = void 0;
var nanoid_1 = require("nanoid");
var user_services_1 = require("../services/user.services");
// controlador para criar usuarios
var createUserHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var input, user, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                input = req.body;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, user_services_1.userServices.create(input)];
            case 2:
                user = _a.sent();
                // envio de email contendo info para verificacao de conta
                user_services_1.userServices.sendVerificationInfo(user);
                // data sendo enviada apenas para testes
                res.status(201).json({
                    msg: 'Usuario criado com sucesso',
                    data: { id: user._id, verificationCode: user.verificationCode },
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                if (error_1.code === 11000) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ msg: 'Já existe um usuario com esse email' })];
                }
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.createUserHandler = createUserHandler;
// controlador para verificar email
var verifyUserHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, verificationCode, user, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id = _a.id, verificationCode = _a.verificationCode;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_services_1.userServices.findById(id)];
            case 2:
                user = _b.sent();
                // verifica se existe um usuario com o id informado
                if (!user) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ msg: 'Dados para verificacao de usuario incorretos' })];
                }
                // checa se o usuario ja esta verificado
                if (user.verified) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Usuario ja esta verificado' })];
                }
                // verifica se o codigo informado é o mesmo armazenado no banco de dados
                if (user.verificationCode !== verificationCode) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ msg: 'Não foi possivel verificar a conta' })];
                }
                // se tudo estiver correto
                user.verified = true;
                user.verificationCode = '';
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                res.status(200).json({ msg: 'Usuario verificado com sucesso' });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyUserHandler = verifyUserHandler;
// controlador para reenviar info para verificacao de email
var resendVerifyHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, msg, user, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                msg = 'Informações enviadas para o email informado';
                return [4 /*yield*/, user_services_1.userServices.findByEmail(email)];
            case 2:
                user = _a.sent();
                // verifica se existe um usuario com o email informado
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ msg: msg })];
                }
                // checa se o usuario ja esta verificado
                if (user.verified) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Usuario ja está verificado' })];
                }
                // envio de email contendo info para verificacao de conta
                user_services_1.userServices.sendVerificationInfo(user);
                // data sendo enviado apenas para testes
                res.status(200).json({
                    msg: msg,
                    data: { id: user._id, verificationCode: user.verificationCode },
                });
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.resendVerifyHandler = resendVerifyHandler;
// controlador para solicitar alteracao de senha
var forgotPasswordHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, msg, user, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                msg = 'Informações para alterar senha enviadas para o email informado';
                return [4 /*yield*/, user_services_1.userServices.findByEmail(email)];
            case 2:
                user = _a.sent();
                /// verifica se existe um usuario com o email informado
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ msg: msg })];
                }
                // checa se o usuario ja esta verificado
                if (!user.verified) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Usuario não está verificado' })];
                }
                // cria e adiciona o codigo de alteracao na conta
                user.resetPasswordCode = (0, nanoid_1.nanoid)();
                return [4 /*yield*/, user.save()];
            case 3:
                _a.sent();
                // data sendo enviada apenas para testes
                res.status(200).json({
                    msg: msg,
                    data: { id: user._id, resetPasswordCode: user.resetPasswordCode },
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.forgotPasswordHandler = forgotPasswordHandler;
// controlador para alterar senha
var resetPasswordHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, resetPasswordCode, password, user, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id = _a.id, resetPasswordCode = _a.resetPasswordCode;
                password = req.body.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                return [4 /*yield*/, user_services_1.userServices.findById(id)];
            case 2:
                user = _b.sent();
                // checa se existe um usuario com o id informado
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Não foi possivel alterar a senha' })];
                }
                // checa se o codigo é valido e se ele é o mesmo armazenado no db
                if (!user.resetPasswordCode ||
                    user.resetPasswordCode !== resetPasswordCode) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Não foi possivel alterar a senha' })];
                }
                // altera a senha do usuario
                user.password = password;
                user.resetPasswordCode = '';
                return [4 /*yield*/, user.save()];
            case 3:
                _b.sent();
                res.status(200).json({ msg: 'Senha alterada com sucesso' });
                return [3 /*break*/, 5];
            case 4:
                error_5 = _b.sent();
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPasswordHandler = resetPasswordHandler;
// controlador que envia o usuario atual conectado
var meHandler = function (_, res) {
    var user = res.locals.user;
    if (!user)
        return res.status(400).json({ msg: 'Acesso negado' });
    res.status(200).json({ msg: 'Usuario enviado com sucesso', data: user });
};
exports.meHandler = meHandler;
