'use strict';

const ServiceMapper = require('app/utils/ServiceMapper.cjs');
const config = require('config');

const documentDownload = (req, res, service, filename) => {
    const commonContent = require(`app/resources/${req.session.language}/translation/common`);
    const downloadService = ServiceMapper.map(
        service,
        [config.services.orchestrator.url, req.sessionID]
    );
    downloadService
        .post(req)
        .then(result => {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-disposition', `attachment; filename=${filename}`);
            res.send(result);
        })
        .catch(err => {
            req.log.error(err);
            res.status(500).render('errors/error', {common: commonContent, error: '500', userLoggedIn: req.userLoggedIn});
        });
};

module.exports = documentDownload;
