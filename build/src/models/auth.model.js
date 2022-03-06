"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
// schema de usuario para acesso ao banco de dados
var sessionSchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    isValid: { type: Boolean, default: true },
}, {
    timestamps: true,
});
var SessionModel = mongoose_1.default.model('Session', sessionSchema);
exports.default = SessionModel;
