const Step = require('app/core/steps/Step');

module.exports = class StopPage extends Step {

    static getUrl(reason = '*') {
        return `/stop-page/${reason}`;
    }

    getContextData(req) {
        const ctx = super.getContextData(req);
        ctx.stopReason = req.params[0];

        const formdata = req.session.form;
        const templateContent = this.generateContent(ctx, formdata)[ctx.stopReason];

        if (templateContent) {
            const linkPlaceholders = templateContent.match(/{[^}]+}/g);
            if (linkPlaceholders) {
                ctx.linkPlaceholders = linkPlaceholders.map((placeholder) => {
                    return placeholder.substr(1, placeholder.length - 2);
                });
            } else {
                ctx.linkPlaceholders = [];
            }
        }

        return ctx;
    }

    * handleGet(ctx, formdata) {
        [ctx] = yield super.handleGet(ctx, formdata);
        return [ctx, {}];
    }

    action(ctx, formdata) {
        super.action(ctx, formdata);
        delete ctx.linkPlaceholders;

        return [ctx, formdata];
    }
};
