require('dotenv').config();
const express = require("express");
const connectToDatabase = require("./db/db");
const app = express();
const port = process.env.PORT || 8080;
const cookieParser = require("cookie-parser");
const productsRouter = require("./router/Products");
const brandRouter = require("./router/Brands");
const categoryRouter = require("./router/Categories");
const userRouter = require("./router/Users");
const authRouter = require("./router/Auth");
const cartRouter = require("./router/Cart");
const orderRouter = require("./router/Order");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
var session = require("express-session");
var passport = require("passport");
const cors = require("cors");
const User = require("./model/User");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const jwt = require("jsonwebtoken");
var opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET_KEY;
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);
const path = require('path');
const Order = require('./model/Order');


// Stripe Webhook

const endpointSecret = process.env.ENDPOINT_SECRET;

app.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async(request, response) => {
        const sig = request.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'payment_intent.succeeded':
                const paymentIntentSucceeded = event.data.object;
                const order_id = paymentIntentSucceeded.metadata.order_id;
                const order = await Order.findById(order_id);
                order.paymentStatus = "received";
                await order.save();
                console.log('PaymentIntent was successful!');
                break;
                // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
    }
);

//middleware
app.use(express.json());
app.use(
    cors({
        exposedHeaders: ["X-Total-Count"],
    })
);
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'build')));

app.use(
    session({
        secret: process.env.SESSION_KEY,
        resave: false, // don't save session if unmodified
        saveUninitialized: false, // don't create session until something stored
    })
);

app.use(passport.authenticate("session"));
//database connection
connectToDatabase().catch((error) => console.error(error));

//routes
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/products", isAuth(), productsRouter);
app.use("/brands", isAuth(), brandRouter);
app.use("/categories", isAuth(), categoryRouter);
app.use("/users", isAuth(), userRouter);
app.use("/auth", authRouter);
app.use("/cart", isAuth(), cartRouter);
app.use("/orders", isAuth(), orderRouter);
app.get('*', (req, res) =>
    res.sendFile(path.resolve('build', 'index.html'))
);

//Passport Strategies

passport.use("local",
    new LocalStrategy({
        usernameField: "email"
    }, async function(email, password, done) {
        try {
            const user = await User.findOne({ email: email });
            if (!user) {
                return done(null, false, { message: "Invalid Credentials" });
            } else {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    console.log("user in local", user);
                    const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET_KEY);
                    return done(null, { id: user.id, role: user.role, token });
                } else {
                    return done(null, false, { message: "Invalid Credentials" });
                }
            }
        } catch (err) {
            return done(err);
        }
    })
);

//Passport JWT Strategy

passport.use("jwt",
    new JwtStrategy(opts, async function(jwt_payload, done) {
        try {
            // console.log("jwt_payload", jwt_payload);
            const user = await User.findById(jwt_payload.id);
            if (user) {
                return done(null, sanitizeUser(user));
            } else {
                return done(null, false);
            }
        } catch (error) {
            return done(error, false);
        }
    })
);

//Passport Serialization
passport.serializeUser(function(user, cb) {
    console.log("user in serialize", user);
    process.nextTick(function() {
        return cb(null, {
            id: user.id,
            role: user.role,
        });
    });
});

//Passport Deserialization
passport.deserializeUser(function(user, cb) {
    console.log("user in deserialize", user);
    process.nextTick(function() {
        return cb(null, user);
    });
});

// Payment gateway integration

app.post("/create-payment-intent", async(req, res) => {
    const { totalAmount, order_id } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100,
        currency: "cad",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
        metadata: {
            order_id
        }
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});





app.listen(port, () => console.log(`Example app listening on port ${port}!`));