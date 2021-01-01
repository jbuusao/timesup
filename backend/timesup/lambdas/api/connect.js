const Responses = require('../common/responses');
const { withHooks } = require('../common/hooks')

const handler = async (event) => {

    return Responses._200();
};

exports.handler = withHooks(handler)
