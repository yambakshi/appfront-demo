import { logger } from "../.."

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9;
    const NS_TO_MS = 1e6;
    const diff = process.hrtime(start);

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
}

export function requestTimerMiddleware(req, res, next) {
    logger.info({ message: `${req.method} '${req.originalUrl}' [STARTED]`, label: 'requestTimerMiddleware' });
    const start = process.hrtime();

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        logger.info({ message: `${req.method} '${req.originalUrl}' [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`, label: 'requestTimerMiddleware' });
    })

    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start);
        logger.info({ message: `${req.method} '${req.originalUrl}' [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`, label: 'requestTimerMiddleware' });
    })

    next()
}