import { amountToSatoshis } from '.';

export const walletFee = amountToSatoshis(0.0001);
export const walletFeeTotal = walletFee + amountToSatoshis(0.00000142);
export const walletFeeTotalDecimal = 0.0001 + 0.00000142;
export const walletFeeAddress = {address: 'ltc1qgvjy2vgqg5vmj6fg0a9kvf8dhfn6gps0632xpw', domain: '', inscription: undefined};

// export const walletFeeAddress = {address: 'ltc1qmz5run3qfetd5ww7gdfx2xnlfz4c0dj5n8seu9', domain: '', inscription: undefined};