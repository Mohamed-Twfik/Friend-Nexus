import { body } from 'express-validator';
import chatModel from '../models/chat.model';
import {
  mongoIdValidator,
} from './shared.validator';
import userModel from '../models/user.model';

const nameValidator = () => {
  return body('name')
    .trim()
    .isString()
    .isLength({ min: 2 })
    .withMessage('Name must be a string with at least 2 characters long')
    .escape();
};

const descriptionValidator = () => {
  return body('description')
    .optional()
    .trim()
    .isString()
    .isLength({ min: 10 })
    .withMessage('Description must be a string with at least 10 characters long')
    .escape();
};

export const chatIdValidator = () => {
  return mongoIdValidator('chat', chatModel)
};

export const createChatValidator = () => {
  return [
    nameValidator(),
    
    descriptionValidator(),
  ];
};

export const updateChatValidator = () => {
  return [
    chatIdValidator(),

    nameValidator().optional(),
    
    descriptionValidator(),
  ];
};

export const userIdAndChatIdValidator = () => {
  return [
    chatIdValidator(),

    mongoIdValidator('user', userModel),
  ];
};

