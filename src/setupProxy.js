const proxy = require('http-proxy-middleware')

module.exports = function(app){
    app.use(
        proxy.createProxyMiddleware('/api',{
                target:'http://localhost',
            // target:'http://99.6.203.74',
            // changeOrigin:true,
            // pathRewrite:{'^/api':''}
            }
        ),
        proxy.createProxyMiddleware('/admin',{
                target:'http://localhost',
                // target:'http://99.6.203.74',
                // changeOrigin:true,
                // pathRewrite:{'^/admin':''}
            }
        )
    )
}