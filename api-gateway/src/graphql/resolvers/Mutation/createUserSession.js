import UsersService from "#root/adapters/UsersService";

const createUserSessionResolver = async (obj, { email, password }, context) => {
  const userSession = await UsersService.createUserSession({
    email,
    password,
  });

  context.res.cookie("userSessionId", userSession.id, {
    httpOnly: true,
  });
  // (async (context) => {
  //   console.log(await context.res.locals.userSession);
  // })(context);
  return userSession;
};

export default createUserSessionResolver;
