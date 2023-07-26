import { useEffect, useMemo, useState } from 'react';
import { Tooltip } from 'antd';

import { AddressTokenSummary } from '@/shared/types';
import { Button, Column, Content, Header, Layout, Row, Text } from '@/ui/components';
import BRC20Preview from '@/ui/components/BRC20Preview';
import { Empty } from '@/ui/components/Empty';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { colors } from '@/ui/theme/colors';
import { useLocationState, useWallet } from '@/ui/utils';

import { useNavigate } from '../MainRoute';
import { fontSizes } from '@/ui/theme/font';

interface LocationState {
  ticker: string;
}

export default function BRC20TokenScreen() {
  const { ticker } = useLocationState<LocationState>();

  const [tokenSummary, setTokenSummary] = useState<AddressTokenSummary>({
    tokenBalance: {
      ticker,
      overallBalance: '',
      availableBalance: '',
      transferableBalance: '',
      availableBalanceSafe: '',
      availableBalanceUnSafe: ''
    },
    tokenInfo: {
      totalSupply: '',
      totalMinted: ''
    },
    historyList: [],
    transferableList: []
  });

  const wallet = useWallet();

  const account = useCurrentAccount();
  useEffect(() => {
    wallet.getBRC20Summary(account.address, ticker).then((tokenSummary) => {
      setTokenSummary(tokenSummary);
    });
  }, []);

  const balance = useMemo(() => {
    if (!tokenSummary) {
      return '--';
    }
    return tokenSummary?.tokenBalance.overallBalance;
  }, [tokenSummary]);

  const navigate = useNavigate();

  const [transferableListExpanded, setTransferableListExpanded] = useState(true);
  const [availableListExpanded, setAvailableListExpanded] = useState(true);

  const outOfMint = tokenSummary.tokenInfo.totalMinted == tokenSummary.tokenInfo.totalSupply;

  const shouldShowSafe = tokenSummary.tokenBalance.availableBalanceSafe !== tokenSummary.tokenBalance.availableBalance;
  return (
    <Layout>
      {tokenSummary && (
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
              <div className="text-[24px] text-white ml-[80px]">LTC20 Detail</div>
            </div>
            <div className="flex flex-col w-[100%] p-2 justify-center items-center">
              <div className="font-bold text-[36px] text-white">{`${balance} ${ticker}`}</div>
            </div>
            <div className="flex flex-col mx-4 justify-center items-center bg-[#1a1a1a] p-3 rounded-[8px]">
              <div className="flex flex-row w-[100%] justify-between mb-2">
                <div className="text-[16px] font-bold text-white">Transferable</div>
                <div className="text-[16px] text-white">{`${tokenSummary.tokenBalance.transferableBalance} ${ticker}`}</div>
              </div>
              {/* {tokenSummary.transferableList.length == 0 && (
                <div className="flex flex-col gap-2 justify-center items-center w-[100%]">
                  <div className="flex flex-row items-center justify-center w-[104px] h-[104px] rounded-full relative">
                    <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[104px] h-[104px] bg-[#737373] opacity-[0.1] rounded-full">
                    </div>
                    <span className="text-[64px] text-[#939393]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,100h0a12,12,0,0,1-12,12,12,12,0,0,1-12-12,12,12,0,0,1,24,0Zm64-44V184h0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V168h0V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,164.7V56H40v92.7L76.7,112a16.1,16.1,0,0,1,22.6,0L144,156.7,164.7,136a16.1,16.1,0,0,1,22.6,0Z"></path></svg>
                    </span>
                  </div>
                  <div className="text-white/[0.85] text-[12px] font-semibold">
                    Empty
                  </div>
                </div>
              )} */}
              {tokenSummary.transferableList.length > 0 && (
                <div className="w-[332px] flex flex-row justify-start overflow-x-scroll gap-2">
                  {tokenSummary.transferableList.map((v) => (
                    <BRC20Preview
                      key={v.inscriptionId}
                      tick={ticker}
                      balance={v.amount}
                      inscriptionNumber={v.inscriptionNumber}
                      timestamp={v.timestamp}
                      type="TRANSFER"
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col mx-4 justify-center items-center bg-[#1a1a1a] p-3 rounded-[8px] mt-4">
              <div className="flex flex-row w-[100%] justify-between mb-2">
                <div className="flex flex-row gap-2">
                  <div className="text-[16px] font-bold text-white">Available</div>
                  <Tooltip
                    color='#424242'
                    title= 'Inscribe Transfer'
                    overlayStyle={{
                      fontSize: fontSizes.xs,
                      color: 'white'
                    }}>
                    <span 
                      className="text-[24px] h-[24px] w-[24px] ml-1 cursor-pointer text-white hover:text-blue-500"
                      onClick={() => {
                        navigate('InscribeTransferScreen', { ticker: ticker });
                      }} 
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                    </span>
                  </Tooltip>
                  
                </div>
                <div className="text-[16px] text-white">{`${tokenSummary.tokenBalance.availableBalance} ${ticker}`}</div>
              </div>
              {/* {tokenSummary.historyList.length == 0 && (
                <div className="flex flex-col gap-2 justify-center items-center w-[100%]">
                  <div className="flex flex-row items-center justify-center w-[104px] h-[104px] rounded-full relative">
                    <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[104px] h-[104px] bg-[#737373] opacity-[0.1] rounded-full">
                    </div>
                    <span className="text-[64px] text-[#939393]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,100h0a12,12,0,0,1-12,12,12,12,0,0,1-12-12,12,12,0,0,1,24,0Zm64-44V184h0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V168h0V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,164.7V56H40v92.7L76.7,112a16.1,16.1,0,0,1,22.6,0L144,156.7,164.7,136a16.1,16.1,0,0,1,22.6,0Z"></path></svg>
                    </span>
                  </div>
                  <div className="text-white/[0.85] text-[12px] font-semibold">
                    Empty
                  </div>
                </div>
              )} */}
              {tokenSummary.historyList.length > 0 && (
                <div>
                  {tokenSummary.historyList.map((v) => (
                    <BRC20Preview
                      key={v.inscriptionId}
                      tick={ticker}
                      balance={v.amount}
                      inscriptionNumber={v.inscriptionNumber}
                      timestamp={v.timestamp}
                      type="MINT"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="absolute bottom-[20px] w-[100%] flex flex-col gap-2 px-4">
              <button 
                onClick={(e) => {
                  // todo
                  //const defaultSelected = tokenSummary.transferableList.slice(0, 1);
                  const defaultSelected = tokenSummary.transferableList;
                  const selectedInscriptionIds = defaultSelected.map((v) => v.inscriptionId);
                  const selectedAmount = defaultSelected.reduce((pre, cur) => parseInt(cur.amount) + pre, 0);
                  navigate('BRC20SendScreen', {
                    tokenBalance: tokenSummary.tokenBalance,
                    selectedInscriptionIds,
                    selectedAmount
                  });
                }}
                className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
              >
                <span className="text-[24px] h-[24px] w-[24px] ml-1">
                  <svg style={{transform: 'rotate(180deg)'}} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                </span>
                <div className="text-[16px] text-white">Transfer</div>
              </button>
            </div>
          </div>
        </Content>
      )}
    </Layout>
  );
}

/*
            <Column py="xl" style={{ borderBottomWidth: 1, borderColor: colors.white_muted }}>
              <Text text={`${balance} ${ticker}`} preset="bold" textCenter size="xxl" />
              <Row justifyBetween mt="lg">
                <Button
                  text="MINT"
                  preset="primary"
                  style={outOfMint ? { backgroundColor: 'grey' } : {}}
                  disabled={outOfMint}
                  icon="pencil"
                  onClick={(e) => {
                    window.open(`https://litescribe.io/ltc20/${encodeURIComponent(ticker)}`);
                  }}
                  full
                />

                <Button
                  text="TRANSFER"
                  preset="primary"
                  icon="send"
                  onClick={(e) => {
                    // todo
                    const defaultSelected = tokenSummary.transferableList.slice(0, 1);
                    const selectedInscriptionIds = defaultSelected.map((v) => v.inscriptionId);
                    const selectedAmount = defaultSelected.reduce((pre, cur) => parseInt(cur.amount) + pre, 0);
                    navigate('BRC20SendScreen', {
                      tokenBalance: tokenSummary.tokenBalance,
                      selectedInscriptionIds,
                      selectedAmount
                    });
                  }}
                  full
                />
              </Row>
            </Column>
            <Column>
              <Row justifyBetween>
                <Text text="Transferable" preset="bold" size="lg" />
                <Text text={`${tokenSummary.tokenBalance.transferableBalance} ${ticker}`} preset="bold" size="lg" />
              </Row>
              {tokenSummary.transferableList.length == 0 && (
                <Column style={{ minHeight: 130 }} itemsCenter justifyCenter>
                  <Empty text="Empty" />
                </Column>
              )}
              {transferableListExpanded ? (
                <Row overflowX>

                  {tokenSummary.transferableList.map((v) => (
                    <BRC20Preview
                      key={v.inscriptionId}
                      tick={ticker}
                      balance={v.amount}
                      inscriptionNumber={v.inscriptionNumber}
                      timestamp={v.timestamp}
                      type="TRANSFER"
                      // onClick={() => {
                      //   navigate('BRC20SendScreen', {
                      //     tokenBalance: tokenSummary.tokenBalance,
                      //     selectedInscriptionIds: [v.inscriptionId]
                      //   });
                      // }}
                    />
                  ))}
                </Row>
              ) : (
                tokenSummary.transferableList.length > 0 && (
                  <BRC20Preview
                    tick={ticker}
                    balance={tokenSummary.transferableList[0].amount}
                    inscriptionNumber={tokenSummary.transferableList[0].inscriptionNumber}
                    timestamp={tokenSummary.transferableList[0].timestamp}
                    onClick={() => {
                      setTransferableListExpanded(true);
                    }}
                  />
                )
              )}
            </Column>

            <Column mt="lg">
              <Row justifyBetween>
                <Text text="Available" preset="bold" size="lg" />
                {shouldShowSafe ? (
                  <Column>
                    <Row gap="zero">
                      <Text text={`${tokenSummary.tokenBalance.availableBalanceSafe}`} preset="bold" size="lg" />
                      <Text text={'+'} preset="bold" size="lg" />
                      <Text
                        text={`${tokenSummary.tokenBalance.availableBalanceUnSafe}`}
                        preset="bold"
                        size="lg"
                        color="textDim"
                      />
                      <Text text={`${ticker}`} preset="bold" size="lg" mx="md" />
                    </Row>
                    <Text text={'(Wait to be confirmed)'} preset="sub" textEnd />
                  </Column>
                ) : (
                  <Text text={`${tokenSummary.tokenBalance.availableBalance} ${ticker}`} preset="bold" size="lg" />
                )}
              </Row>
              {availableListExpanded ? (
                <Row overflowX>

                  {tokenSummary.historyList.map((v) => (
                    <BRC20Preview
                      key={v.inscriptionId}
                      tick={ticker}
                      balance={v.amount}
                      inscriptionNumber={v.inscriptionNumber}
                      timestamp={v.timestamp}
                      type="MINT"
                    />
                  ))}
                </Row>
              ) : (
                tokenSummary.historyList.length > 0 && (
                  <BRC20Preview
                    tick={ticker}
                    balance={tokenSummary.historyList[0].amount}
                    inscriptionNumber={tokenSummary.historyList[0].inscriptionNumber}
                    timestamp={tokenSummary.historyList[0].timestamp}
                    onClick={() => {
                      setAvailableListExpanded(true);
                    }}
                  />
                )
              )}
            </Column>
*/
