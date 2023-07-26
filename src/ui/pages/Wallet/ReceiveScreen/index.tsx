import QRCode from 'qrcode.react';

import { Content, Text, AddressBar, Icon, Layout, Column, Row } from '@/ui/components';
import { Header } from '@/ui/components/@New'
import { useAccountAddress, useCurrentAccount } from '@/ui/state/accounts/hooks';
import { sizes } from '@/ui/theme/spacing';

import './index.less';

export default function ReceiveScreen() {
  const currentAccount = useCurrentAccount();
  const address = useAccountAddress();

  const qrCodeOptions = {
    renderAs: 'svg',
    size: sizes.qrcode,
    imageSettings: {
      src: './images/logo/logo@128x.png', // Replace with the URL of your image
      height: 45, // Adjust the size of the logo as needed
      width: 45,
      excavate: true // This removes the dark squares in the QR code where the logo is placed
    }
  };

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
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
            </div>
          </div>
          <div className="flex flex-col gap-4 items-center justify-center mt-4">
            <div className="flex flex-col justify-center items-center">
              <img src='./images/logo/wallet-logo.png' className="w-[60px] h-[60px]"></img>
              <div className="text-[36px] text-white">
                Receive LTC
              </div>
              <div className="text-[20px] text-white/[0.65]">
                on litecoin network
              </div>
            </div>
            <Column
              justifyCenter
              rounded
              style={{ backgroundColor: 'white', alignSelf: 'center', alignItems: 'center', padding: 10 }}>
              <QRCode
                value={address || ''}
                renderAs={'svg' as const} // Specify the type as "svg"
                size={qrCodeOptions.size}
                level={'M' as const}
                imageSettings={qrCodeOptions.imageSettings}
              />
            </Column>
            <div className="py-2 px-4 rounded-lg border-solid border-[1px] border-white/[0.45]">
              <AddressBar />
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

/*
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <Header />
          <div className="flex flex-col justify-center items-center pt-[32px]">
            
          </div>
          <div className="absolute h-[72px] bottom-0 w-[100%] rounded-t-[16px] bg-[#1a1a1a] p-2">
            <NavTabBar tab="Wallet" />
          </div>
        </div>
      </Content>

*/ 