import Joi from "joi";

export const validateUserRegistration = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    goal: Joi.string().valid("lose", "gain").required(),
    initialWeight: Joi.number().min(1).max(1000).required(),
    targetWeight: Joi.number().min(1).max(1000).required(),
    currentWeight: Joi.number().min(0).max(1000).optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};

export const validateWeightEntry = (req, res, next) => {
  const schema = Joi.object({
    weight: Joi.number().min(0.1).max(1000).required(),
    note: Joi.string().max(500).optional().allow(""),
    date: Joi.date().optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  next();
};
