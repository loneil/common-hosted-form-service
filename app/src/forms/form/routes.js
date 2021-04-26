const config = require('config');
const routes = require('express').Router();
var jwt = require('jsonwebtoken');

const currentUser = require('../auth/middleware/userAccess').currentUser;
const hasFormPermissions = require('../auth/middleware/userAccess').hasFormPermissions;
const P = require('../common/constants').Permissions;

const keycloak = require('../../components/keycloak');
const controller = require('./controller');

routes.get('/', keycloak.protect(`${config.get('server.keycloak.clientId')}:admin`), currentUser, async (req, res, next) => {
  await controller.listForms(req, res, next);
});

routes.post('/', currentUser, async (req, res, next) => {
  await controller.createForm(req, res, next);
});

routes.get('/:formId', currentUser, hasFormPermissions(P.FORM_READ), async (req, res, next) => {
  await controller.readForm(req, res, next);
});

routes.get('/:formId/export', currentUser, hasFormPermissions([P.FORM_READ, P.SUBMISSION_READ]), async (req, res, next) => {
  await controller.export(req, res, next);
});

routes.get('/:formId/version', currentUser, hasFormPermissions(P.FORM_READ), async (req, res, next) => {
  await controller.readPublishedForm(req, res, next);
});

routes.put('/:formId', currentUser, hasFormPermissions([P.FORM_READ, P.FORM_UPDATE]), async (req, res, next) => {
  await controller.updateForm(req, res, next);
});

routes.delete('/:formId', currentUser, hasFormPermissions([P.FORM_READ, P.FORM_DELETE]), async (req, res, next) => {
  await controller.deleteForm(req, res, next);
});

routes.get('/:formId/submissions', currentUser, hasFormPermissions([P.FORM_READ, P.SUBMISSION_READ]), async (req, res, next) => {
  await controller.listFormSubmissions(req, res, next);
});

routes.get('/:formId/submissions/dashboard', currentUser, hasFormPermissions([P.FORM_READ, P.SUBMISSION_READ]), async (req, res, next) => {
  var METABASE_SITE_URL = 'https://chefs-metabase.apps.silver.devops.gov.bc.ca';
  var METABASE_SECRET_KEY = 'generated secret';

  var payload = {
    resource: { question: 9 },
    params: { formId, dateRange, etc },
    exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
  };
  var token = jwt.sign(payload, METABASE_SECRET_KEY);
  // construct the URL of the iframe to be displayed
  const iframeUrl = `${METABASE_SITE_URL}/embed/question/${token}`;
  // return iframe url here to FE, render iframe client side
});

routes.get('/:formId/versions', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_READ]), async (req, res, next) => {
  await controller.listVersions(req, res, next);
});

// routes.post('/:formId/versions', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
//   next(new Problem(410, { detail: 'This method is deprecated, use /forms/id/drafts to create form versions.' }));
// });

routes.get('/:formId/versions/:formVersionId', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
  await controller.readVersion(req, res, next);
});

// routes.put('/:formId/versions/:formVersionId', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
//   next(new Problem(410, { detail: 'This method is deprecated, use /forms/id/drafts to modify form versions.' }));
// });

routes.post('/:formId/versions/:formVersionId/publish', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_CREATE]), async (req, res, next) => {
  await controller.publishVersion(req, res, next);
});

routes.get('/:formId/versions/:formVersionId/submissions', currentUser, hasFormPermissions([P.FORM_READ, P.SUBMISSION_READ]), async (req, res, next) => {
  await controller.listSubmissions(req, res, next);
});

routes.post('/:formId/versions/:formVersionId/submissions', currentUser, hasFormPermissions([P.FORM_READ, P.SUBMISSION_CREATE]), async (req, res, next) => {
  await controller.createSubmission(req, res, next);
});

// routes.get('/:formId/versions/:formVersionId/submissions/:formSubmissionId', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
//   next(new Problem(410, { detail: 'This method is deprecated, use /submissions to read a submission.' }));
// });

// routes.put('/:formId/versions/:formVersionId/submissions/:formSubmissionId', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
//   next(new Problem(410, { detail: 'This method is deprecated, use /submissions to modify a submission.' }));
// });

routes.get('/:formId/drafts', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_READ]), async (req, res, next) => {
  await controller.listDrafts(req, res, next);
});

routes.post('/:formId/drafts', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_CREATE]), async (req, res, next) => {
  await controller.createDraft(req, res, next);
});

routes.get('/:formId/drafts/:formVersionDraftId', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_READ]), async (req, res, next) => {
  await controller.readDraft(req, res, next);
});

routes.put('/:formId/drafts/:formVersionDraftId', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_UPDATE]), async (req, res, next) => {
  await controller.updateDraft(req, res, next);
});

routes.delete('/:formId/drafts/:formVersionDraftId', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_DELETE]), async (req, res, next) => {
  await controller.deleteDraft(req, res, next);
});

routes.post('/:formId/drafts/:formVersionDraftId/publish', currentUser, hasFormPermissions([P.FORM_READ, P.DESIGN_CREATE]), async (req, res, next) => {
  await controller.publishDraft(req, res, next);
});

routes.get('/:formId/statusCodes', currentUser, hasFormPermissions([P.FORM_READ]), async (req, res, next) => {
  await controller.getStatusCodes(req, res, next);
});

module.exports = routes;
