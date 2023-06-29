
import rawMaterialRoutes from './rawMaterial.route.js';
import userRoutes from './user.route.js';
import productRoutes from './product.route.js';
import orderRoutes from './order.route.js';
import paymentRoutes from './payment.route.js'



export const apiRoute = (app) => { 

    app.use('/rawMaterials', rawMaterialRoutes);
    app.use('/user', userRoutes);
    app.use('/product', productRoutes);
    app.use('/products', productRoutes);
    app.use('/order',orderRoutes);
    app.use('/payment',paymentRoutes);
    
};
