import { TypeNames } from './database.js';

export type ValidSuperTypeKey<S, N extends TypeNames<S>> = keyof Omit<S, N>;
