const environment = process.env.ENVIRONMENT || 'local';

var config = {};
if(environment == 'local'){
    Object.assign(config, {
        database: 'fb_clone',
        username: 'root',
        password: '',
        host: 'localhost',
        dialect: 'mysql'
    })
}
if(environment == 'production'){
    Object.assign(config, {
        database: 'if0_34936754_fb_clone',
        username: 'if0_34936754',
        password: 'KZe5o6ZHQ4N0T6',
        host: 'sql307.infinityfree.com',
        dialect: 'mysql'
    })
}
export { config };