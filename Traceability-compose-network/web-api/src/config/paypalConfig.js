// paypalConfig.js
import paypal from 'paypal-rest-sdk';

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AVRFCh2xINEVQU4Ss1RdUQkskYH0FtQi6xj9qIIQZmZ241t6r_KFKswo_GarWxk1nPwsSvLBWCYgShM2',
    'client_secret': 'EFB4TxztvI_w2djgJQCp4zWF2cYMUUJKZ1sFjCRN0eFIEDPiKWNheRrDTc6q5iTqf5-mdwI5BTkkXPfb'
});

export default paypal;
