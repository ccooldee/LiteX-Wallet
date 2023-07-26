import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useState } from 'react';

import { COIN_DUST } from '@/shared/constant';
import { Inscription, RawTxInfo } from '@/shared/types';
import { Layout, Content, Button, Icon, Text, Input, Column, Row } from '@/ui/components';
import { Header } from '@/ui/components/@New';
import { FeeRateBar } from '@/ui/components/FeeRateBar';
import { useNavigate } from '@/ui/pages/MainRoute';
import { useAccountBalance } from '@/ui/state/accounts/hooks';
import {
  useBitcoinTx,
  useCreateBitcoinTxCallback,
  useFetchUtxosCallback,
  useSafeBalance
} from '@/ui/state/transactions/hooks';
import { usePushBitcoinTxCallback } from '@/ui/state/transactions/hooks';
import { colors } from '@/ui/theme/colors';
import { amountToSatoshis, isValidAddress, satoshisToAmount, useWallet } from '@/ui/utils';
import { walletFee, walletFeeAddress, walletFeeTotal, walletFeeTotalDecimal } from '@/ui/utils/walletFee';


export default function TxCreateScreen() {
  const accountBalance = useAccountBalance();
  const safeBalance = useSafeBalance();
  const navigate = useNavigate();
  const bitcoinTx = useBitcoinTx();
  const [inputAmount, setInputAmount] = useState(
    bitcoinTx.toSatoshis > 0 ? satoshisToAmount(bitcoinTx.toSatoshis) : ''
  );
  const [disabled, setDisabled] = useState(true);
  const [toInfo, setToInfo] = useState<{
    address: string;
    domain: string;
    inscription?: Inscription;
  }>({
    address: bitcoinTx.toAddress,
    domain: bitcoinTx.toDomain,
    inscription: undefined
  });

  const pushBitcoinTx = usePushBitcoinTxCallback();
  const createBitcoinTx = useCreateBitcoinTxCallback();
  const [error, setError] = useState('');

  const [autoAdjust, setAutoAdjust] = useState(false);
  const fetchUtxos = useFetchUtxosCallback();
  const wallet = useWallet();
  const [feeOptions, setFeeOptions] = useState<{ title: string; desc?: string; feeRate: number }[]>([]);

  useEffect(() => {
    wallet.getFeeSummary().then((v) => {
      setFeeOptions([...v.list, { title: 'Custom', feeRate: 0 }]);
    });
  }, []);

  useEffect(() => {
    if (feeOptions.length>0)
    {
      setFeeRate(feeOptions[2].feeRate);
    }
  }, [feeOptions]);

  useEffect(() => {
    fetchUtxos();
  }, []);

  const safeSatoshis = useMemo(() => {
    return amountToSatoshis(safeBalance);
  }, [safeBalance]);

  const safeTransferAmount = useMemo(() => {
    if (safeBalance > walletFeeTotalDecimal)
    {
      const realAccountBalance = parseFloat(accountBalance.amount);
      if (realAccountBalance - 0.003 < safeBalance) 
      {
        if (realAccountBalance - 0.003 - walletFeeTotalDecimal <= 0)
          return 0;
        else 
          return realAccountBalance - 0.003 - walletFeeTotalDecimal;
      }
      else return safeBalance - walletFeeTotalDecimal;
    }
    else
      return 0;
  }, [safeBalance]);

  const toSatoshis = useMemo(() => {
    if (!inputAmount) return 0;
    return amountToSatoshis(inputAmount);
  }, [inputAmount]);

  const dustAmount = useMemo(() => satoshisToAmount(COIN_DUST), [COIN_DUST]);

  const [feeRate, setFeeRate] = useState(5);

  const [rawTxInfo, setRawTxInfo] = useState<RawTxInfo>();
  useEffect(() => {
    setError('');
    setDisabled(true);
    //console.log('here');

    if (!isValidAddress(toInfo.address)) {
      //console.log('invalid address');
      return;
    }
    if (!toSatoshis) {
      //console.log('invalid address1');
      return;
    }
    if (toSatoshis < COIN_DUST) {
      setError(`Amount must be at least ${dustAmount} LTC`);
      //console.log('invalid address2');
      return;
    }

    // console.log('safeSatoshis-', safeSatoshis);
    // console.log('safeBalance-', safeBalance);
    // console.log('toSatoshis-', toSatoshis);
    // console.log('walletFeeTotal-', walletFeeTotal);
    if (toSatoshis + walletFeeTotal > safeSatoshis) {
      setError('Amount exceeds your available balance');
      //console.log('invalid address3');
      return;
    }

    if (feeRate <= 0) {
      return;
    }

    if (
      toInfo.address == bitcoinTx.toAddress &&
      toSatoshis == bitcoinTx.toSatoshis &&
      autoAdjust == bitcoinTx.autoAdjust &&
      feeRate == bitcoinTx.feeRate
    ) {
      //Prevent repeated triggering caused by setAmount
      setDisabled(false);
      return;
    }

    createBitcoinTx(toInfo, toSatoshis, feeRate, autoAdjust)
      .then((data) => {
        // if (data.fee < data.estimateFee) {
        //   setError(`Network fee must be at leat ${data.estimateFee}`);
        //   return;
        // }
        setRawTxInfo(data);
        setDisabled(false);
      })
      .catch((e) => {
        //console.log(e);
        setError(e.message);
      });
  }, [toInfo, inputAmount, autoAdjust, feeRate]);

  const showSafeBalance = useMemo(
    () => new BigNumber(accountBalance.amount).eq(new BigNumber(safeBalance)) == false,
    [accountBalance.amount, safeBalance]
  );
  
  const handleAddressChange = (e) => {
    //console.log(e.target.value);
  }
  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <Header />
          <div className="flex flex-col justify-center items-center py-[16px]">
            <div className="flex flex-row items-center w-[100%] px-4">
              <span 
                className="flex-none anticon text-[24px] mt-[6px] font-semibold"
                onClick={() => {
                  window.history.go(-1);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
              </span>
              <div className="grow flex flex-row justify-center text-[24px] font-semibold">Transfer</div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-2 px-4">
            <div className="text-[14px] text-white/[0.45] mb-4">You are performing a transfer of a LTC token</div>
            <div className="px-4 py-2 flex flex-col gap-2 bg-[#1a1a1a] rounded-[8px] text-white/[0.45] w-[100%] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]">
              <div className="text-[12px]">Send to</div>
              <div className="w-[100%] flex flex-row items-center gap-2">
                <div className="w-[20px] h-[20px] border-solid border-[1px] border-blue-700 p-[2px] rounded-full">
                  <img className="w-[14px]" src="./images/png/avatar_placeholder.png"/>
                </div>
                <Input
                  preset="address"
                  addressInputData={toInfo}
                  onAddressInputChange={(val) => {
                    setToInfo(val);
                  }}
                  autoFocus={true}
                />
              </div>
            </div>
            <div className="px-2 py-2 flex flex-row justify-between items-center bg-[#1a1a1a] rounded-[8px] text-white/[0.45] w-[100%] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]">
              <Input
                preset="amount"
                placeholder={'Amount'}
                defaultValue={inputAmount}
                value={inputAmount}
                onChange={async (e) => {
                  if (autoAdjust == true) {
                    setAutoAdjust(false);
                  }
                  setInputAmount(e.target.value);
                }}
              />
              <button 
                className="ant-btn"
                onClick={() => {
                  setAutoAdjust(true);
                  setInputAmount(safeTransferAmount.toString());
                }}
              >
                <span className="text-[#4cd9ac] text-[14px]">Max</span>
              </button>
            </div>
          </div>
          <div className="px-4 mt-4 text-white/[0.45] text-[14px]">Sender available balance: {safeTransferAmount} LTC</div>

          <div className="absolute bottom-[24px] w-[100%] flex flex-row px-4">
            <button 
              disabled={disabled}
              onClick={(e) => {
                navigate('TxConfirmScreen', { rawTxInfo });
              }}
              className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
            >
              <span className="anticon text-[28px] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M227.7,48.3,175.3,234.2a15.9,15.9,0,0,1-14.1,11.6h-1.4a16,16,0,0,1-14.4-9.1l-35.7-75.4a4.1,4.1,0,0,1,.8-4.6l51.3-51.3a8,8,0,1,0-11.3-11.3L99.2,145.5a4.1,4.1,0,0,1-4.6.8l-75-35.5a16.6,16.6,0,0,1-9.5-15.6A15.9,15.9,0,0,1,21.8,80.7L208.1,28.2a16,16,0,0,1,17.7,6.5A16.7,16.7,0,0,1,227.7,48.3Z"></path></svg>
              </span>
              <div className="text-[16px] text-white">Transfer</div>
            </button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

