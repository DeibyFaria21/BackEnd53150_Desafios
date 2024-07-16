import { fileURLToPath } from 'url'
import { dirname } from 'path'

import bcrypt from "bcrypt"


export const __dirname = dirname(fileURLToPath(import.meta.url));


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};