import joi from "joi";

export const validateUserRegistration = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().min(2).max(30).required(),
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}