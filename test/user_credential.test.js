"use strict";

var s = require('./support');
var t = s.t;

describe('UserCredential', function () {

    var sapp, userId;
    var User, UserIdentity, UserCredential;

    it('supports linked 3rd party accounts', function (done) {
        UserCredential.link(userId, 'facebook', 'oAuth 2.0',
            {emails: [
                {value: 'foo@bar.com'}
            ], id: 'f123', username: 'xyz'
            }, {accessToken: 'at1', refreshToken: 'rt1'}, function (err, cred) {
                t(!err, 'No error should be reported');

                t.equal(cred.externalId, 'f123');
                t.equal(cred.provider, 'facebook');
                t.equal(cred.authScheme, 'oAuth 2.0');
                t.deepEqual(cred.credentials, {accessToken: 'at1', refreshToken: 'rt1'});

                t.equal(userId, cred.userId);

                // Follow the belongsTo relation
                cred.user(function (err, user) {
                    t(!err, 'No error should be reported');
                    t.equal(user.username, 'facebook.abc');
                    t.equal(user.email, 'uuu@facebook.com');
                    done();
                });
            });
    });


    it('supports linked 3rd party accounts if exists', function (done) {
        UserCredential.create({
            externalId: 'f456',
            provider: 'facebook',
            userId: userId,
            credentials: {accessToken: 'at1', refreshToken: 'rt1'}
        }, function () {
            UserCredential.link(userId, 'facebook', 'oAuth 2.0',
                {emails: [
                    {value: 'abc1@facebook.com'}
                ], id: 'f456', username: 'xyz'
                }, {accessToken: 'at2', refreshToken: 'rt2'}, function (err, cred) {
                    t(!err, 'No error should be reported');

                    t.equal(cred.externalId, 'f456');
                    t.equal(cred.provider, 'facebook');
                    t.deepEqual(cred.credentials, {accessToken: 'at2', refreshToken: 'rt2'});

                    t.equal(userId, cred.userId);

                    // Follow the belongsTo relation
                    cred.user(function (err, user) {
                        t(!err, 'No error should be reported');
                        t.equal(user.username, 'facebook.abc');
                        t.equal(user.email, 'uuu@facebook.com');
                        done();
                    });
                });
        });
    });

    beforeEach(function (done) {
        sapp = s.sapp();
        sapp.boot(function (err) {
            User = sapp.model('User');
            UserIdentity = sapp.model('UserIdentity');
            UserCredential = sapp.model('UserCredential');
            done(err);
        });
    });

    beforeEach(function (done) {
        s.cleanup(sapp, done);
    });

    beforeEach(function (done) {
        User.create({
            username: 'facebook.abc',
            email: 'uuu@facebook.com',
            password: 'pass'
        }, function (err, user) {
            userId = user.id;
            done(err);
        });
    });

    afterEach(function (done) {
        s.cleanup(sapp, done);
    });

});