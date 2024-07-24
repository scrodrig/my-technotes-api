import express, { Request, Response } from 'express';
const router = express.Router();
const path = require('path');

router.get('^/$|/index(.html)?', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

module.exports = router;
