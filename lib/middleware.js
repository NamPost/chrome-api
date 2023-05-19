import database from "../models/index.js"

export async function privateRoute(req, res, next) {
    // no headers set
    if (typeof req.headers == "undefined" || typeof req.headers['authorization'] == "undefined") {
        res.status(401);
        return res.json({
            success: false,
            message: 'Authorization credentials not provided'
        })
    }

    const key = await database.apiKeys.findOne({ 
        where: { key: req.headers['authorization'] },
        attributes: ['key']
    });

    if(!key){
        res.status(401);
        return res.json({
            success: false,
            message: 'Invalid API key'
        })
    }

    next()
}