import { config } from '../config.js';

export const isAdmin = (userId) => userId.toString() === config.adminUserId;