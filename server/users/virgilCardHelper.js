const virgil = require('virgil-sdk');
const boom = require('boom');
const config = require('../utils/config');

module.exports = makeVirgilHelper();

function makeVirgilHelper() {
	const appKey = resolveAppKey();
	const client = resolveClient();
    const signer = resolveSigner(appKey);

	return {
		publish(csr) {
			const cardRequest = resolveCardRequest(csr);
			if (!cardRequest) {
				throw boom.badRequest('Virgil card request format is invalid.');
			}

			signer.signRequest(cardRequest);
			return client.publishCard(cardRequest)
				.catch(handleVirgilCardsError);
		},

		revoke(cardId) {
			const revokeRequest = virgil.revokeCardRequest({ card_id: cardId });
			signer.signRequest(revokeRequest);
			return client.revokeCard(revokeRequest)
				.catch(handleVirgilCardsError);
		}
	};
}

function resolveAppKey() {
	try {
		return virgil.crypto.importPrivateKey(
			config().VIRGIL_APP_PRIVATE_KEY,
			config().VIRGIL_APP_PRIVATE_KEY_PASSWORD
		);
	} catch (e) {
		console.error('Failed to import app private key', e);
		throw e;
	}
}

function resolveClient() {
	if (!config().VIRGIL_APP_ACCESS_TOKEN) {
		throw new Error('Bad Configuration: VIRGIL_APP_ACCESS_TOKEN parameter is missing.');
	}
	return virgil.client(config().VIRGIL_APP_ACCESS_TOKEN);
}

function resolveSigner(appKey) {
	const VIRGIL_APP_CARD_ID = config().VIRGIL_APP_CARD_ID;
	if (!VIRGIL_APP_CARD_ID) {
		throw new Error('Bad Configuration: VIRGIL_APP_CARD_ID parameter is missing.');
	}

	const signer = virgil.requestSigner(virgil.crypto);

	return {
		signRequest(request) {
			return signer.authoritySign(request, VIRGIL_APP_CARD_ID, appKey);
		}
	};
}

function resolveCardRequest(csr) {
	try {
		return virgil.publishCardRequest.import(csr);
	} catch (e) {
		return null;
	}
}

function handleVirgilCardsError(err) {
	console.error('Request to Virgil Cards failed: ', err);
	if (err.code) {
		// Error returned by Virgil Cards service
		// assume something's wrong with request params
		throw boom.badRequest(err.message);
	}

	throw boom.serverUnavailable('Unexpected error from Virgil Cards Service.');
}