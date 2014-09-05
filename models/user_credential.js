"use strict";

/**
 * Tracks thrid-party credentials for linked accounts.
 *
 * @param {String} provider The auth provider name, such as facebook, google, twitter, linkedin
 * @param {String} authScheme The auth scheme, such as oAuth, oAuth 2.0, OpenID, OpenID Connect
 * @param {String} externalId The provider-specific user ID.
 * @param {Object} profile The user profile, see http://passportjs.org/guide/profile
 * @param {Object} credentials Credentials.  Actual properties depend on the auth scheme being used:
 *
 * - For oAuth: token, tokenSecret
 * - For oAuth 2.0: accessToken, refreshToken
 * - For OpenID: openId
 * - For OpenID: Connect: accessToken, refreshToken, profile
 * @param {*} userId: The Ollo user ID.
 * @param {Date} created: The created date
 * @param {Date} modified: The last modified date
 */
module.exports = function (UserCredential, sapp) {


    /**
     * Link a third party account to a Ollo user
     * @param {String} provider The provider name
     * @param {String} authScheme The authentication scheme
     * @param {Object} profile The profile
     * @param {Object} credentials The credentials
     * @param {Object} [options] The options
     * @callback {Function} cb The callback function
     * @param {Error|String} err The error object or string
     * @param {Object} [credential] The user credential object
     */
    UserCredential.link = function (userId, provider, authScheme, profile, credentials, options, cb) {
        options = options || {};
        if (typeof options === 'function' && cb === undefined) {
            cb = options;
            options = {};
        }
        UserCredential.findOne({where: {
            userId: userId,
            provider: provider,
            externalId: profile.id
        }}, function (err, extCredential) {
            if (err) {
                return cb(err);
            }

            var date = new Date();
            if (extCredential) {
                // Find the user for the given extCredential
                extCredential.credentials = credentials;
                return extCredential.updateAttributes({profile: profile,
                    credentials: credentials, modified: date}, cb);
            }

            // Create the linked account
            UserCredential.create({
                provider: provider,
                externalId: profile.id,
                authScheme: authScheme,
                profile: profile,
                credentials: credentials,
                userId: userId,
                created: date,
                modified: date
            }, function (err, i) {
                cb(err, i);
            });

        });
    }
};