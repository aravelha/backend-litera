const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[A-Za-z\s]+$/),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required()
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/),
});

function validateUser(req, res, next) {
  const { username, email, password } = req.body;

  const data = {
    username,
    email,
    password,
  };

  const { error } = userSchema.validate(data);

  if (error) {
    const details = error.details.map((detail) => detail.message).join(', ');
    return res
    .status(400)
    .json({success: false, message: `Data user tidak valid: ${details}`});
  }

  next();
}

module.exports = validateUser