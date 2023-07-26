import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Inscription, RawTxInfo } from '@/shared/types';
import { Button, Column, Content, Input, Layout, Row, Text } from '@/ui/components';
import { Header } from '@/ui/components/@New';
import { FeeRateBar } from '@/ui/components/FeeRateBar';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { OutputValueBar } from '@/ui/components/OutputValueBar';
import { useCreateOrdinalsTxCallback, useOrdinalsTx } from '@/ui/state/transactions/hooks';
import { amountToSatoshis, isValidAddress, useWallet } from '@/ui/utils';
import { walletFee, walletFeeAddress, walletFeeTotal } from '@/ui/utils/walletFee';

import { useNavigate } from '../MainRoute';

export default function OrdinalsTxCreateScreen() {
  const [disabled, setDisabled] = useState(true);
  const navigate = useNavigate();

  const { state } = useLocation();
  const { inscription } = state as {
    inscription: Inscription;
  };
  const ordinalsTx = useOrdinalsTx();
  const [toInfo, setToInfo] = useState({
    address: ordinalsTx.toAddress,
    domain: ordinalsTx.toDomain
  });

  const [error, setError] = useState('');
  const createOrdinalsTx = useCreateOrdinalsTxCallback();

  const [feeRate, setFeeRate] = useState(5);
  const defaultOutputValue = inscription ? inscription.outputValue : 10000;

  const minOutputValue = Math.max(inscription.offset, 546);
  const [outputValue, setOutputValue] = useState(defaultOutputValue);

  const [rawTxInfo, setRawTxInfo] = useState<RawTxInfo>();
  const [feeOptions, setFeeOptions] = useState<{ title: string; desc?: string; feeRate: number }[]>([]);
  const wallet = useWallet();

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
    setDisabled(true);
    setError('');

    if (feeRate <= 0) {
      setError('Invalid fee rate');
      return;
    }

    if (outputValue < minOutputValue) {
      setError(`OutputValue must be at least ${minOutputValue}`);
      return;
    }

    if (!outputValue) {
      return;
    }

    if (!isValidAddress(toInfo.address)) {
      return;
    }

    if (
      toInfo.address == ordinalsTx.toAddress &&
      feeRate == ordinalsTx.feeRate &&
      outputValue == ordinalsTx.outputValue
    ) {
      //Prevent repeated triggering caused by setAmount
      setDisabled(false);
      return;
    }

    createOrdinalsTx(toInfo, inscription.inscriptionId, feeRate, outputValue)
      .then((data) => {
        setRawTxInfo(data);
        setDisabled(false);
      })
      .catch((e) => {
        //console.log(e);
        setError(e.message);
      });
  }, [toInfo, feeRate, outputValue]);

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
            {inscription && <InscriptionPreview data={inscription} preset="small" />}
            <div className="text-[14px] text-white/[0.45] mb-4">You are performing a transfer of a LTC NFT</div>
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
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-row px-4">
            <button 
              disabled={disabled}
              onClick={(e) => {
                navigate('OrdinalsTxConfirmScreen', { rawTxInfo });
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

/*
<Column>
    <Row justifyBetween>
      <Text text="Inscription" color="grey" />
      {inscription && <InscriptionPreview data={inscription} preset="small" />}
    </Row>

    <Text text="Recipient" color="grey" />

    <Input
      preset="address"
      addressInputData={toInfo}
      autoFocus={true}
      onAddressInputChange={(val) => {
        setToInfo(val);
      }}
    />

    <Text text="OutputValue" color="grey" />

    <OutputValueBar
      defaultValue={defaultOutputValue}
      onChange={(val) => {
        setOutputValue(val);
      }}
    />

    <Text text="Fee" color="grey" />

    <FeeRateBar
      onChange={(val) => {
        setFeeRate(val);
      }}
    />

    {error && <Text text={error} color="error" />}
    <Button
      disabled={disabled}
      preset="primary"
      text="Next"
      onClick={(e) => {
        navigate('OrdinalsTxConfirmScreen', { rawTxInfo });
      }}
    />
  </Column>
*/