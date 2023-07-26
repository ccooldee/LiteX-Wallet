/* eslint-disable quotes */
import {useState} from 'react'
import { Button, Column, Content, Layout, Logo, Row, Text } from '@/ui/components';
import { BackgroundImage } from '@/ui/components/@New'
import { useWallet } from '@/ui/utils';
import { ADDRESS_TYPES, RESTORE_WALLETS } from '@/shared/constant';
import { AddressType, RestoreWalletType } from '@/shared/types';

import { useNavigate } from '../MainRoute';

export default function WelcomeScreen() {
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate();
  const wallet = useWallet();

  return (
    <Layout>
      <Content preset="middle">
        <BackgroundImage/>
        <div className="px-[16px] text-center opacity-[0.999] w-[100%] h-[100%]">
          <div className="mt-[120px] mb-[24px] flex flex-row justify-center">
            <img className="w-[160px]" src="./images/logo/wallet-logo.png"></img>
          </div>
          <div className="mt-[16px] mb-[80px] text-[16px] leading-normal text-white/[.65]">
            Choose how you'd like to set up your wallet
          </div>
          <div className="flex flex-col gap-3 text-[14px]">
            <button 
              className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-0 items-center"
              onClick={async () => {
                const isBooted = await wallet.isBooted();
                if (isBooted) {
                  // navigate('SelectPhraseLengthScreen', { isImport: false });
                  navigate('CreateHDWalletScreen', { isImport: false, fromUnlock: false, walletType: RestoreWalletType.UNISAT });
                } else {
                  navigate('CreatePasswordScreen', { isNewAccount: true, walletType: RestoreWalletType.UNISAT });
                }
              }}
            >
              <span className="text-[24px] h-[24px] w-[24px] ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"></path></svg>
              </span>
              <div className="flex flex-col gap-1 pl-[20px] pr-[8px] py-[11px] text-start">
                <div className="leading-normal text-[15px] text-white">
                  Create a new account
                </div>
                <div className="leading-normal text-[14px] text-white/[.65]">
                  Create a new account with LiteX Wallet
                </div>
              </div>
            </button>
            <button 
              className="text-white rounded-[8px] bg-[#1b1b1b] hover:bg-[#363636] active:bg-[#1b1b1b] flex flex-row px-4 py-0 items-center"
              onClick={async () => {
                const isBooted = await wallet.isBooted();
                /*
                if (isBooted) {
                  // navigate('SelectPhraseLengthScreen', { isImport: true });
                  navigate('CreateHDWalletScreen', { isImport: true, fromUnlock: false });
                } else {
                  navigate('CreatePasswordScreen', { isNewAccount: false });
                }*/
                setShowModal(true);
              }}
            >
              <span className="text-[24px] h-[24px] w-[24px] ml-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M213.7,82.3l-56-56A8.1,8.1,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8.1,8.1,0,0,0,213.7,82.3Zm-52,79.4-28,28a8.2,8.2,0,0,1-11.4,0l-28-28a8.1,8.1,0,0,1,11.4-11.4L120,164.7V120a8,8,0,0,1,16,0v44.7l14.3-14.4a8.1,8.1,0,0,1,11.4,11.4ZM152,88V44l44,44Z"></path></svg>
              </span>
              <div className="flex flex-col gap-1 pl-[20px] pr-[8px] py-[11px] text-start">
                <div className="leading-normal text-[15px] text-white">
                  Import an account
                </div>
                <div className="leading-normal text-[15px] text-white/[.65]">
                  Import an existing account
                </div>
              </div>
            </button>
          </div>
        </div>
        {showModal && <div className=" absolute w-[100%] rounded-t-3xl bottom-0 bg-black transition delay-150 duration-300 ease-in-out">
          <div className="py-4 px-4 flex flex-row justify-between text-white items-center w-[100%] border-solid border-b-[2px] border-[#FDFDFD]/[0.12]">
            <button className="ant-btn px-2" onClick={()=>{setShowModal(false)}}>
              <span className="anticon text-[24px] text-white flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
              </span>
            </button>
            <span className="text-[24px] font-semibold text-white">Import account</span>
            <button className="ant-btn px-2" onClick={()=>{setShowModal(false)}}>
              <span className="anticon text-[24px] text-white flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
              </span>
            </button>
          </div>
          <div className="p-4 flex flex-col gap-2 w-[100%] mb-2">
            {RESTORE_WALLETS.map((item, index) => {
              return (
                <div
                  key={index} 
                  className="w-[100%] h-[50px] bg-[#1A1A1A] rounded-[8px] hover:bg-[#252525] cursor-pointer flex flex-row items-center justify-center font-bold"
                  onClick={async () => {
                    const isBooted = await wallet.isBooted();
                    
                    if (isBooted) {
                      // navigate('SelectPhraseLengthScreen', { isImport: true });
                      navigate('CreateHDWalletScreen', { isImport: true, fromUnlock: false, walletType: item.value });
                    } else {
                      navigate('CreatePasswordScreen', { isNewAccount: false, walletType: item.value });
                    }
                  }}
                >
                  {item.name}
                </div>
              );
            })}
          </div>
        </div>}
      </Content>
    </Layout>
  );
}
