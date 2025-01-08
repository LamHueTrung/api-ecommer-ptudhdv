const userMessages = require('./userMessages');
const productMessages = require('./productMessages');
const orderMessages = require('./orderMessages');
const paymentMessages = require('./paymentMessages');
const reviewMessages = require('./reviewMessages');
const cartMessages = require('./cartMessages');

module.exports = {
    user: userMessages,
    product: productMessages,
    order: orderMessages,
    payment: paymentMessages,
    review: reviewMessages,
    cart: cartMessages,
};
