export const SETTINGS = {
    PORT: process.env.PORT || 3003,
    DB_NAME: 'blogs-platform',
    DB_URL: process.env.DB_URL || 'mongodb+srv://admin:admin@lessons.x4ym2.mongodb.net/?retryWrites=true&w=majority&appName=lessons',
    SALT_ROUNDS: 10,
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

    EMAIL: {
        SMTP: {
            HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
            PORT: Number(process.env.SMTP_PORT) || 587,
            SECURE: process.env.SMTP_SECURE === 'true',
            USER: process.env.SMTP_USER || 'your-email@gmail.com',
            PASS: process.env.SMTP_PASS || 'your-app-specific-password',
            FROM: process.env.SMTP_FROM || '"Your App Name" <your-email@gmail.com>'
        }
    },

    PATH: {
        ROOT: '/',
        ROOT_ENTITY: '/:id',
        ROOT_BLOG_ENTITY: '/:blogId',
        TESTING: '/testing',
        ALL_DATA: '/all-data',
        TESTING_DELETE: '/testing/all-data',
        BLOGS: '/blogs',
        POSTS: '/posts',
        COMMENTS: '/comments',
        USERS: '/users',
        AUTH: '/auth'
    }
};