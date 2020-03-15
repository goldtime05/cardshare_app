const functions = require('firebase-functions');

const ProxyAgent = require('https-proxy-agent');
const stripe = require('stripe')('sk_test_CIlQLWqJmuSmDFQoQwvDYZAp');

const admin = require('firebase-admin');
const cors = require('cors')({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
});
admin.initializeApp(functions.config().firebase);

// app.use(cors({origin: true}));

exports.payWithStripe = functions.https.onRequest((request, response) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys

    response.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    response.setHeader('Access-Control-Allow-Credentials', true);

    // let body;
    // if (typeof (request.body) === 'string') {
    //     body = JSON.parse(request.body);
    // } else {
    //     body = request.body;
    // }
    // eslint-disable-next-line promise/catch-or-return

    console.log("==== charge ==== : ", request)

    cors(request, response, () => {

        stripe.charges.create({
            amount: request.body.amount,
            currency: request.body.currency,
            source: request.body.token,
        }).then((charge) => {
            // asynchronously called
            res.set('Access-Control-Allow-Origin', '*');
            console.log("==== charge ==== : ", charge)
            return response.send(charge);
        })
            .catch(err => {
                console.log(err);
            });
    })
});