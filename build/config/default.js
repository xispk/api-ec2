"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: 1337,
    host: 'http://localhost',
    dbUrl: '',
    senderMail: 'test@example.com',
    access_token_sign_options: { expiresIn: '15m', algorithm: 'RS256' },
    refresh_token_sign_options: { expiresIn: '1y', algorithm: 'RS256' },
    smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'iuryferreiralol@gmail.com',
            pass: 'jznlzsmquwiyrjeu',
        },
    },
};
