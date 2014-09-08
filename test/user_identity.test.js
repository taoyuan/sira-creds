"use strict";

var s = require('./support');
var t = s.t;

describe('UserIdentity', function () {

    var sapp;
    var User, UserIdentity, UserCredential;

    it('supports 3rd party login', function (done) {
        UserIdentity.login('facebook', 'oAuth 2.0',
            {emails: [
                {value: 'foo@bar.com'}
            ], id: 'f123', username: 'xyz'
            }, {accessToken: 'at1', refreshToken: 'rt1'},
            {autoLogin: false},
            function (err, user, identity, token) {
                t(!err, 'No error should be reported');
                t.equal(user.username, 'facebook.xyz');
                t.equal(user.email, 'foo@bar.com');

                t.equal(identity.externalId, 'f123');
                t.equal(identity.provider, 'facebook');
                t.equal(identity.authScheme, 'oAuth 2.0');
                t.deepEqual(identity.credentials, {accessToken: 'at1', refreshToken: 'rt1'});

                t.equal(user.id, identity.userId);
                t(!token);

                // Follow the belongsTo relation
                identity.user(function (err, user) {
                    t(!err, 'No error should be reported');
                    t.equal(user.username, 'facebook.xyz');
                    t.equal(user.email, 'foo@bar.com');
                    done();
                });
            });
    });

    it('supports 3rd party login if the identity already exists', function (done) {
        User.create({
            username: 'facebook.abc',
            email: 'abc@facebook.com',
            password: 'pass'
        }, function (err, user) {
            UserIdentity.create({
                externalId: 'f456',
                provider: 'facebook',
                userId: user.id,
                authScheme: 'oAuth 2.0'
            }, function () {
                UserIdentity.login('facebook', 'oAuth 2.0',
                    {emails: [
                        {value: 'abc1@facebook.com'}
                    ], id: 'f456', username: 'xyz'
                    }, {accessToken: 'at2', refreshToken: 'rt2'}, function (err, user, identity, token) {
                        t(!err, 'No error should be reported');
                        t.equal(user.username, 'facebook.abc');
                        t.equal(user.email, 'abc@facebook.com');

                        t.equal(identity.externalId, 'f456');
                        t.equal(identity.provider, 'facebook');
                        t.equal(identity.authScheme, 'oAuth 2.0');
                        t.deepEqual(identity.credentials, {accessToken: 'at2', refreshToken: 'rt2'});

                        t.equal(user.id, identity.userId);

                        t.isNotNull(token);

                        // Follow the belongsTo relation
                        identity.user(function (err, user) {
                            t(!err, 'No error should be reported');
                            t.equal(user.username, 'facebook.abc');
                            t.equal(user.email, 'abc@facebook.com');
                            done();
                        });
                    });
            });
        });
    });

    it('supports 3rd party login if user account already exists', function (done) {
        User.create({
            username: 'facebook.789',
            email: '789@facebook.com',
            password: 'pass'
        }, function () {
            UserIdentity.login('facebook', 'oAuth 2.0',
                {emails: [
                    {value: '789@facebook.com'}
                ], id: 'f789', username: 'ttt'
                }, {accessToken: 'at3', refreshToken: 'rt3'}, function (err, user, identity, token) {
                    t(!err, 'No error should be reported');
                    t.equal(user.username, 'facebook.789');
                    t.equal(user.email, '789@facebook.com');

                    t.equal(identity.externalId, 'f789');
                    t.equal(identity.provider, 'facebook');
                    t.equal(identity.authScheme, 'oAuth 2.0');
                    t.deepEqual(identity.credentials, {accessToken: 'at3', refreshToken: 'rt3'});

                    t.equal(user.id, identity.userId);
                    t.isNotNull(token);

                    // Follow the belongsTo relation
                    identity.user(function (err, user) {
                        t(!err, 'No error should be reported');
                        t.equal(user.username, 'facebook.789');
                        t.equal(user.email, '789@facebook.com');
                        done();
                    });
                });
        });
    });

    it('supports 3rd party login with profileToUser option', function (done) {
        UserIdentity.login('facebook', 'oAuth 2.0',
            {emails: [
                {value: 'foo@baz.com'}
            ], id: 'f100', username: 'joy'
            }, {accessToken: 'at1', refreshToken: 'rt1'}, {
                profileToUser: function (provider, profile) {
                    return {
                        username: profile.username + '@facebook',
                        email: profile.emails[0].value,
                        password: 'sss'
                    };
                }}, function (err, user, identity, token) {
                t(!err, 'No error should be reported');
                t.equal(user.username, 'joy@facebook');
                t.equal(user.email, 'foo@baz.com');

                t.equal(identity.externalId, 'f100');
                t.equal(identity.provider, 'facebook');
                t.equal(identity.authScheme, 'oAuth 2.0');
                t.deepEqual(identity.credentials, {accessToken: 'at1', refreshToken: 'rt1'});

                t.equal(user.id, identity.userId);
                t.isNotNull(token);

                // Follow the belongsTo relation
                identity.user(function (err, user) {
                    t(!err, 'No error should be reported');
                    t.equal(user.username, 'joy@facebook');
                    t.equal(user.email, 'foo@baz.com');
                    done();
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


    afterEach(function (done) {
        s.cleanup(sapp, done);
    });

});