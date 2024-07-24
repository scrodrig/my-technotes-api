import { NextFunction, Request, Response } from 'express';

const { logEvents } = require('./logger');

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    logEvents(
        `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
        'errorLog.log',
    );
    console.log(err.stack);

    const status = res.statusCode ? res.statusCode : 500;

    res.status(status);

    res.json({ message: err.message, isError: true });
};

module.exports = errorHandler;
