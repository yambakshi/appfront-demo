function addFilesPaths(bodyEntry: {}, fieldname: string, fileLoad: { file: { name: string, size: number }, path: string }) {
    const [key, remainder] = fieldname.split(/\.(.+)/);
    if (remainder) {
        if (bodyEntry[key] === undefined) {
            const nextKey = remainder.split(/\.(.+)/)[0];
            bodyEntry[key] = nextKey.match(/^\d+$/) ? [] : {};
        }

        addFilesPaths(bodyEntry[key], remainder, fileLoad);
    } else {
        bodyEntry[key] = { ...bodyEntry[key], ...fileLoad };
    }
}

export function uploadFormatterMiddleware(req, res, next) {
    const body = req.body;
    if (req.files && req.files.length) {
        req.files.forEach(({ fieldname, path, originalname, size }) =>
            addFilesPaths(body, fieldname, { file: { name: originalname, size }, path }));
    }

    next();
}