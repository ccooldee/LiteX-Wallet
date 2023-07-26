import { useEffect, useState } from 'react';
import { useNavigate } from '../MainRoute';

import { ADDRESS_TYPES, DISCORD_URL, GITHUB_URL, NETWORK_TYPES, TWITTER_URL } from '@/shared/constant';
import { Card, Column, Content, Footer, Header, Layout, Row, Text, Grid } from '@/ui/components';
import { Button } from '@/ui/components/Button';
import { Icon } from '@/ui/components/Icon';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { useExtensionIsInTab, useOpenExtensionInTab } from '@/ui/features/browser/tabs';
import { getCurrentTab } from '@/ui/features/browser/tabs';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { useNetworkType, useVersionInfo } from '@/ui/state/settings/hooks';
import { fontSizes } from '@/ui/theme/font';
import { spacing } from '@/ui/theme/spacing';
import { useWallet } from '@/ui/utils';
import { RightOutlined } from '@ant-design/icons';
import { colors } from '@/ui/theme/colors';

interface Setting {
  label?: string;
  value?: string;
  desc?: string;
  danger?: boolean;
  action: string;
  route: string;
  right: boolean;
  src: string;
}

const SettingList: Setting[] = [
  // {
  //   label: 'Manage Wallet',
  //   value: '',
  //   desc: '',
  //   action: 'manage-wallet',
  //   route: '/settings/manage-wallet',
  //   right: true
  // },

  {
    label: 'Address Type',
    value: 'Taproot',
    desc: '',
    action: 'addressType',
    route: '/settings/address-type',
    right: true,
    src: './images/logo/switch_address.png'
  },

  {
    label: 'Connected Sites',
    value: '',
    desc: '',
    action: 'connected-sites',
    route: '/connected-sites',
    right: true,
    src: './images/logo/connected_site.png'
  },
  {
    label: 'Network',
    value: 'MAINNET',
    desc: '',
    action: 'networkType',
    route: '/settings/network-type',
    right: true,
    src: './images/logo/switch_network.png'
  },

  {
    label: 'Change Password',
    value: 'Change your lockscreen password',
    desc: '',
    action: 'password',
    route: '/settings/password',
    right: true,
    src: './images/logo/change_password.png'
  },
  {
    label: '',
    value: '',
    desc: 'Expand View ',
    action: 'expand-view',
    route: '/settings/export-privatekey',
    right: false,
    src: './images/logo/change_password.png'
  }
];

export default function SettingsTabScreen() {
  const navigate = useNavigate();

  const networkType = useNetworkType();

  const isInTab = useExtensionIsInTab();

  const [connected, setConnected] = useState(false);

  const currentKeyring = useCurrentKeyring();
  const currentAccount = useCurrentAccount();
  const versionInfo = useVersionInfo();

  const wallet = useWallet();
  useEffect(() => {
    const run = async () => {
      const res = await getCurrentTab();
      if (!res) return;
      const site = await wallet.getCurrentConnectedSite(res.id);
      if (site) {
        setConnected(site.isConnected);
      }
    };
    run();
  }, []);

  const toRenderSettings = SettingList.filter((v) => {
    if (v.action == 'manage-wallet') {
      v.value = currentKeyring.alianName;
    }

    if (v.action == 'connected-sites') {
      v.value = connected ? 'Connected' : 'Not connected';
    }

    if (v.action == 'networkType') {
      v.value = NETWORK_TYPES[networkType].label;
    }

    if (v.action == 'addressType') {
      const item = ADDRESS_TYPES[currentKeyring.addressType];
      v.value = `${item.name} (${item.hdPath}/${currentAccount.index})`;
    }

    if (v.action == 'expand-view') {
      if (isInTab) {
        return false;
      }
    }

    return true;
  });

  const openExtensionInTab = useOpenExtensionInTab();

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row justify-between gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
            <div className="text-[20px] text-white">Settings</div>
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line></svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4 pt-[32px] w-[100%] max-h-[540px] overflow-scroll">
            <div className="text-[16px] text-white/[0.65]">General Settings</div>
            <div className="flex flex-col gap-2 w-[100%]">
              <div 
                className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  openExtensionInTab();
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#004bff] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM88,192H56a8,8,0,0,1-8-8V152a8,8,0,0,1,16,0v24H88a8,8,0,0,1,0,16Zm120-88a8,8,0,0,1-16,0V80H168a8,8,0,0,1,0-16h32a8,8,0,0,1,8,8Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Expand View</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="168 48 208 48 208 88" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="152" y1="104" x2="208" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><polyline points="88 208 48 208 48 168" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="104" y1="152" x2="48" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><polyline points="208 168 208 208 168 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="152" y1="152" x2="208" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><polyline points="48 88 48 48 88 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="104" y1="104" x2="48" y2="48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                </span>
              </div>
              <div 
                className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  navigate('ChangePasswordScreen');
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#004bff] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M160,16A80.1,80.1,0,0,0,83.9,120.8L26.3,178.3A8.1,8.1,0,0,0,24,184v40a8,8,0,0,0,8,8H72a8,8,0,0,0,8-8V208H96a8,8,0,0,0,8-8V184h16a8.1,8.1,0,0,0,5.7-2.3l9.5-9.6A80,80,0,1,0,160,16Zm20,76a16,16,0,1,1,16-16A16,16,0,0,1,180,92Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Change wallet password</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </div>
              <div 
                className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  navigate('ExportMnemonicsScreen');
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#9224e1] rounded-full flex-none">
                  <svg className="w-4 h-4 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14"><path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Show seed phrase</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  navigate('AddressTypeScreen');
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#d92070] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,24H72A32.1,32.1,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-24,96-25.6-19.2a3.9,3.9,0,0,0-4.8,0L128,120V40h56Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Manage address type</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  navigate('ConnectedSitesScreen');
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#004bff] rounded-full flex-none">
                  <svg fill="none" height="1em" viewBox="0 0 16 16" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M4.06297 5.59028C6.23731 3.46991 9.76271 3.46991 11.937 5.59028L12.1987 5.84546C12.3075 5.95146 12.3075 6.12336 12.1987 6.22936L11.3036 7.10232C11.2492 7.15532 11.1611 7.15532 11.1067 7.10232L10.7466 6.75115C9.22968 5.27194 6.77033 5.27194 5.25341 6.75115L4.86774 7.12722C4.81337 7.18022 4.72526 7.18022 4.67089 7.12722L3.77572 6.25425C3.66698 6.14826 3.66698 5.97636 3.77572 5.87036L4.06297 5.59028ZM13.7884 7.39562L14.5851 8.17254C14.6939 8.27854 14.6939 8.45044 14.5851 8.55644L10.9926 12.0597C10.8839 12.1657 10.7077 12.1657 10.5989 12.0597L8.04924 9.57336C8.02206 9.54683 7.97801 9.54683 7.95082 9.57336L5.40113 12.0597C5.29244 12.1657 5.11617 12.1657 5.00743 12.0597L1.41488 8.55639C1.30616 8.45039 1.30616 8.27849 1.41488 8.17249L2.2116 7.39556C2.32032 7.28952 2.49658 7.28952 2.6053 7.39556L5.15504 9.88194C5.18223 9.90847 5.22628 9.90847 5.25346 9.88194L7.80311 7.39556C7.9118 7.28952 8.08807 7.28952 8.19681 7.39556L10.7466 9.88194C10.7737 9.90847 10.8178 9.90847 10.845 9.88194L13.3947 7.39562C13.5034 7.28957 13.6797 7.28957 13.7884 7.39562Z" fill="currentColor"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Connected Sites</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%] cursor-pointer"
                onClick = {() => {
                  navigate('NetworkTypeScreen');
                }}
              >
                <span className="anticon flex text-[16px] text-white bg-[#9224e1] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M176,160a39.7,39.7,0,0,0-28.6,12.1l-46.1-29.6a40.3,40.3,0,0,0,0-29l46.1-29.6A40,40,0,1,0,136,56a41,41,0,0,0,2.7,14.5L92.6,100.1a40,40,0,1,0,0,55.8l46.1,29.6A41,41,0,0,0,136,200a40,40,0,1,0,40-40Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Manage networks</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </div> 
            </div>
            <div className="text-[16px] text-white/[0.65]">COMMUNITY & SUPPORT</div>
            <div className="flex flex-col gap-2 w-[100%]">
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'https://twitter.com/LiteXwallet'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#0078d9] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M245.7,77.7l-30.2,30.1C209.5,177.7,150.5,232,80,232c-14.5,0-26.5-2.3-35.6-6.8-7.3-3.7-10.3-7.6-11.1-8.8a8,8,0,0,1,3.9-11.9c.2-.1,23.8-9.1,39.1-26.4a108.6,108.6,0,0,1-24.7-24.4c-13.7-18.6-28.2-50.9-19.5-99.1a8.1,8.1,0,0,1,5.5-6.2,8,8,0,0,1,8.1,1.9c.3.4,33.6,33.2,74.3,43.8V88a48.3,48.3,0,0,1,48.6-48,48.2,48.2,0,0,1,41,24H240a8,8,0,0,1,7.4,4.9A8.4,8.4,0,0,1,245.7,77.7Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Twitter</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'https://discord.gg/QmWUhmXufq'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#4e8afe] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M247.3,169.8l-34-113.2a15.6,15.6,0,0,0-9.2-10.2h-.6l.6-.2A192.4,192.4,0,0,0,169.6,36a8,8,0,0,0-9.4,6.3,7.9,7.9,0,0,0,6.2,9.4c4.5.9,8.9,2,13.2,3.2A8,8,0,0,1,176,70h-.8A185.4,185.4,0,0,0,128,64a181.8,181.8,0,0,0-46.1,5.8,8,8,0,0,1-5.6-14.9h.1c4.3-1.2,8.7-2.3,13.2-3.2a8,8,0,0,0,6.3-9.4A8.1,8.1,0,0,0,86.5,36,191.2,191.2,0,0,0,51.9,46.4a15.6,15.6,0,0,0-9.2,10.2L8.7,169.8a16,16,0,0,0,4.9,16.7,34.7,34.7,0,0,0,2.9,2.5h.1c16.2,13.2,37.5,23.3,61.5,29.1a6.3,6.3,0,0,0,1.9.3,8,8,0,0,0,1.9-15.8,160.3,160.3,0,0,1-31.3-11.1h0a8,8,0,0,1,8.6-13.2c19,8.4,42.9,13.7,68.8,13.7s49.8-5.3,68.8-13.7a8,8,0,0,1,8.6,13.2h0a160.3,160.3,0,0,1-31.3,11.1,8,8,0,0,0,1.9,15.8,6.3,6.3,0,0,0,1.9-.3c24-5.8,45.3-15.9,61.5-29.1h.1a34.7,34.7,0,0,0,2.9-2.5A16,16,0,0,0,247.3,169.8ZM96,156a12,12,0,1,1,12-12A12,12,0,0,1,96,156Zm64,0a12,12,0,1,1,12-12A12,12,0,0,1,160,156Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Discord</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
              <div className="flex flex-row items-center justify-between gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'http://litexwallet.com/'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#005ca6] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M231.3,31.7A16.1,16.1,0,0,0,215,29L30.4,101.5a15.8,15.8,0,0,0-10.1,16.3,16,16,0,0,0,12.8,14.3L80,141.4V200a16,16,0,0,0,9.9,14.8A16.6,16.6,0,0,0,96,216a15.8,15.8,0,0,0,11.3-4.7l26-25.9L172.6,220a16,16,0,0,0,10.5,4,14.2,14.2,0,0,0,5-.8,15.9,15.9,0,0,0,10.7-11.6L236.4,47.4A16,16,0,0,0,231.3,31.7ZM183.2,208l-82.4-72.5L219.5,49.8Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Telegram</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
            </div>
            <div className="text-[16px] text-white/[0.65]">ABOUT WALLET</div>
            <div className="flex flex-col gap-2 w-[100%]">
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'http://litexwallet.com/'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#bf1616] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,40H48A16,16,0,0,0,32,56v58.7c0,89.4,75.8,119.1,91,124.1a16,16,0,0,0,10,0c15.2-5,91-34.7,91-124.1V56A16,16,0,0,0,208,40Zm-30.5,69.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.9,7.9,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Website</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'https://docs.litexwallet.com/'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#2da73f] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,32V192a8,8,0,0,1-8,8H72a16,16,0,0,0-16,16H192a8,8,0,0,1,0,16H48a8,8,0,0,1-8-8V56A32.1,32.1,0,0,1,72,24H208A8,8,0,0,1,216,32Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">User guide</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'https://docs.litexwallet.com/'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#e67143] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M96,208a24.1,24.1,0,0,1,24,24,8,8,0,0,0,16,0,24.1,24.1,0,0,1,24-24h64a16,16,0,0,0,16-16V64a16,16,0,0,0-16-16H176a40,40,0,0,0-40,40v80a8,8,0,0,1-16,0V88A40,40,0,0,0,80,48H32A16,16,0,0,0,16,64V192a16,16,0,0,0,16,16Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Terms of Service</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div>
              <div className="flex flex-row items-center gap-3 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] px-4 py-3 w-[100%]" onClick={() => { window.location.href = 'https://docs.litexwallet.com/'; }}>
                <span className="anticon flex text-[16px] text-white bg-[#004bff] rounded-full flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,24H72A32.1,32.1,0,0,0,40,56V224a8,8,0,0,0,8,8H192a8,8,0,0,0,0-16H56a16,16,0,0,1,16-16H208a8,8,0,0,0,8-8V32A8,8,0,0,0,208,24Zm-24,96-25.6-19.2a3.9,3.9,0,0,0-4.8,0L128,120V40h56Z"></path></svg>
                </span>
                <div className="text-[16px] text-white font-bold grow">Privacy policy</div>
                <span className="anticon flex text-[24px] text-white/[0.45] flex-none">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 100 216 40 156 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><line x1="144" y1="112" x2="216" y2="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M184,144v64a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8h64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
                </span>
              </div> 
            </div>
            <button className="flex flex-row justify-center items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] w-[100%] p-4" onClick={() => {navigate('UnlockScreen');}}>
              <span className="anticon text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,80H172V52a44,44,0,0,0-88,0V80H48A16,16,0,0,0,32,96V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V96A16,16,0,0,0,208,80Zm-80,84a12,12,0,1,1,12-12A12,12,0,0,1,128,164Zm28-84H100V52a28,28,0,0,1,56,0Z"></path></svg>
              </span>
              <div className="white text-[16px] text-bold">Lock</div>
            </button>  
          </div>
        </div>
      </Content>
    </Layout>
  );
}
