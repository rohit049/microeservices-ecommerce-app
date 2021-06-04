import { addHours } from "date-fns";

import { User, UserSession } from "#root/db/models";
import generateUUID from "#root/helpers/generateUUID";
import hashPassword from "#root/helpers/hashPassword";
import passwordCompareSync from "#root/helpers/passwordCompareSync";

const USER_SESSION_EXPIRY_HOURS = 1;

const setupRoutes = (app) => {
  app.post("/sessions", async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return next(new Error("Invalid Body!"));
    }

    try {
      const user = await User.findOne({
        attributes: {},
        where: { email: req.body.email },
      });

      if (!user) {
        return next(new Error("Invalid Email!"));
      }

      if (!passwordCompareSync(req.body.password, user.passwordHash)) {
        return next(new Error("Incorrect Password!"));
      }

      const sessionId = generateUUID();
      const expiresAt = addHours(new Date(), USER_SESSION_EXPIRY_HOURS);

      const userSession = await UserSession.create({
        expiresAt,
        id: sessionId,
        userId: user.id,
      });

      return res.status(200).json(userSession);
    } catch (e) {
      return next(e);
    }
  });

  app.delete("/sessions/:sessionId", async (req, res, next) => {
    try {
      const userSession = await UserSession.findByPk(req.params.sessionId);
      if (!userSession) return next(new Error("Invalid Session ID!"));
      await userSession.destroy();
      res.end();
    } catch (e) {
      return next(e);
    }
  });

  app.get("/sessions/:sessionId", async (req, res, next) => {
    try {
      const userSession = await UserSession.findByPk(req.params.sessionId);

      if (!userSession) return next(new Error("Invalid Session ID!"));
      return res.status(200).json(userSession);
    } catch (e) {
      return next(e);
    }
  });

  app.post("/users", async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
      return next(new Error("Invalid Body!"));
    }
    try {
      const newUser = await User.create({
        email: req.body.email,
        id: generateUUID(),
        passwordHash: hashPassword(req.body.password),
      });

      return res.status(200).json(newUser);
    } catch (error) {
      return next(error);
    }
  });

  app.get("/users", async (req, res, next) => {
    try {
      const users = await User.findAll();
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  });

  app.get("/users/:userId", async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.userId);

      if (!user) {
        return next(new Error("Invalid User ID!"));
      }
      return res.status(200).json(user);
    } catch (err) {
      return next(err);
    }
  });
};

export default setupRoutes;
