import paypal from 'paypal-rest-sdk';


// const generateUniqueIdentity = (username) =>{
//   const hash = crypto.createHash('sha256');
//   const uniqueIdentity = hash.update(username).digest('hex');
//   return uniqueIdentity;
// }

const payStatus = async (amount) =>{
    let PayStatus="Due";
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:4000",
            "cancel_url": "http://localhost:4000"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": "12.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": amount
            },
            "description": "This is the payment description."
        }]
    };
    
    try {
        const payment = await new Promise((resolve, reject) => {
          paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
              reject(error);
            } else {
              resolve(payment);
              console.log(payment);
            }
          });
        });
        return JSON.stringify(payment);


        // if(payment){
        //     console.log("Create Payment Response");
        //     console.log(payment);
        //     console.log("dta payment ID ===", payment.id);
        //     PayStatus = "paid";
        //     console.log("payStatus ===", PayStatus);
        // }
       
      } catch (error) {
        throw error;
      }
}
export default{
    payStatus,
}



    // paypal.payment.create(create_payment_json, function (error, payment) {
    //     if (error) {
    //         throw error;
    //     } else {
    //         console.log("Create Payment Response");
    //         console.log(payment);
    //         console.log("dta payment ID ===",payment.id);
    //         PayStatus="paid";
    //         console.log("payStatus ===",PayStatus);
    //     }
    // });
    