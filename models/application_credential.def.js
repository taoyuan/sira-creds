"use strict";


/*!
 * Default ApplicationCredential properties.
 */
module.exports = function (t) {
    return {
        properties: {
            provider: {type: String, index: true}, // facebook, google, twitter, linkedIn
            authScheme: {type: String}, // oAuth, oAuth 2.0, OpenID, OpenID Connect
            credentials: t.JSON,
            // appId: String, // To be injected by belongsTo relation
            created: {type: Date, default: function () {
                return new Date;
            }},
            modified: {type: Date},
            appId: {type: String, index: true}
        },
        relations: {
            application: {
                type: 'belongsTo',
                model: 'Application',
                foreignKey: 'appId'

            }
        }
    }
};