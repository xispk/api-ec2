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
exports.createSessionHandler = void 0;
var auth_services_1 = require("../services/auth.services");
var user_services_1 = require("../services/user.services");
var jwt_1 = require("../utils/jwt");
var createSessionHandler = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, password, email, user, isPasswordValid, session, tokenUser, accessToken, refreshToken, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, password = _a.password, email = _a.email;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, , 8]);
                return [4 /*yield*/, user_services_1.userServices.findByEmail(email).select('+password')];
            case 2:
                user = _b.sent();
                // checa se existe um usuario com o email informado
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Email ou senha invalido' })];
                }
                // checa se a conta ja foi verificada
                if (!user.verified) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Usuario não é verificado' })];
                }
                return [4 /*yield*/, user.comparePasswords(password)];
            case 3:
                isPasswordValid = _b.sent();
                if (!isPasswordValid) {
                    return [2 /*return*/, res.status(400).json({ msg: 'Email ou senha invalido' })];
                }
                // deleta todas as sessoes anteriores do usuario
                return [4 /*yield*/, auth_services_1.sessionServices.deleteByUser(user)];
            case 4:
                // deleta todas as sessoes anteriores do usuario
                _b.sent();
                return [4 /*yield*/, auth_services_1.sessionServices.create(user)];
            case 5:
                session = _b.sent();
                return [4 /*yield*/, user_services_1.userServices.findByEmail(email)];
            case 6:
                tokenUser = _b.sent();
                accessToken = jwt_1.jwtServices.sign(tokenUser, 'access_token_private_key', 'access_token_sign_options');
                refreshToken = jwt_1.jwtServices.sign(session, 'refresh_token_private_key', 'refresh_token_sign_options');
                // gera cookies contendo os tokens criados
                res.cookie('accessToken', accessToken, {
                    maxAge: 900000,
                    httpOnly: true,
                    domain: 'localhost',
                    path: '/',
                    sameSite: 'strict',
                    secure: false,
                });
                res.cookie('refreshToken', refreshToken, {
                    maxAge: 3.154e10,
                    httpOnly: true,
                    domain: 'localhost',
                    path: '/',
                    sameSite: 'strict',
                    secure: false,
                });
                // enviando tokens para o caso da ui fazer uso dos tokens para localstorage
                res.status(200).json({
                    msg: 'Login efetuado com sucesso',
                    data: { accessToken: accessToken, refreshToken: refreshToken },
                });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _b.sent();
                res.status(500).json({ msg: 'Erro de servidor' });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.createSessionHandler = createSessionHandler;
