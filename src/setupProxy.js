const proxy = require('http-proxy-middleware')

module.exports = function(app){
    app.use(
        proxy.createProxyMiddleware('/api',{
                target:'http://ec2-54-145-239-81.compute-1.amazonaws.com',
            // changeOrigin:true,
            // pathRewrite:{'^/api':''}
            }
        ),
        proxy.createProxyMiddleware('/admin',{
                target:'http://ec2-54-145-239-81.compute-1.amazonaws.com',
                // changeOrigin:true,
                // pathRewrite:{'^/admin':''}
            }
        )
    )
}