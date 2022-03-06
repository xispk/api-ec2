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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtServices = exports.reIssueAccessToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var config_1 = __importDefault(require("config"));
var logger_1 = __importDefault(require("./logger"));
var auth_services_1 = require("../services/auth.services");
var user_services_1 = require("../services/user.services");
// assina um novo json web token
var sign = function (payload, keyName, optionsName) {
    var privateKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
    var signOptions = config_1.default.get(optionsName);
    try {
        return jsonwebtoken_1.default.sign({ payload: payload }, privateKey, signOptions);
    }
    catch (error) {
        logger_1.default.error(error);
    }
};
// verifica se o token é valido
var verify = function (token, keyName) {
    var publicKey = Buffer.from(config_1.default.get(keyName), 'base64').toString('ascii');
    try {
        var decoded = jsonwebtoken_1.default.verify(token, publicKey);
        return {
            valid: true,
            expired: false,
            decoded: decoded,
        };
    }
    catch (error) {
        logger_1.default.error(error.message);
        // se houver um erro e o erro for de expiracao
        return {
            valid: false,
            expired: error.message === 'jwt expired',
            decoded: null,
        };
    }
};
var reIssueAccessToken = function (refreshToken) { return __awaiter(void 0, void 0, void 0, function () {
    var decoded, session, user, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                decoded = verify(refreshToken, 'refresh_token_public_key').decoded;
                if (!decoded)
                    return [2 /*return*/, false];
                return [4 /*yield*/, auth_services_1.sessionServices.findById(decoded._id)];
            case 1:
                session = _a.sent();
                if (!session || !session.isValid)
                    return [2 /*return*/, false];
                return [4 /*yield*/, user_services_1.userServices.findById(String(session.user))];
            case 2:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, false];
                accessToken = sign(user, 'access_token_private_key', 'access_token_sign_options');
                return [2 /*return*/, accessToken];
        }
    });
}); };
exports.reIssueAccessToken = reIssueAccessToken;
exports.jwtServices = {
    sign: sign,
    verify: verify,
    reIssueAccessToken: exports.reIssueAccessToken,
};
