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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByEmailService = exports.loginUserService = exports.registerUserService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userDataAccess_1 = require("../data_access/userDataAccess");
const SECRET_KEY = process.env.JWT_SECRET || 'secret_key';
const registerUserService = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    // Hashea la contraseña antes de guardarla
    const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
    return yield (0, userDataAccess_1.createUserInDB)(Object.assign(Object.assign({}, userData), { password: hashedPassword }));
});
exports.registerUserService = registerUserService;
const loginUserService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, userDataAccess_1.getUserByEmailFromDB)(email);
    if (!user || !(yield bcryptjs_1.default.compare(password, user.password))) {
        throw new Error('Invalid credentials');
    }
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role
    }, SECRET_KEY, { expiresIn: '1h' });
});
exports.loginUserService = loginUserService;
const getUserByEmailService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, userDataAccess_1.getUserByEmailFromDB)(email);
});
exports.getUserByEmailService = getUserByEmailService;
