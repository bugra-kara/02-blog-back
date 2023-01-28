const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { StatusCodes } = require('http-status-codes')
const { attachCookiesToResponse, createTokenUser} = require('../utils');
const createHash = require('../utils/createHash')
const queries = require('../db/queries')
const comparePassword = require('../utils/comparePassword')

const register = async (req, res) => {
  const {email, password, username, first_name, last_name, role, slug} = req.body
  if (!email, !password, !username) {
    res.json({result: "failed", msg: "Fill the all inputs!"})
  }
  else {
    try {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password, salt);
      const postRegister = await queries(`INSERT INTO users (username, first_name, last_name, email, password, role, slug) VALUES ('${username}', '${first_name}', '${last_name}', '${email}', '${newPassword}', '${role}', '${slug}')`)
      if(postRegister.severity === 'ERROR') {
        res.json({result: "failed", error:postRegister.detail})
      }
      else {
        res.json({result: "success"})
      }
    } catch (error) {
      res.json({result: "failed", error:error})
    }
  }
}

const login = async (req, res) => {
  const {email, password} = req.body
  if (!email || !password) {
    res.json({result: "failed", msg: "Please provide email and password!"})
  }
  else {
    const user = await queries(`SELECT * FROM users WHERE email = '${email}' `)
    const isPasswordCorrect = await comparePassword(password, user.rows[0].password)
    if(!isPasswordCorrect){
      res.json({result: "failed", msg: "Wrong password!"})
    }
    else {
      const tokenUser = createTokenUser(user);
      // create refresh token
      let refreshToken = '';
      // check for existing token
      const existingToken = await queries(`SELECT * FROM token WHERE token_user = '${user.rows[0].id}'`)
      if (existingToken?.rows[0] !== undefined && existingToken?.rows !== []) {
        const { isvalid } = existingToken.rows[0];
        if (!isvalid) {
          res.json({result: "failed", msg: "Invalid Credentials"})
        }
        refreshToken = existingToken.rows[0].refreshToken;
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.json({result: "success", data: {username: user.rows[0].username, role: user.rows[0].role, id: user.rows[0].id}});
        return;
      }
      else {
        refreshToken = crypto.randomBytes(40).toString('hex');
        const useragent = req.headers['user-agent'];
        const ip = req.ip;
        await queries(`INSERT INTO token (refresh_token, ip, isValid, token_user, user_agent) VALUES ('${refreshToken}', '${ip}', '${true}', '${user.rows[0].id}', '${useragent}')`)
        attachCookiesToResponse({ res, user: tokenUser, refreshToken });
        res.json({result: "success", data: {username: user.rows[0].username, role: user.rows[0].role, id: user.rows[0].id}});
      }
    }
  }
}

const logout = async (req, res) => {
  res.cookie('accessToken', 'logout', {
      httpOnly: false,
      expires: new Date(Date.now()),
    });
  res.cookie('refreshToken', 'logout', {
      httpOnly: false,
      expires: new Date(Date.now()),
    });
  res.status(StatusCodes.OK).json({result: "success"});
}

const verifyEmail = async (req, res) => {
  const {token, email} = req.query
  const user = await User.find({email: email})
  if(user[0].isVerified){
    res.status(100).json({result: "failed", msg: "Already verified!"})
  }
  if(!user) {
    res.status(100).json({result: "failed", msg: "Wrong email!"})
  }
  if(!(user[0].verificationToken === token)){
    res.status(100).json({result: "failed", msg: "Wrong token!"})
  }
  await User.updateMany(
    {
      email: user[0].email
    },
    {
      isVerified : true,
      verified : Date.now(),
      verificationToken : ''
    }
  )
  res.status(StatusCodes.ACCEPTED).json({result: "success"})
}

const resetPassword = async (req, res) => {
  const {token, email } = req.query
  const { password } = req.body

  if (!token || !email || !password) {
    res.status(100).json({result: "failed", msg: "Please provide all values!"})
  }
  const user = await User.find({email: email})
  if (user) {
    const currentDate = new Date();
    if (
      user[0].passwordToken === createHash(token) &&
      user[0].passwordTokenExpirationDate > currentDate
    ) {
      user[0].password = password
      user[0].passwordToken = null
      user[0].passwordTokenExpirationDate = null
      await user[0].save()
    }
  }
  res.status(StatusCodes.ACCEPTED).json({result: "success"})
}

const forgotPassword = async (req, res) => {
  const {email} =  req.body
  if (!email) {
    res.status(100).json({result: "failed", msg: "Please provide valid email!"})
  }
  const user = await User.find({email: email})
  if (user) {
    const passwordToken = crypto.randomBytes(70).toString('hex');
    // send email
    const origin = 'http://localhost:3000';
    await sendResetPasswordEmail({
      username: user[0].username,
      email: user[0].email,
      token: passwordToken,
      origin,
    });
    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    const hashPassword = createHash(passwordToken)
    await User.updateMany(
      {
        email:user[0].email
      },
      {
      passwordToken : hashPassword,
      passwordTokenExpirationDate : passwordTokenExpirationDate
      }
    )
  }
  res
    .status(StatusCodes.OK)
    .json({ result: "success" });
}

module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword
}