"use strict";

var s = require('./support');
var t = s.t;

describe('ApplicationCredential', function () {

    var sapp, appId;
    var Application, ApplicationCredential;

    it('supports linked 3rd party accounts', function (done) {
        ApplicationCredential.link(appId, 'facebook', 'oAuth 2.0', {
                clientID: 'facebook-client-id-1',
                clientSecret: 'facebook-client-secret-1',
                callbackURL: 'http://localhost:3000/auth/facebook/callback'},
            function (err, cred) {
                t(!err, 'No error should be reported');

                t.equal(cred.provider, 'facebook');
                t.equal(cred.authScheme, 'oAuth 2.0');
                t.deepEqual(cred.credentials, {
                    clientID: 'facebook-client-id-1',
                    clientSecret: 'facebook-client-secret-1',
                    callbackURL: 'http://localhost:3000/auth/facebook/callback'});

                t.equal(appId, cred.appId);

                // Follow the belongsTo relation
                cred.application(function (err, app) {
                    t(!err, 'No error should be reported');
                    t.equal(app.name, 'MyApp');
                    done();
                });
            });
    });

    it('supports linked 3rd party accounts if exists', function (done) {
        ApplicationCredential.create({
            provider: 'facebook',
            authScheme: 'oAuth 2.0',
            appId: appId,
            credentials: {
                clientID: 'facebook-client-id-1',
                clientSecret: 'facebook-client-secret-1',
                callbackURL: 'http://localhost:3000/auth/facebook/callback'}
        }, function () {
            ApplicationCredential.link(appId, 'facebook', 'oAuth 2.0', {
                clientID: 'facebook-client-id-1',
                clientSecret: 'facebook-client-secret-2',
                callbackURL: 'http://localhost:3000/auth/facebook/callback'}, function (err, cred) {
                t(!err, 'No error should be reported');

                t.equal(cred.provider, 'facebook');
                t.equal(cred.authScheme, 'oAuth 2.0');
                t.deepEqual(cred.credentials, {
                    clientID: 'facebook-client-id-1',
                    clientSecret: 'facebook-client-secret-2',
                    callbackURL: 'http://localhost:3000/auth/facebook/callback'});

                t.equal(appId, cred.appId);
                // Follow the belongsTo relation
                cred.application(function (err, app) {
                    t(!err, 'No error should be reported');
                    t.equal(app.name, 'MyApp');
                    t.equal(app.id, appId);
                    done();
                });
            });
        });
    });

    beforeEach(function (done) {
        sapp = s.sapp();
        sapp.boot(function (err) {
            Application = sapp.model('Application');
            ApplicationCredential = sapp.model('ApplicationCredential');
            done(err);
        });
    });

    beforeEach(function (done) {
        s.cleanup(sapp, done);
    });

    beforeEach(function (done) {
        Application.create({
            name: 'MyApp'
        }, function (err, app) {
            appId = app.id;
            done(err);
        });
    });

    afterEach(function (done) {
        s.cleanup(sapp, done);
    });

});