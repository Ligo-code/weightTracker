import Joi from "joi";

export const validateUserRegistration = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(2).max(30).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    
    next();
};
