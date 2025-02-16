import { Router } from "express";
import {authController} from "../../../configs/compositions/auth.composition";

export const authRouter = Router();

authRouter.post('/login', authController.login);