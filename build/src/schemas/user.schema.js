"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.resendVerifySchema = exports.verifyUserSchema = exports.createUserSchema = void 0;
var zod_1 = require("zod");
// schema para validacao do input para criar usuario
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email é obrigatório',
        }).email('Email invalido'),
        firstName: (0, zod_1.string)({
            required_error: 'FirstName é obrigatório',
        }),
        lastName: (0, zod_1.string)({
            required_error: 'LastName é obrigatório',
        }),
        password: (0, zod_1.string)({
            required_error: 'Password é obrigatório',
        }).min(6, 'Password muito curto - deve ser no min 6 chars'),
        passwordRepeat: (0, zod_1.string)({
            required_error: 'PasswordRepeat é obrigatório',
        }),
    }).refine(function (data) { return data.password === data.passwordRepeat; }, {
        message: 'Passwords devem ser iguais',
        path: ['passwordRepeat'],
    }),
});
// schema para verificacao de email
exports.verifyUserSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)(),
        verificationCode: (0, zod_1.string)(),
    }),
});
// schema para reenviar info para verificacao de email
exports.resendVerifySchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email é obrigatório',
        }),
    }),
});
// schema para solicitar mudanca de senha
exports.forgotPasswordSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: 'Email é obrigatório',
        }),
    }),
});
// schema para alterar senha
exports.resetPasswordSchema = (0, zod_1.object)({
    params: (0, zod_1.object)({
        id: (0, zod_1.string)(),
        resetPasswordCode: (0, zod_1.string)(),
    }),
    body: (0, zod_1.object)({
        password: (0, zod_1.string)({
            required_error: 'Password é obrigatório',
        }).min(6, 'Password muito curto - deve ser no min 6 chars'),
        passwordRepeat: (0, zod_1.string)({
            required_error: 'PasswordRepeat é obrigatório',
        }),
    }).refine(function (data) { return data.password === data.passwordRepeat; }, {
        message: 'Passwords devem ser iguais',
        path: ['passwordRepeat'],
    }),
});
