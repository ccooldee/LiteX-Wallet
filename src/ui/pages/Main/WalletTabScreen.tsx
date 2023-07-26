import { Tooltip } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { KEYRING_TYPE } from '@/shared/constant';
import { TokenBalance, NetworkType, Inscription, WalletHistory } from '@/shared/types';
import { Card, Column, Content, Footer, Icon, Layout, Row, Text, Image } from '@/ui/components';
import { Header, ReceiveAddressModal } from '@/ui/components/@New';
import { useAccountAddress } from '@/ui/state/accounts/hooks';
import { copyToClipboard, shortAddress, balanceToSixDecimalDigit } from '@/ui/utils';
import AccountSelect from '@/ui/components/AccountSelect';
import { useTools } from '@/ui/components/ActionComponent';
import { AddressBar } from '@/ui/components/AddressBar';
import BRC20BalanceCard from '@/ui/components/BRC20BalanceCard';
import { Button } from '@/ui/components/Button';
import { Empty } from '@/ui/components/Empty';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { Pagination } from '@/ui/components/Pagination';
import { TabBar } from '@/ui/components/TabBar';
import { MainTabBar } from '@/ui/components/MainTabBar';
import { UpgradePopver } from '@/ui/components/UpgradePopver';
import { getCurrentTab } from '@/ui/features/browser/tabs';
import { useAccountBalance, useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { colors, ColorTypes } from '@/ui/theme/colors';
import { useHistory } from '@/ui/state/keyrings/hooks';
import {
  useBlockstreamUrl,
  useNetworkType,
  useSkipVersionCallback,
  useVersionInfo,
  useWalletConfig
} from '@/ui/state/settings/hooks';
import { useWalletTabScreenState } from '@/ui/state/ui/hooks';
import { WalletTabScreenTabKey, uiActions } from '@/ui/state/ui/reducer';
import { fontSizes } from '@/ui/theme/font';
import { useWallet } from '@/ui/utils';
import { LoadingOutlined } from '@ant-design/icons';

import { useNavigate } from '../MainRoute';
import { keyringsActions } from '@/ui/state/keyrings/reducer';

export default function WalletTabScreen() {
  const navigate = useNavigate();

  const accountBalance = useAccountBalance();
  const networkType = useNetworkType();
  const isTestNetwork = networkType === NetworkType.TESTNET;

  const currentKeyring = useCurrentKeyring();
  const currentAccount = useCurrentAccount();
  const balanceValue = useMemo(() => {
    if (accountBalance.amount === '0') {
      return '--';
    } else {
      return accountBalance.amount;
    }
  }, [accountBalance.amount]);

  const wallet = useWallet();
  const address = useAccountAddress();
  const [connected, setConnected] = useState(false);
  const [showAccountSetting, setShowAccountSetting] = useState(false);
  const [showInscriptions, setShowInscriptions] = useState(0);
  const [ltcMargin, setLtcMargin] = useState('---');
  const [ltcChange, setLtcChange] = useState('---');
  const [showReceiveAddressModal, setShowReceiveAddressModal] = useState(false);
  const [balanceAmount, setBalanceAmount] = useState('0');

  const dispatch = useAppDispatch();
  const { tabKey } = useWalletTabScreenState();

  const skipVersion = useSkipVersionCallback();

  const walletConfig = useWalletConfig();
  const versionInfo = useVersionInfo();
  const tools = useTools();
  const [intervalId, setIntervalId] = useState(-1);
  const history = useHistory();

  useEffect(() => {
    const run = async () => {

      const activeTab = await getCurrentTab();
      if (!activeTab) return;
      const site = await wallet.getCurrentConnectedSite(activeTab.id);
      if (site) {
        setConnected(site.isConnected);
      }
      const options = { headers: { 'x-access-token': 'coinranking61986e38c3657096aa3eba35483e626a177c707f10cdead0', }, }; 
      let response = await fetch('https://api.coinranking.com/v2/coin/D7B1x_ks7WhV5/history', options) ;
      response = await(response.json());
      response = response['data'];
      if (response['change'] >= 0)
        setLtcChange(`+${response['change']} %`);
      else
        setLtcChange(`-${Math.abs(response['change'])} %`);

      let margin = response['change'] * response['history'][0]['price'] /100 * parseFloat(accountBalance.amount);
      margin = parseFloat(margin.toFixed(2));
      /*
      if (margin >= 0)
        setLtcMargin(`+${margin} $`);
      else
        setLtcMargin(`-${margin} $`);
      */
      margin = parseFloat(response['history'][0]['price']);
      console.log(margin);
      setLtcMargin(`${margin.toFixed(2)} $`);
    };
    run();
    
    return () => {
      if (intervalId !== null){
        clearInterval(intervalId);
      }
    };
    
  }, []);


  useEffect(() => {
    getBalance();
    if (intervalId !== -1){
      clearInterval(intervalId);
    }
    const newIntervalId = setInterval(async () => {
      getBalance();
    }, 5000);
    setIntervalId(newIntervalId);
  }, [address]);

  const getBalance = async () => {
    let response = await fetch(`https://litescribe.io/api/address/balance?address=${address}`);
    response = await (response.json());
    setBalanceAmount(response.result.amount);
  }

  const tabItems = [
    {
      key: WalletTabScreenTabKey.ALL,
      label: 'ALL',
      children: <InscriptionList />
    },
    {
      key: WalletTabScreenTabKey.BRC20,
      label: 'LTC-20',
      children: <BRC20List />
    }
  ];

  const blockstreamUrl = useBlockstreamUrl();

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <Header />
          {
            (showInscriptions === 0) && 
            <>
              <div className="flex flex-col justify-center items-center pt-[32px] mb-4" style={{backgroundImage: ' linear-gradient(rgba(76, 234, 172, 0.1) 16.47%, rgba(217, 217, 217, 0) 94.17%)'}}>
                <Tooltip
                  color='#424242'
                  title={
                    <span className="bg-[#424242]">
                      <Row justifyBetween>
                        <span>{'LTC Balance'}</span>
                        <span>{` ${accountBalance.btc_amount} LTC`}</span>
                      </Row>
                      <Row justifyBetween>
                        <span>{'Inscription Balance'}</span>
                        <span>{` ${accountBalance.inscription_amount} LTC`}</span>
                      </Row>
                    </span>
                  }
                  overlayStyle={{
                    fontSize: fontSizes.xs,
                    color: 'white'
                  }}>
                  <div className="font-bold text-white text-[40px]">{balanceToSixDecimalDigit(balanceAmount) + '  LTC'}</div>
                </Tooltip>
                <div className="flex flex-row gap-2 items-center">
                  <div className="text-white text-[14px] font-semibold">
                    {ltcMargin}
                  </div>
                  <div className="rounded-full bg-[#4cd9ac] text-black text-[12px] px-2">
                    {ltcChange}
                  </div>
                </div>
                <div className="social-button-group mt-[24px]">
                  <Tooltip
                    color='#424242'
                    title= 'Copy address'
                    overlayStyle={{
                      fontSize: fontSizes.xs,
                      color: 'white'
                    }}>
                    <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
                      <button 
                        className="social-button"
                        onClick={(e) => {
                          copyToClipboard(address).then(() => {
                            tools.toastSuccess('Copied');
                          });
                        }}
                      >
                        <span className="anticon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><rect x="40" y="72" width="144" height="144" opacity="0.2"></rect><polyline points="216 184 216 40 72 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><rect x="40" y="72" width="144" height="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect></svg>
                        </span>
                      </button>
                    </div>
                  </Tooltip>
                  <Tooltip
                    color='#424242'
                    title= 'Send token'
                    overlayStyle={{
                      fontSize: fontSizes.xs,
                      color: 'white'
                    }}>
                    <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
                      <button 
                        className="social-button"
                        onClick={(e) => {
                          navigate('TxCreateScreen');
                        }}
                      >
                        <span className="anticon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg></span>
                      </button>
                    </div>
                  </Tooltip>
                  <Tooltip
                    color='#424242'
                    title= 'Receive token'
                    overlayStyle={{
                      fontSize: fontSizes.xs,
                      color: 'white'
                    }}>
                    <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
                      <button 
                        className="social-button"
                        onClick={(e) => {
                          navigate('ReceiveScreen');
                          //setShowReceiveAddressModal(true);
                        }}
                      >
                        <span className="anticon"><svg style={{transform: 'rotate(180deg)'}} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg></span>
                      </button>
                    </div>
                  </Tooltip>
                </div>
              </div>
              {/* <div className="flex flex-col gap-2 p-4">
                <div className="flex flex-col gap-4">
                  <div 
                    className="bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] p-4 flex flex-row justify-between items-center cursor-pointer"
                    onClick={()=>{
                      navigate('AllInscriptionScreen');
                    }}
                  >
                    <div className="text-white font-semibold text-[20px]">
                        ALL Inscriptions
                    </div>
                    <span className="flex anticon text-white/[0.45] font-bold text-[20px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div 
                    className="bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] p-4 flex flex-row justify-between items-center cursor-pointer"
                    onClick={()=>{
                      navigate('LtcInscriptionScreen');
                    }}
                  >
                    <div className="text-white font-semibold text-[20px]">
                        LTC20 Inscriptions
                    </div>
                    <span className="flex anticon text-white/[0.45] font-bold text-[20px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                    </span>
                  </div>
                </div>
              </div> */}
            </>
          }
          {
            (showInscriptions === 1) && 
            <div className="flex flex-col px-4">
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row items-center w-[100%] py-2">
                  <span 
                    className="flex-none anticon text-[24px] mt-[6px] font-semibold"
                    onClick={() => {
                      setShowInscriptions(0);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                  </span>
                  <div className="grow flex flex-row justify-center text-[24px] font-semibold">All Inscriptions</div>
                </div>
              </div>
              <div className="max-h-[400px] w-[100%] overflow-scroll">
                <InscriptionList />
              </div>
            </div>
          }
          {
            (showInscriptions === 2) && 
            <div className="flex flex-col px-4">
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row items-center w-[100%] py-2">
                  <span 
                    className="flex-none anticon text-[24px] mt-[6px] font-semibold"
                    onClick={() => {
                      setShowInscriptions(0);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                  </span>
                  <div className="grow flex flex-row justify-center text-[24px] font-semibold">LTC20 Inscriptions</div>
                </div>
              </div>
              <div className="max-h-[400px] w-[100%] overflow-scroll">
                <BRC20List />
              </div>
            </div>
          }
          <div className="absolute h-[72px] bottom-0 w-[100%] rounded-t-[16px] bg-[#1a1a1a] p-2">
            <NavTabBar tab="Wallet" />
          </div>
          {
            showReceiveAddressModal && <ReceiveAddressModal />
          }
        </div>
      </Content>
    </Layout>
  );
}

function InscriptionList() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();

  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [total, setTotal] = useState(-1);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 4 });

  const tools = useTools();

  const fetchData = async () => {
    try {
      // tools.showLoading(true);
      const { list, total } = await wallet.getAllInscriptionList(
        currentAccount.address,
        pagination.currentPage,
        pagination.pageSize
      );
      setInscriptions(list);
      setTotal(total);
    } catch (e) {
      tools.toastError((e as Error).message);
    } finally {
      // tools.showLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  if (total === -1) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <LoadingOutlined style={{color: colors.blues}}/>
      </Column>
    );
  }

  if (total === 0) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <div className="flex flex-col p-4 mt-4 gap-2 justify-center items-center w-[100%]">
          <div className="flex flex-row items-center justify-center w-[112px] h-[112px] rounded-full relative">
            <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[112px] h-[112px] bg-[#737373] opacity-[0.1] rounded-full">
            </div>
            <span className="text-[64px] text-[#939393]">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,100h0a12,12,0,0,1-12,12,12,12,0,0,1-12-12,12,12,0,0,1,24,0Zm64-44V184h0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V168h0V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,164.7V56H40v92.7L76.7,112a16.1,16.1,0,0,1,22.6,0L144,156.7,164.7,136a16.1,16.1,0,0,1,22.6,0Z"></path></svg>
            </span>
          </div>
          <div className="text-white/[0.85] text-[16px] font-semibold">
            No DATA
          </div>
        </div>
      </Column>
    );
  }

  return (
    <Column>
      <div className="grid grid-cols-2 gap-2">
        {inscriptions.map((data, index) => (
          <InscriptionPreview
            key={index}
            data={data}
            preset="medium"
            onClick={() => {
              navigate('OrdinalsDetailScreen', { inscription: data, withSend: true });
            }}
          />
        ))}
      </div>
      <Row justifyCenter mt="lg">
        <Pagination
          pagination={pagination}
          total={total}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
        />
      </Row>
    </Column>
  );
}

function BRC20List() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();

  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [total, setTotal] = useState(-1);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 100 });

  const tools = useTools();
  const fetchData = async () => {
    try {
      // tools.showLoading(true);
      const { list, total } = await wallet.getBRC20List(
        currentAccount.address,
        pagination.currentPage,
        pagination.pageSize
      );
      setTokens(list);
      setTotal(total);
    } catch (e) {
      tools.toastError((e as Error).message);
    } finally {
      // tools.showLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  if (total === -1) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <LoadingOutlined style={{color: colors.blues}}/>
      </Column>
    );
  }

  if (total === 0) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <div className="flex flex-col p-4 mt-4 gap-2 justify-center items-center w-[100%]">
          <div className="flex flex-row items-center justify-center w-[112px] h-[112px] rounded-full relative">
            <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[112px] h-[112px] bg-[#737373] opacity-[0.1] rounded-full">
            </div>
            <span className="text-[64px] text-[#939393]">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,100h0a12,12,0,0,1-12,12,12,12,0,0,1-12-12,12,12,0,0,1,24,0Zm64-44V184h0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V168h0V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,164.7V56H40v92.7L76.7,112a16.1,16.1,0,0,1,22.6,0L144,156.7,164.7,136a16.1,16.1,0,0,1,22.6,0Z"></path></svg>
            </span>
          </div>
          <div className="text-white/[0.85] text-[16px] font-semibold">
            No DATA
          </div>
        </div>
      </Column>
    );
  }

  return (
    <Column>
      <div className="grid grid-cols-2 gap-2">
        {tokens.map((data, index) => (
          <BRC20BalanceCard
            key={index}
            tokenBalance={data}
            onClick={() => {
              navigate('BRC20TokenScreen', { tokenBalance: data, ticker: data.ticker });
            }}
          />
        ))}
      </div>

      <Row justifyCenter mt="lg">
        <Pagination
          pagination={pagination}
          total={total}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
        />
      </Row>
    </Column>
  );
}

