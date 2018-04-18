const UIStepRunner = require('app/core/runners/UIStepRunner');

module.exports = class WithLinkStepRunner extends UIStepRunner {

    handleGet(step, req, res) {
        if (req.session.validLink) {
            super.handleGet(step, req, res);
        } else {
            res.redirect('errors/404');
        }
    }
};
