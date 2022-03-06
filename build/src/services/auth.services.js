"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionServices = void 0;
var auth_model_1 = __importDefault(require("../models/auth.model"));
var create = function (user) {
    return auth_model_1.default.create({ user: user._id });
};
var findById = function (id) {
    return auth_model_1.default.findById(id);
};
var deleteByUser = function (user) {
    return auth_model_1.default.deleteMany({ user: user._id });
};
exports.sessionServices = {
    create: create,
    findById: findById,
    deleteByUser: deleteByUser,
};
