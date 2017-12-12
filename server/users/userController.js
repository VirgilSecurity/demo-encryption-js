const boom = require('boom');
const joi = require('joi');
const dal = require('./userDal');
const virgilCards = require('./virgilCardHelper');

const userSchema = joi.object().keys({
	username: joi.string().alphanum().min(3).max(30).required(),
	csr: joi.string().required()
});

module.exports = {
	create(params) {
		return Promise.resolve()
			.then(() => {
				const result = joi.validate(params, userSchema);
				if (result.error) {
					throw boom.badRequest(result.error.details[0].message);
				}

				const { username, csr } = params;
				return dal.exists(username)
					.then(exists => {
						if (exists) {
							throw boom.badRequest('User with the same name already exists');
						}
					})
					.then(() => virgilCards.publish(csr))
					.then(virgilCard => dal.create({
						username,
						virgilCardId: virgilCard.id
					}));
			});
	},

	list(query = '') {
		return dal.queryByName(query);
	}
};