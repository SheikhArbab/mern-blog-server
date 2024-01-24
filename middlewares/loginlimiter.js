import ratelimit from 'express-rate-limit';


export const limiter = ratelimit({
    windowMs : 5 * 60 * 1000, // 5minutes
    max: 5, //login attempts pe 5 mins
    standardHeaders: true, // return rate limit info in the `rate limit-*` headers
    legacyHeaders: false, //disable the `X-rate limit-*` headers
})