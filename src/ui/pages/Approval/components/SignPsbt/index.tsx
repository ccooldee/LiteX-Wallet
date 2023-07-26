import React, { useEffect, useMemo, useState } from 'react';

import { RawTxInfo, ToSignInput, TxType, WalletHistory } from '@/shared/types';
import { DecodedPsbt } from '@/shared/types';
import { Inscription } from '@/shared/types';
import { Button, Layout, Content, Footer, Icon, Text, Row, Card, Column, TextArea, Header } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { AddressText } from '@/ui/components/AddressText';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { TabBar } from '@/ui/components/TabBar';
import WebsiteBar from '@/ui/components/WebsiteBar';
import { useAccountAddress } from '@/ui/state/accounts/hooks';
import { useCreateBitcoinTxCallback, useCreateMultiOrdinalsTxCallback } from '@/ui/state/transactions/hooks';
import { colors } from '@/ui/theme/colors';
import { fontSizes } from '@/ui/theme/font';
import { copyToClipboard, satoshisToAmount, shortAddress, useApproval, useWallet } from '@/ui/utils';
import { LoadingOutlined } from '@ant-design/icons';
import { walletFeeTotal } from '@/ui/utils/walletFee';

interface Props {
  header?: React.ReactNode;
  params: {
    data: {
      psbtHex: string;
      type: TxType;
      toAddress?: string;
      satoshis?: number;
      feeRate?: number;
      inscriptionId?: string;
      toSignInputs?: ToSignInput[];
      rawTxInfo?: RawTxInfo;
    };
    session?: {
      origin: string;
      icon: string;
      name: string;
    };
  };
  handleCancel?: () => void;
  handleConfirm?: () => void;
}
interface InputInfo {
  txid: string;
  vout: number;
  address: string;
  value: number;
  inscrip;
}

interface OutputInfo {
  address: string;
  value: number;
}

enum TabState {
  DETAILS,
  DATA,
  HEX
}

interface InscriptioinInfo {
  id: string;
  isSent: boolean;
}

function SignTxDetails({ txInfo, type, rawTxInfo }: { txInfo: TxInfo; rawTxInfo?: RawTxInfo; type: TxType;  }) {
  const address = useAccountAddress();

  const sendingInscriptions = useMemo(() => {
    return txInfo.decodedPsbt.inputInfos
      .reduce<Inscription[]>((pre, cur) => cur.inscriptions.concat(pre), [])
      .filter((v) => v.address == address);
  }, [txInfo.decodedPsbt]);

  const receivingInscriptions = useMemo(() => {
    return txInfo.decodedPsbt.outputInfos
      .reduce<Inscription[]>((pre, cur) => cur.inscriptions.concat(pre), [])
      .filter((v) => v.address == address);
  }, [txInfo.decodedPsbt]);

  const isCurrentToPayFee = useMemo(() => {
    if (type === TxType.SIGN_TX) {
      return false;
    } else {
      return true;
    }
  }, [type]);

  const spendSatoshis = useMemo(() => {
    const inValue = txInfo.decodedPsbt.inputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    const outValue = txInfo.decodedPsbt.outputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    const spend = inValue - outValue;
    return spend;
  }, [txInfo.decodedPsbt]);

  const sendingSatoshis = useMemo(() => {
    const inValue = txInfo.decodedPsbt.inputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    return inValue;
  }, [txInfo.decodedPsbt]);

  const receivingSatoshis = useMemo(() => {
    const outValue = txInfo.decodedPsbt.outputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    return outValue;
  }, [txInfo.decodedPsbt]);

  const spendAmount = useMemo(() => satoshisToAmount(spendSatoshis + walletFeeTotal), [spendSatoshis]);
  const balanceChangedAmount = useMemo(
    () => satoshisToAmount(receivingSatoshis - sendingSatoshis),
    [sendingSatoshis, receivingSatoshis]
  );
  const sendingAmount = useMemo(() => satoshisToAmount(sendingSatoshis), [sendingSatoshis]);
  const receivingAmount = useMemo(() => satoshisToAmount(receivingSatoshis), [receivingSatoshis]);

  const feeAmount = useMemo(() => { 
    const str: string = txInfo.decodedPsbt.fee.toString();
    const val = Number(str);
    return satoshisToAmount(val + walletFeeTotal);
  }, [txInfo.decodedPsbt]);

  const sendingInscriptionSaotoshis = useMemo(
    () => sendingInscriptions.reduce((pre, cur) => pre + cur.outputValue, 0),
    [sendingInscriptions]
  );
  const sendingInscriptionAmount = useMemo(
    () => satoshisToAmount(sendingInscriptionSaotoshis),
    [sendingInscriptionSaotoshis]
  );

  const receivingInscriptionSaotoshis = useMemo(
    () => receivingInscriptions.reduce((pre, cur) => pre + cur.outputValue, 0),
    [receivingInscriptions]
  );
  const receivingInscriptionAmount = useMemo(
    () => satoshisToAmount(receivingInscriptionSaotoshis),
    [receivingInscriptionSaotoshis]
  );

  if (type === TxType.SIGN_TX) {
    return (
      <Column gap="lg">
        <Text text="Sign Transaction" preset="title-bold" textCenter mt="lg" />
        <Row justifyCenter>
          <Card style={{ backgroundColor: '#272626', maxWidth: 320, width: 320 }}>
            <Column gap="lg">
              <Column>
                <Column>
                  <Column justifyCenter>
                    <Row itemsCenter>
                      <Text
                        text={(receivingSatoshis > sendingSatoshis ? '+' : '') + balanceChangedAmount}
                        color={receivingSatoshis > sendingSatoshis ? 'grey' : 'grey'}
                        preset="bold"
                        textCenter
                        size="xxl"
                      />
                      <Text text="LTC" color="white" />
                    </Row>
                  </Column>
                </Column>
              </Column>
            </Column>
          </Card>
        </Row>
      </Column>
    );
  }

  return (
    <Column gap="lg">
      <Text text="Sign Transaction" preset="title-bold" textCenter mt="lg" />
      <Row justifyCenter>
        <Card style={{ backgroundColor: '#272626', maxWidth: 320, width: 320 }}>
          <Column gap="lg">
            <Column>
              {rawTxInfo && (
                <Column>
                  <Text text={'Send to'} textCenter color="white" />
                  <Row justifyCenter>
                    <AddressText addressInfo={rawTxInfo.toAddressInfo} textCenter />
                  </Row>
                </Column>
              )}
              {rawTxInfo && <Row style={{ borderTopWidth: 1, borderColor: colors.border }} my="md" />}

              {sendingInscriptions.length > 0 && (
                <Column justifyCenter>
                  <Text
                    text={
                      sendingInscriptions.length === 1
                        ? 'Spend Inscription'
                        : `Spend Inscription (${sendingInscriptions.length})`
                    }
                    textCenter
                    color="white"
                  />
                  <Row overflowX gap="lg" justifyCenter style={{ width: 280 }} pb="lg">
                    {sendingInscriptions.map((v) => (
                      <InscriptionPreview key={v.inscriptionId} data={v} preset="small" />
                    ))}
                  </Row>
                </Column>
              )}
              {sendingInscriptions.length > 0 && (
                <Row style={{ borderTopWidth: 1, borderColor: colors.border }} my="md" />
              )}

              <Column>
                <Text text={'Spend Amount'} textCenter color="white" />

                <Column justifyCenter>
                  <Text text={spendAmount} color="white" preset="bold" textCenter size="xxl" />
                  {sendingInscriptionSaotoshis > 0 && (
                    <Text text={`${sendingInscriptionAmount} (in inscriptions)`} preset="bold" color="grey"  textCenter />
                  )}
                  {isCurrentToPayFee && <Text text={`${feeAmount} (network fee)`} preset="bold" color="grey" textCenter />}
                </Column>
              </Column>
            </Column>
          </Column>
        </Card>
      </Row>

      {txInfo.changedInscriptions.length > 0 && (
        <Card>
          <Row>
            <Text text="100" />
          </Row>
        </Card>
      )}
    </Column>
  );
}

function Section({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <Column>
      <Text text={title} preset="bold" color="white"/>
      <Card>
        <Row full justifyBetween itemsCenter>
          {children}
        </Row>
      </Card>
    </Column>
  );
}

interface TxInfo {
  changedBalance: number;
  changedInscriptions: InscriptioinInfo[];
  rawtx: string;
  psbtHex: string;
  toSignInputs: ToSignInput[];
  txError: string;
  decodedPsbt: DecodedPsbt;
}

const initTxInfo: TxInfo = {
  changedBalance: 0,
  changedInscriptions: [],
  rawtx: '',
  psbtHex: '',
  toSignInputs: [],
  txError: '',
  decodedPsbt: {
    inputInfos: [],
    outputInfos: [],
    fee: 0,
    feeRate: 0
  }
};

export default function SignPsbt({
  params: {
    data: { psbtHex, toSignInputs, type, toAddress, satoshis, inscriptionId, feeRate, rawTxInfo },
    session
  },
  header,
  handleCancel,
  handleConfirm
}: Props) {
  const [getApproval, resolveApproval, rejectApproval] = useApproval();

  const [txInfo, setTxInfo] = useState<TxInfo>(initTxInfo);

  const [tabState, setTabState] = useState(TabState.DATA);

  const createBitcoinTx = useCreateBitcoinTxCallback();
  const createOrdinalsTx = useCreateMultiOrdinalsTxCallback();
  const wallet = useWallet();
  const [loading, setLoading] = useState(true);

  const tools = useTools();

  const address = useAccountAddress();

  const init = async () => {
    let txError = '';
    if (type === TxType.SEND_BITCOIN) {
      if (!psbtHex && toAddress && satoshis) {
        try {
          const rawTxInfo = await createBitcoinTx({ address: toAddress, domain: '' }, satoshis, feeRate);
          psbtHex = rawTxInfo.psbtHex;
        } catch (e) {
          //console.log(e);
          txError = (e as any).message;
          tools.toastError(txError);
        }
      }
    } else if (type === TxType.SEND_INSCRIPTION) {
      if (!psbtHex && toAddress && inscriptionId) {
        try {
          const rawTxInfo = await createOrdinalsTx({ address: toAddress, domain: '' }, [inscriptionId], feeRate || 5);
          psbtHex = rawTxInfo.psbtHex;
        } catch (e) {
          //console.log(e);
          txError = (e as any).message;
          tools.toastError(txError);
        }
      }
    }

    // else if (type === TxType.SEND_INSCRIPTION) {
    //   if (!psbtHex && toAddress && inscriptionId) {
    //     psbtHex = await createOrdinalsTx(toAddress, inscriptionId);
    //   }
    // }

    if (!toSignInputs) {
      toSignInputs = [];
    }

    if (!psbtHex) {
      setLoading(false);
      setTxInfo(Object.assign({}, initTxInfo, { txError }));
      return;
    }

    const decodedPsbt = await wallet.decodePsbt(psbtHex);

    setTxInfo({
      decodedPsbt,
      changedBalance: 0,
      changedInscriptions: [],
      psbtHex,
      rawtx: '',
      toSignInputs,
      txError: ''
    });

    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  if (!handleCancel) {
    handleCancel = () => {
      rejectApproval();
    };
  }

  if (!handleConfirm) {
    handleConfirm = () => {
      resolveApproval({
        psbtHex: txInfo.psbtHex
      });
    };
  }

  const networkFee = useMemo(() => { 
    const str: string = txInfo.decodedPsbt.fee.toString();
    const val = Number(str);
    return satoshisToAmount(val + walletFeeTotal);
  }, [txInfo.decodedPsbt]);

  const detailsComponent = useMemo(() => {
    return <SignTxDetails txInfo={txInfo} rawTxInfo={rawTxInfo} type={type} />;
  }, [txInfo]);

  const isValidData = useMemo(() => {
    if (txInfo.psbtHex === '') {
      return false;
    }
    return true;
  }, [txInfo.psbtHex]);

  const isValid = useMemo(() => {
    if (txInfo.decodedPsbt.inputInfos.length == 0) {
      return false;
    } else {
      return true;
    }
  }, [txInfo.decodedPsbt]);

  const sendingInscriptions = useMemo(() => {
    return txInfo.decodedPsbt.inputInfos
      .reduce<Inscription[]>((pre, cur) => cur.inscriptions.concat(pre), [])
      .filter((v) => v.address == address);
  }, [txInfo.decodedPsbt]);

  const sendingInscriptionSaotoshis = useMemo(
    () => sendingInscriptions.reduce((pre, cur) => pre + cur.outputValue, 0),
    [sendingInscriptions]
  );
  const sendingInscriptionAmount = useMemo(
    () => satoshisToAmount(sendingInscriptionSaotoshis),
    [sendingInscriptionSaotoshis]
  );

  const canChanged = useMemo(() => {
    let val = true;
    txInfo.decodedPsbt.inputInfos.forEach((v) => {
      if (v.address == address && (!v.sighashType || v.sighashType === 1)) {
        val = false;
      }
    });
    return val;
  }, [txInfo.decodedPsbt]);

  const spendSatoshis = useMemo(() => {
    const inValue = txInfo.decodedPsbt.inputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    const outValue = txInfo.decodedPsbt.outputInfos
      .filter((v) => v.address === address)
      .reduce((pre, cur) => cur.value + pre, 0);
    const spend = inValue - outValue;
    return spend - txInfo.decodedPsbt.fee;
  }, [txInfo.decodedPsbt]);

  const saveWalletHistory = async () => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const senderAddress: string = address;
    const receiverAddress = txInfo.decodedPsbt.outputInfos[0].address;

    const amount = sendingInscriptions.length > 0 ? sendingInscriptionAmount : satoshisToAmount(spendSatoshis);
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; 
    const currentMonthLetter = monthNames[currentDate.getMonth()];
    const currentDateOfMonth = currentDate.getDate();
    const currentHour = currentDate.getHours();
    const currentMinute = currentDate.getMinutes();

    const transactionTime = `${currentHour}:${currentMinute} - ${currentMonthLetter} ${currentDateOfMonth},${currentYear}`;

    let transactionType = '';
    if (type === TxType.SEND_BITCOIN)
      transactionType = 'SEND TOKEN';
    if (type === TxType.SEND_INSCRIPTION)
      transactionType = 'SEND INSCRIPTION';

    
    const initialHistory: WalletHistory = {
      transactionType: transactionType,
      network: 'Litecoin Network',
      senderAddress: senderAddress,
      recevierAddress: receiverAddress,
      transactionStatus: '',
      transactionHash: '',
      transactionTime: transactionTime,
      amount: amount,
      networkFee: networkFee,
      link: '',
    };

    await wallet.addWalletHistory(initialHistory);
    
    if (handleConfirm)
      handleConfirm();

  }

  if (loading) {
    return (
      <Layout>
        <Content itemsCenter justifyCenter>
          <Icon size={fontSizes.xxxl} color="gold">
            <LoadingOutlined />
          </Icon>
        </Content>
      </Layout>
    );
  }

  if (!header && session) {
    header = (
      <Header>
        <WebsiteBar session={session} />
      </Header>
    );
  }

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="flex flex-row justify-center text-[28px] text-white mb-4 mt-4">Transfer Confirmation</div>
          <div className="flex flex-row justify-center w-[100%]">
            {sendingInscriptions.length > 0 && (
              <div className="mx-4 px-4 max-h-[150px] rounded-[8px] flex flex-row flex-wrap gap-2 justify-center mb-4 overflow-x-scroll">
                {sendingInscriptions.map((v) => (
                  <InscriptionPreview key={v.inscriptionId} data={v} preset="small" />
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center items-center px-4 py-3 bg-[#1a1a1a] rounded-[8px] gap-3 mx-4 h-[135px] overflow-scroll">
            {txInfo.decodedPsbt.outputInfos.slice(-2).map((v, index) => {
              const isToSign = address == v.address;
              const inscriptions = v.inscriptions;
              return (
                <div key={index} className="flex flex-row w-[100%] justify-between">
                  <div className="text-[18px] text-white">
                    {isToSign? 'Send from' : 'Send to'}
                  </div>
                  <div className="text-[18px] text-white/[0.65]">
                    {shortAddress(v.address)}
                  </div>
                </div>
              );
            })} 
            <div className="flex flex-row w-[100%] justify-between">
              <div className="text-[18px] text-white">
                Network
              </div>
              <div className="text-[18px] text-white/[0.65]">
                Litecoin Network
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-4 bg-[#1a1a1a] rounded-[8px] gap-3 mt-4 mx-4">
            <div className="flex flex-row w-[100%] justify-between">
              <div className="text-[18px] text-white">
                Amount
              </div>
              <div className="text-[18px] text-white/[0.65]">
                {sendingInscriptions.length > 0 ? sendingInscriptionAmount : satoshisToAmount(spendSatoshis)}
              </div>
            </div>
            <div className="flex flex-row w-[100%] justify-between">
              <div className="text-[18px] text-white">
                Estimated fee
              </div>
              <div className="text-[18px] text-white/[0.65]">
                {networkFee}
              </div>
            </div>
          </div>
          <div className="absolute bottom-[24px] grid grid-cols-2 gap-2 w-[100%] p-4">
            <button 
              className="text-white rounded-[8px] bg-[#1b1b1b] hover:bg-[#363636] active:bg-[#1b1b1b] flex flex-row px-4 py-3 items-center justify-center gap-2"
              onClick={handleCancel}
            >
              <span className="text-[24px] h-[24px] w-[24px] ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm37.7,130.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0L128,139.3l-26.3,26.4a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L116.7,128,90.3,101.7a8.1,8.1,0,0,1,11.4-11.4L128,116.7l26.3-26.4a8.1,8.1,0,0,1,11.4,11.4L139.3,128Z"></path></svg>
              </span>
              <div className="font-bold">Cancel</div>
            </button>
            <button 
              className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
              onClick={(e) => {saveWalletHistory();}}
              disabled={isValid == false}
            >
              <span className="text-[24px] h-[24px] w-[24px] ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
              </span>
              <div className="font-bold">Approve</div>
            </button>
          </div>
        </div>
        
        {/* <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
    
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
          </div>
          <div className=" overflow-scroll max-h-[450px] p-4">
            <Column>
              {detailsComponent}

              {isValidData && (
                <Column gap="xl">
                  <Column>
                    <Text text="INPUTS:" preset="bold" color="white"/>
                    <Card>
                      <Column full justifyCenter>
                        {txInfo.decodedPsbt.inputInfos.map((v, index) => {
                          const isToSign = address == v.address;
                          const inscriptions = v.inscriptions;
                          return (
                            <Row
                              key={'output_' + index}
                              style={index === 0 ? {} : { borderColor: colors.border, borderTopWidth: 1, paddingTop: 10 }}
                              itemsCenter>
                              <Column fullX>
                                <Row fullX justifyBetween>
                                  <Column>
                                    <Row>
                                      <AddressText address={v.address} color={isToSign ? 'white' : 'grey'} />
                                      {isToSign && (
                                        <Row style={{ borderWidth: 1, borderColor: 'gold', borderRadius: 5, padding: 2 }}>
                                          <Text text="to sign" color="gold" size="xs" />
                                        </Row>
                                      )}
                                    </Row>
                                  </Column>
                                  <Row>
                                    <Text text={`${satoshisToAmount(v.value)}`} color={isToSign ? 'white' : 'grey'} />
                                    <Text text="LTC" color="grey" />
                                  </Row>
                                </Row>

                                <Row>
                                  {inscriptions.length > 0 && (
                                    <Column justifyCenter>
                                      <Text
                                        text={`Inscriptions (${inscriptions.length})`}
                                        color={isToSign ? 'white' : 'textDim'}
                                      />
                                      <Row overflowX gap="lg" style={{ width: 280 }} pb="lg">
                                        {inscriptions.map((v) => (
                                          <InscriptionPreview
                                            key={v.inscriptionId}
                                            data={v}
                                            preset="small"
                                            onClick={() => {
                                              window.open(v.preview);
                                            }}
                                          />
                                        ))}
                                      </Row>
                                    </Column>
                                  )}
                                </Row>
                              </Column>
                            </Row>
                          );
                        })}
                      </Column>
                    </Card>
                  </Column>

                  <Column>
                    <Text text="OUTPUTS:" preset="bold" />
                    <Card>
                      <Column full justifyCenter gap="lg">
                        {txInfo.decodedPsbt.outputInfos.map((v, index) => {
                          const isToSign = address == v.address;
                          const inscriptions = v.inscriptions;
                          return (
                            <Column
                              key={'output_' + index}
                              style={index === 0 ? {} : { borderColor: colors.border, borderTopWidth: 1, paddingTop: 10 }}>
                              <Column>
                                <Row justifyBetween>
                                  <AddressText address={v.address} color={isToSign ? 'white' : 'grey'} />
                                  <Row>
                                    <Text text={`${isToSign? satoshisToAmount(v.value - walletFeeTotal): satoshisToAmount(v.value)}`} color={isToSign ? 'white' : 'grey'} />
                                    <Text text="LTC" color="grey" />
                                  </Row>
                                </Row>
                              </Column>
                              <Row>
                                {canChanged === false && inscriptions.length > 0 && (
                                  <Column justifyCenter>
                                    <Text
                                      text={`Inscriptions (${inscriptions.length})`}
                                      color={isToSign ? 'white' : 'grey'}
                                    />
                                    <Row overflowX gap="lg" style={{ width: 280 }} pb="lg">
                                      {inscriptions.map((v) => (
                                        <InscriptionPreview
                                          key={v.inscriptionId}
                                          data={v}
                                          preset="small"
                                          onClick={() => {
                                            window.open(v.preview);
                                          }}
                                        />
                                      ))}
                                    </Row>
                                  </Column>
                                )}
                              </Row>
                            </Column>
                          );
                        })}
                      </Column>
                    </Card>
                  </Column>

                  {canChanged == false && (
                    <Section title="NETWORK FEE:">
                      <Text text={networkFee} color="white"/>
                      <Text text="LTC" color="grey" />
                    </Section>
                  )}

                  {canChanged == false && (
                    <Section title="NETWORK FEE RATE:">
                      <Text text={txInfo.decodedPsbt.feeRate.toString()} color="white"/>
                      <Text text="lit/vB" color="grey" />
                    </Section>
                  )}
                </Column>
              )}

              {isValidData && txInfo.rawtx && (
                <Column>
                  <Text text={`HEX DATA: ${txInfo.rawtx.length / 2} BYTES`} preset="bold" />

                  <TextArea text={txInfo.rawtx} />

                  <Row
                    justifyCenter
                    onClick={(e) => {
                      copyToClipboard(txInfo.rawtx).then(() => {
                        tools.toastSuccess('Copied');
                      });
                    }}>
                    <Icon icon="copy" color="grey" />
                    <Text text="Copy raw transaction data" color="grey" />
                  </Row>
                </Column>
              )}

              {isValidData && txInfo.psbtHex && (
                <Column>
                  <Text text={`PSBT HEX DATA: ${txInfo.psbtHex.length / 2} BYTES`} preset="bold" />

                  <TextArea text={txInfo.psbtHex} />
                  <Row
                    justifyCenter
                    onClick={(e) => {
                      copyToClipboard(txInfo.psbtHex).then(() => {
                        tools.toastSuccess('Copied');
                      });
                    }}>
                    <Icon icon="copy" color="grey" />
                    <Text text="Copy psbt transaction data" color="grey" />
                  </Row>
                </Column>
              )}
            </Column>
          </div>
          <div className="absolute bottom-0 p-4 grid grid-cols-2 gap-2 w-[100%]">
            <button className=" bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] p-4 text-[20px] font-bold text-white" onClick={handleCancel}>
              Reject
            </button>
            <button 
              className=" bg-[#004BFF] hover:bg-[#2565e6] rounded-[8px] p-4 text-[20px] font-bold text-white"
              onClick={handleConfirm}
              disabled={isValid == false}
            >
              {type == TxType.SIGN_TX ? 'Sign' : 'Sign & Pay'}
            </button>
          </div>
        </div> */}
      </Content>
    </Layout>
  );
}

/*
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
    </div>
    <div className=" overflow-scroll max-h-[450px] p-4">
      <Column>
        {detailsComponent}

        {isValidData && (
          <Column gap="xl">
            <Column>
              <Text text="INPUTS:" preset="bold" color="white"/>
              <Card>
                <Column full justifyCenter>
                  {txInfo.decodedPsbt.inputInfos.map((v, index) => {
                    const isToSign = address == v.address;
                    const inscriptions = v.inscriptions;
                    return (
                      <Row
                        key={'output_' + index}
                        style={index === 0 ? {} : { borderColor: colors.border, borderTopWidth: 1, paddingTop: 10 }}
                        itemsCenter>
                        <Column fullX>
                          <Row fullX justifyBetween>
                            <Column>
                              <Row>
                                <AddressText address={v.address} color={isToSign ? 'white' : 'grey'} />
                                {isToSign && (
                                  <Row style={{ borderWidth: 1, borderColor: 'gold', borderRadius: 5, padding: 2 }}>
                                    <Text text="to sign" color="gold" size="xs" />
                                  </Row>
                                )}
                              </Row>
                            </Column>
                            <Row>
                              <Text text={`${satoshisToAmount(v.value)}`} color={isToSign ? 'white' : 'grey'} />
                              <Text text="LTC" color="grey" />
                            </Row>
                          </Row>

                          <Row>
                            {inscriptions.length > 0 && (
                              <Column justifyCenter>
                                <Text
                                  text={`Inscriptions (${inscriptions.length})`}
                                  color={isToSign ? 'white' : 'textDim'}
                                />
                                <Row overflowX gap="lg" style={{ width: 280 }} pb="lg">
                                  {inscriptions.map((v) => (
                                    <InscriptionPreview
                                      key={v.inscriptionId}
                                      data={v}
                                      preset="small"
                                      onClick={() => {
                                        window.open(v.preview);
                                      }}
                                    />
                                  ))}
                                </Row>
                              </Column>
                            )}
                          </Row>
                        </Column>
                      </Row>
                    );
                  })}
                </Column>
              </Card>
            </Column>

            <Column>
              <Text text="OUTPUTS:" preset="bold" />
              <Card>
                <Column full justifyCenter gap="lg">
                  {txInfo.decodedPsbt.outputInfos.map((v, index) => {
                    const isToSign = address == v.address;
                    const inscriptions = v.inscriptions;
                    return (
                      <Column
                        key={'output_' + index}
                        style={index === 0 ? {} : { borderColor: colors.border, borderTopWidth: 1, paddingTop: 10 }}>
                        <Column>
                          <Row justifyBetween>
                            <AddressText address={v.address} color={isToSign ? 'white' : 'grey'} />
                            <Row>
                              <Text text={`${isToSign? satoshisToAmount(v.value - walletFeeTotal): satoshisToAmount(v.value)}`} color={isToSign ? 'white' : 'grey'} />
                              <Text text="LTC" color="grey" />
                            </Row>
                          </Row>
                        </Column>
                        <Row>
                          {canChanged === false && inscriptions.length > 0 && (
                            <Column justifyCenter>
                              <Text
                                text={`Inscriptions (${inscriptions.length})`}
                                color={isToSign ? 'white' : 'grey'}
                              />
                              <Row overflowX gap="lg" style={{ width: 280 }} pb="lg">
                                {inscriptions.map((v) => (
                                  <InscriptionPreview
                                    key={v.inscriptionId}
                                    data={v}
                                    preset="small"
                                    onClick={() => {
                                      window.open(v.preview);
                                    }}
                                  />
                                ))}
                              </Row>
                            </Column>
                          )}
                        </Row>
                      </Column>
                    );
                  })}
                </Column>
              </Card>
            </Column>

            {canChanged == false && (
              <Section title="NETWORK FEE:">
                <Text text={networkFee} color="white"/>
                <Text text="LTC" color="grey" />
              </Section>
            )}

            {canChanged == false && (
              <Section title="NETWORK FEE RATE:">
                <Text text={txInfo.decodedPsbt.feeRate.toString()} color="white"/>
                <Text text="lit/vB" color="grey" />
              </Section>
            )}
          </Column>
        )}

        {isValidData && txInfo.rawtx && (
          <Column>
            <Text text={`HEX DATA: ${txInfo.rawtx.length / 2} BYTES`} preset="bold" />

            <TextArea text={txInfo.rawtx} />

            <Row
              justifyCenter
              onClick={(e) => {
                copyToClipboard(txInfo.rawtx).then(() => {
                  tools.toastSuccess('Copied');
                });
              }}>
              <Icon icon="copy" color="grey" />
              <Text text="Copy raw transaction data" color="grey" />
            </Row>
          </Column>
        )}

        {isValidData && txInfo.psbtHex && (
          <Column>
            <Text text={`PSBT HEX DATA: ${txInfo.psbtHex.length / 2} BYTES`} preset="bold" />

            <TextArea text={txInfo.psbtHex} />
            <Row
              justifyCenter
              onClick={(e) => {
                copyToClipboard(txInfo.psbtHex).then(() => {
                  tools.toastSuccess('Copied');
                });
              }}>
              <Icon icon="copy" color="grey" />
              <Text text="Copy psbt transaction data" color="grey" />
            </Row>
          </Column>
        )}
      </Column>
    </div>
    <div className="absolute bottom-0 p-4 grid grid-cols-2 gap-2 w-[100%]">
      <button className=" bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] p-4 text-[20px] font-bold text-white" onClick={handleCancel}>
        Reject
      </button>
      <button 
        className=" bg-[#004BFF] hover:bg-[#2565e6] rounded-[8px] p-4 text-[20px] font-bold text-white"
        onClick={handleConfirm}
        disabled={isValid == false}
      >
        {type == TxType.SIGN_TX ? 'Sign' : 'Sign & Pay'}
      </button>
    </div>
  </div>
*/
