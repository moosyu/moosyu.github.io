module.exports = {
  target: process.env.DEPLOY_TARGET || "local",
  isGithub: process.env.DEPLOY_TARGET === "github",
  isNekoweb: process.env.DEPLOY_TARGET === "nekoweb",
};