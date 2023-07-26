import { Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { InscribeOrder, RawTxInfo, TokenBalance, TxType } from '@/shared/types';
import { Button, Card, Column, Content, Footer, Header, Icon, Input, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { Loading } from '@/ui/components/ActionComponent/Loading';
import { Empty } from '@/ui/components/Empty';
import { FeeRateBar } from '@/ui/components/FeeRateBar';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import WebsiteBar from '@/ui/components/WebsiteBar';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useNetworkType } from '@/ui/state/settings/hooks';
import {
  useCreateBitcoinTxCallback,
  useFetchUtxosCallback,
  usePushBitcoinTxCallback
} from '@/ui/state/transactions/hooks';
import { fontSizes } from '@/ui/theme/font';
import { spacing } from '@/ui/theme/spacing';
import { satoshisToAmount, useApproval, useLocationState, useWallet } from '@/ui/utils';
import { walletFee, walletFeeAddress, walletFeeTotal, walletFeeTotalDecimal } from '@/ui/utils/walletFee';


import { useNavigate } from '../../MainRoute';
import SignPsbt from './SignPsbt';

interface Props {
  params: {
    data: {
      ticker: string;
      amount: string;
    };
    session: {
      origin: string;
      icon: string;
      name: string;
    };
  };
}

enum Step {
  STEP1,
  STEP2,
  STEP3,
  STEP4
}

interface ContextData {
  step: Step;
  ticker: string;
  session?: any;
  tokenBalance?: TokenBalance;
  order?: InscribeOrder;
  rawTxInfo?: RawTxInfo;
  amount?: number;
  isApproval: boolean;
}

interface UpdateContextDataParams {
  step?: Step;
  ticket?: string;
  session?: any;
  tokenBalance?: TokenBalance;
  order?: InscribeOrder;
  rawTxInfo?: RawTxInfo;
  amount?: number;
}

export default function InscribeTransfer({ params: { data, session } }: Props) {
  const [contextData, setContextData] = useState<ContextData>({
    step: Step.STEP1,
    ticker: data.ticker,
    amount: parseInt(data.amount),
    session,
    isApproval: true
  });
  const updateContextData = useCallback(
    (params: UpdateContextDataParams) => {
      setContextData(Object.assign({}, contextData, params));
    },
    [contextData, setContextData]
  );

  if (contextData.step === Step.STEP1) {
    return <InscribeTransferStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP2) {
    return <InscribeConfirmStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP3) {
    return <InscribeSignStep contextData={contextData} updateContextData={updateContextData} />;
  } else {
    return <InscribeResultStep contextData={contextData} updateContextData={updateContextData} />;
  }
}

interface LocationState {
  ticker: string;
}

export function InscribeTransferScreen() {
  const { ticker } = useLocationState<LocationState>();

  const [contextData, setContextData] = useState<ContextData>({
    step: Step.STEP1,
    ticker: ticker,
    isApproval: false
  });
  const updateContextData = useCallback(
    (params: UpdateContextDataParams) => {
      setContextData(Object.assign({}, contextData, params));
    },
    [contextData, setContextData]
  );

  if (contextData.step === Step.STEP1) {
    return <InscribeTransferStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP2) {
    return <InscribeConfirmStep contextData={contextData} updateContextData={updateContextData} />;
  } else if (contextData.step === Step.STEP3) {
    return <InscribeSignStep contextData={contextData} updateContextData={updateContextData} />;
  } else {
    return <InscribeResultStep contextData={contextData} updateContextData={updateContextData} />;
  }
}

interface StepProps {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}

function InscribeTransferStep({ contextData, updateContextData }: StepProps) {
  const networkType = useNetworkType();
  const [getApproval, resolveApproval, rejectApproval] = useApproval();

  const handleCancel = () => {
    rejectApproval('User rejected the request.');
  };

  const wallet = useWallet();
  const account = useCurrentAccount();
  const [feeRate, setFeeRate] = useState(3);
  const [inputAmount, setInputAmount] = useState('');

  const tools = useTools();
  const createBitcoinTx = useCreateBitcoinTxCallback();

  const fetchUtxos = useFetchUtxosCallback();

  const [inputError, setInputError] = useState('');

  const [disabled, setDisabled] = useState(true);

  const [inputDisabled, setInputDisabled] = useState(false);
  useEffect(() => {
    if (contextData.amount) {
      setInputAmount(contextData.amount.toString());
      setInputDisabled(true);
    }
  }, []);

  useEffect(() => {
    setInputError('');
    setDisabled(true);

    const amount = parseInt(inputAmount);
    if (!amount) {
      return;
    }

    if (!contextData.tokenBalance) {
      return;
    }

    if (amount <= 0) {
      return;
    }

    if (amount > parseInt(contextData.tokenBalance.availableBalanceSafe)) {
      setInputError('Insufficient Balance');
      return;
    }

    if (feeRate <= 0) {
      return;
    }

    setDisabled(false);
  }, [inputAmount, feeRate, contextData.tokenBalance]);

  useEffect(() => {
    fetchUtxos();
    wallet
      .getBRC20Summary(account.address, contextData.ticker)
      .then((v) => {
        updateContextData({ tokenBalance: v.tokenBalance });
      })
      .catch((e) => {
        tools.toastError(e.message);
      });
  }, []);

  const onClickInscribe = async () => {
    try {
      tools.showLoading(true);
      const amount = parseInt(inputAmount);
      const order = await wallet.inscribeBRC20Transfer(account.address, contextData.ticker, amount.toString(), feeRate);
      const rawTxInfo = await createBitcoinTx({ address: order.payAddress, domain: '' }, order.totalFee, feeRate);
      updateContextData({ order, amount, rawTxInfo, step: Step.STEP2 });
    } catch (e) {
      //console.log(e);
      tools.toastError((e as Error).message);
    } finally {
      tools.showLoading(false);
    }
  };

  const { tokenBalance } = contextData;

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
            <div className="text-[24px] text-white ml-[20px]">LTC20 Inscribe Transfer</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
            <div className="flex flex-row justify-between w-[100%] px-4">
              <div className="text-white/[0.45] font-bold text-[24px]">Available</div>
              {tokenBalance ? (
                <Column>
                  {tokenBalance.availableBalanceUnSafe != '0' ? (
                    <Row justifyCenter>
                      <div 
                        className="text-white text-[24px] cursor-pointer"
                        onClick={() => {
                          setInputAmount(tokenBalance.availableBalanceSafe);
                        }}
                      >
                        {`${tokenBalance.availableBalanceSafe}  `}
                      </div>
                      <Tooltip
                        title={`${tokenBalance.availableBalanceUnSafe} ${tokenBalance.ticker} is unconfirmed, please wait for confirmation `}
                        overlayStyle={{
                          fontSize: fontSizes.xs
                        }}>
                        <div 
                          className="text-white/[0.45] text-[24px]"
                          onClick={() => {
                            setInputAmount(tokenBalance.availableBalanceSafe);
                          }}
                        >
                          {` + ${tokenBalance.availableBalanceUnSafe}`}
                        </div>
                      </Tooltip>
                      <div 
                        className="text-white text-[24px]"
                      >
                        {`${tokenBalance.ticker}  `}
                      </div>
                    </Row>
                  ) : (
                    <div 
                      className="text-white text-[24px] cursor-pointer"
                      onClick={() => {
                        setInputAmount(tokenBalance.availableBalanceSafe);
                      }}
                    >
                      {`${tokenBalance.availableBalanceSafe} ${tokenBalance.ticker}`}
                    </div>
                  )}
                </Column>
              ) : (
                <div 
                  className="text-white text-[24px]"
                >
                  loading...
                </div>
              )}
            </div>
            <div className="flex flex-col w-[100%] px-4 mt-2">
              <Input
                preset="amount"
                placeholder={'Amount'}
                value={inputAmount}
                autoFocus={true}
                onChange={async (e) => {
                  setInputAmount(e.target.value);
                }}
                disabled={inputDisabled}
              />
              {inputError && <div className=" text-red-800 text-[16px]">{inputError}</div>}
            </div>
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-col gap-2 px-4">
            {contextData.isApproval ? (
              <div className="flex flex-row">
                <button 
                  className="text-white rounded-[8px] bg-[#1b1b1b] hover:bg-[#363636] active:bg-[#1b1b1b] flex flex-row px-4 py-3 items-center justify-center gap-2"
                  onClick={handleCancel}
                >

                  <div className="font-bold">Cancel</div>
                </button>
                <button 
                  className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
                  onClick={onClickInscribe}
                  disabled={disabled}
                >
                  <div className="font-bold">Next</div>
                </button>
              </div>
            ) : (
              <button 
                onClick={onClickInscribe}
                disabled={disabled}
                className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
              >
                <div className="text-[16px] text-white">Next</div>
              </button>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}

function InscribeConfirmStep({ contextData, updateContextData }: StepProps) {
  const tools = useTools();
  const pushBitcoinTx = usePushBitcoinTxCallback();

  const { order, tokenBalance, amount, rawTxInfo, session } = contextData;

  if (!order || !tokenBalance || !rawTxInfo) {
    return <Empty />;
  }

  const fee = rawTxInfo.fee || 0;
  const networkFee = useMemo(() => satoshisToAmount(fee + walletFee), [fee]);
  const outputValue = useMemo(() => satoshisToAmount(order.outputValue), [order.outputValue]);
  const minerFee = useMemo(() => satoshisToAmount(order.minerFee + fee), [order.minerFee]);
  const originServiceFee = useMemo(() => satoshisToAmount(order.originServiceFee), [order.originServiceFee]);
  const serviceFee = useMemo(() => satoshisToAmount(order.serviceFee), [order.serviceFee]);
  const totalFee = useMemo(() => satoshisToAmount(order.totalFee + fee + walletFee), [order.totalFee]);

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
            <div className="text-[24px] text-white ml-[20px]">LTC20 Inscribe Transfer</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%] p-4">
            <div className="text-white/[0.65] text-[32px] font-bold">
              {`${amount} ${tokenBalance.ticker}`}
            </div>
            <div className="w-[100%] p-4 bg-[#1a1a1a] rounded-[8px]">
              <Text
                text={`{"p":"ltc-20","op":"transfer","tick":"${tokenBalance.ticker}","amt":"${amount}"}`}
                size="xs"
              />
            </div>
            <div className="w-[100%] p-4 bg-[#1a1a1a] rounded-[8px] flex flex-col gap-3">
              <div className="flex flex-row justify-between items-center">
                <div className="text-white/[0.65] font-bold text-[14px]">Payment Network Fee</div>
                <div className="text-white text-[16px]">{`${networkFee} LTC`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-white/[0.65] font-bold text-[14px]">Inscription Output Value</div>
                <div className="text-white text-[16px]">{`${outputValue} LTC`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-white/[0.65] font-bold text-[14px]">Service Fee</div>
                <div className="text-white text-[16px]">{`${serviceFee} LTC`}</div>
              </div>
              <div className="flex flex-row justify-between items-center">
                <div className="text-white/[0.65] font-bold text-[16px]">Total</div>
                <div className=" text-blue-600 font-bold text-[18px]">{`${totalFee}LTC`}</div>
              </div>

            </div>
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-col gap-2 px-4">
            {contextData.isApproval ? (
              <div className="flex flex-row">
                <button 
                  className="text-white rounded-[8px] bg-[#1b1b1b] hover:bg-[#363636] active:bg-[#1b1b1b] flex flex-row px-4 py-3 items-center justify-center gap-2"
                  onClick={() => {
                    updateContextData({
                      step: Step.STEP1
                    });
                  }}
                >

                  <div className="font-bold">Back</div>
                </button>
                <button 
                  className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
                  onClick={() => {
                    updateContextData({
                      step: Step.STEP3
                    });
                    // onClickConfirm();
                  }}
                >
                  <div className="font-bold">Next</div>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => {
                  updateContextData({
                    step: Step.STEP3
                  });
                  // onClickConfirm();
                }}
                className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
              >
                <div className="text-[16px] text-white">Next</div>
              </button>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
}

function InscribeSignStep({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  const pushBitcoinTx = usePushBitcoinTxCallback();
  const navigate = useNavigate();
  return (
    <SignPsbt
      params={{
        data: {
          psbtHex: contextData.rawTxInfo!.psbtHex,
          type: TxType.SEND_BITCOIN,
        }
      }}
      handleCancel={() => {
        window.history.go(-1);
      }}
      handleConfirm={() => {
        pushBitcoinTx(contextData.rawTxInfo!.rawtx).then(({ success, txid, error }) => {
          if (success) {
            updateContextData({
              step: Step.STEP4
            });
          } else {
            navigate('TxFailScreen', { error });
          }
        });
      }}
    />
  );
}

function InscribeResultStep({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  // contextData.tokenBalance = {
  //   availableBalance: '1900',
  //   availableBalanceSafe: '1900',
  //   availableBalanceUnSafe: '0',
  //   overallBalance: '2000',
  //   ticker: 'sats',
  //   transferableBalance: '100'
  // };
  // contextData.order = {
  //   orderId: 'fd9915ced9091f74765ad5c17e7e83425b875a87',
  //   payAddress: 'bc1p7fmwed05ux6hxn6pz63a8ce7nnzmdppfydny2e3gspdxxtc37duqex24ss',
  //   totalFee: 6485,
  //   minerFee: 3940,
  //   originServiceFee: 2499,
  //   serviceFee: 1999,
  //   outputValue: 546
  // };
  if (!contextData.order || !contextData.tokenBalance) {
    return <Empty />;
  }
  const pushBitcoinTx = usePushBitcoinTxCallback();
  const createBitcoinTx = useCreateBitcoinTxCallback();

  const { tokenBalance, order } = contextData;
  const tools = useTools();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();
  const [getApproval, resolveApproval, rejectApproval] = useApproval();
  const navigate = useNavigate();
  const [result, setResult] = useState<any>();
  const checkResult = async () => {
    const result = await wallet.getInscribeResult(order.orderId);
    /*
    if (!result) {
      setTimeout(() => {
        checkResult();
      }, 5000);
      return;
    }
    */
    tools.showLoading(false);
    setResult(result);
    navigate('TxSuccessScreen', { txid: '' });
  };

  useEffect(() => {
    setTimeout(() => {
      checkResult();
    }, 5000);
    //checkResult();

  }, []);

  const onClickConfirm = () => {

    tools.showLoading(true);
    wallet
      .getBRC20Summary(currentAccount.address, tokenBalance.ticker)
      .then((v) => {
        if (contextData.isApproval) {
          resolveApproval({
            inscriptionId: result.inscriptionId,
            inscriptionNumber: result.inscriptionNumber,
            ticker: tokenBalance.ticker,
            amount: result.amount
          });
        } else {
          navigate('BRC20SendScreen', {
            tokenBalance: v.tokenBalance,
            selectedInscriptionIds: [result.inscriptionId],
            selectedAmount: parseInt(result.amount)
          });
        }
      })
      .finally(() => {
        tools.showLoading(false);
      });
  };

  if (!result) {
    return (
      <Layout>
        <Content preset="middle">
          <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
            <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
              <button 
                className="ant-btn text-[24px]"
                onClick={() => {
                  window.history.go(-1);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
              </button>
              <div className="text-[24px] text-white ml-[113px]">Success</div>
            </div>
            <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
              <div className="flex justify-center mt-4 text-page-icon-color text-center">
                <div className="p-6 rounded-[50%] relative overflow-hidden w-min text-page-icon-color ">
                  <div className="absolute w-[100%] h-[100%] bg-[#4cd9ac] opacity-[0.1] rounded-[50%] left-0 top-0"></div>
                  <span className="anticon text-page-icon-color w-[64px] h-[64px] text-[64px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                  </span>
                </div>
              </div>
              <div className="text-[32px] font-bold text-white">Payment Sent</div>
              <div className="text-[16px] text-white/[0.45]">Your transaction has been succesfully sent</div>
              <Column justifyCenter itemsCenter>
                <Column mt="lg">
                  <Loading text="Inscribing..." />
                </Column>
              </Column>
            </div>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
            <div className="text-[24px] text-white ml-[113px]">Success</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
            <div className="flex justify-center mt-4 text-page-icon-color text-center">
              <div className="p-6 rounded-[50%] relative overflow-hidden w-min text-page-icon-color ">
                <div className="absolute w-[100%] h-[100%] bg-[#4cd9ac] opacity-[0.1] rounded-[50%] left-0 top-0"></div>
                <span className="anticon text-page-icon-color w-[64px] h-[64px] text-[64px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
              </div>
            </div>
            <div className="text-[32px] font-bold text-white">Inscribe Success</div>
            <div className="text-[16px] text-white/[0.45] p-4 text-center">The transferable and available balance of LTC20 will be refreshed in a few minutes.</div>
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-col gap-2 px-4">
            <button 
              onClick={() => {
                onClickConfirm();
              }}
              className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
            >
              <div className="text-[16px] text-white">Done</div>
            </button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
