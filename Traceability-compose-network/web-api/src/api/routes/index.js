
import rawMaterialRoutes from './rawMaterial.route.js';
import userRoutes from './user.route.js';
import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import paymentRoutes from './payment.route.js'



export const apiRoute = (app) => { 

    app.use('/api/v1/rawMaterial', rawMaterialRoutes);
    app.use('/api/v1/user', userRoutes);
    app.use('/api/v1/product', productRoutes);
    // app.use('/api/v1/products', productRoutes);
    app.use('/api/v1/order',orderRoutes);
    app.use('/api/v1/payment',paymentRoutes);
    
};
