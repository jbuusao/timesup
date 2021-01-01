const Responses = require('../common/responses');

exports.handler = async event => {
    console.log('event', event);

    return Responses._200({ message: 'default' });
};
