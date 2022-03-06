"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_routes_1 = __importDefault(require("./user.routes"));
var auth_routes_1 = __importDefault(require("./auth.routes"));
var router = express_1.default.Router();
// rota para verificar saude da api
router.get('/healthcheck', function (_, res) { return res.sendStatus(200); });
// rotas relacionadas a criacao e alteracao de info do usuario
router.use(user_routes_1.default);
// rotas relacionadas a autenticacao do usuario
router.use(auth_routes_1.default);
exports.default = router;
