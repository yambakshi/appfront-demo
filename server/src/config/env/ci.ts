export default {
    nodeEnv: process.env.NODE_ENV,
    apiPort: Number(process.env.API_PORT),
    cors: {
        origin: process.env.CORS_ORIGIN
    },
    mongodb: {
        uriPrefix: process.env.MONGODB_URI_PREFIX,
        username: process.env.MONGODB_USERNAME,
        password: process.env.MONGODB_PASSWORD,
        host: process.env.MONGODB_HOST,
        dbName: process.env.MONGODB_DB
    },
    jwt: {
        secret: 'yambakshiwillnevertell',
        issuer: 'yam-bakshi-music',
        audience: 'yam-bakshi-music',
        expiresIn: '86400000'
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    },
    googleStorage: {
        bucketName: process.env.BUCKET_NAME
    },
    spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    },
    deezer: {
        appId: process.env.DEEZER_APP_ID,
        secretKey: process.env.DEEZER_SECRET_KEY,
    },
    defaultPlatforms: {
        social: {
            tiktok: '6342947ef8aa8264e4d173dc',
            instagram: '6342947ef8aa8264e4d173d8',
            facebook: '6342947ef8aa8264e4d173d6'
        },
        streaming: {
            spotify: '6342947ef8aa8264e4d173db',
            appleMusic: '6342947ef8aa8264e4d173d3',
            deezer: '6342947ef8aa8264e4d173d5'
        }
    }
}