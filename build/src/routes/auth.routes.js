"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = require("../controllers/auth.controller");
var validateResources_1 = require("../middlewares/validateResources");
var auth_schema_1 = require("../schemas/auth.schema");
var router = express_1.default.Router();
// rota para fazer login
router.post('/api/auth/login', (0, validateResources_1.validateResouce)(auth_schema_1.createSessionSchema), auth_controller_1.createSessionHandler);
exports.default = router;
