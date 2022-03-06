"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateResouce = void 0;
// valida os recursos vindo atraves do request baseado nos esquemas
var validateResouce = function (schema) {
    return function (req, res, next) {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            var msg = error.issues.map(function (issue) {
                return { path: issue.path[1], message: issue.message };
            });
            res.status(400).json({ msg: msg });
        }
    };
};
exports.validateResouce = validateResouce;
