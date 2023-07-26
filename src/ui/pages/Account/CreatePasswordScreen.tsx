import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button, Column, Content, Input, Layout, Text } from '@/ui/components';
import { AddressType, RestoreWalletType } from '@/shared/types';
import { PasswordInput } from '@/ui/components/@New';
import { useTools } from '@/ui/components/ActionComponent';
import { useWallet, useWalletRequest } from '@/ui/utils';
import { CSSProperties } from 'react';

import { useNavigate } from '../MainRoute';

type Status = '' | 'error' | 'warning' | undefined;

const $disabledButtonStyle: CSSProperties = Object.assign({}, {
  backgroundColor: '#0031a6',
  color: 'rgba(255, 255, 255, 0.3)',
  cursor: 'not-allowed'
} as CSSProperties);

export default function CreatePasswordScreen() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const { state } = useLocation();
  const { isNewAccount, walletType } = state as { isNewAccount: boolean, walletType: RestoreWalletType };

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [status, setStatus] = useState('empty');
  const [status2, setStatus2] = useState('empty');

  const [disabled, setDisabled] = useState(true);
  const [buttonStyle, setButtonStyle] = useState($disabledButtonStyle)

  const tools = useTools();
  const [run, loading] = useWalletRequest(wallet.boot, {
    onSuccess() {
      if (isNewAccount) {
        navigate('CreateHDWalletScreen', { isImport: false, fromUnlock: true , walletType: walletType});
      } else {
        navigate('CreateHDWalletScreen', { isImport: true, fromUnlock: true, walletType: walletType });
      }
    },
    onError(err) {
      tools.toastError(err);
    }
  });

  const btnClick = () => {
    run(password.trim());
  };

  const verify = (pwd2: string) => {
    if (pwd2 && pwd2 !== password) {
      tools.toastWarning('Entered passwords differ');
    }
  };

  useEffect(() => {
    //console.log(disabled);
    if (disabled) setButtonStyle($disabledButtonStyle)
    else setButtonStyle(Object.assign({}))
  }, [disabled]);

  useEffect(()=> {
    if (status2 === 'complete') setDisabled(false)
  },[password, password2])

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled && 'Enter' == e.key) {
      btnClick();
    }
  };

  return (
    <Layout>
      <Content preset="middle">
        <div className="bg-[#0c0c0c] w-[100%] h-[100%]">
          <div className="py-2 flex flex-row items-center justify-between relative min-h-[40px] h-max-content">
            {/*header left part*/}
            <div className="flex-shrink-1 ml-2">
              <button 
                className="ant-btn min-w-[40px] bg-transparent text-white px-2 h-[40px] inline-flex font-semibold cursor-pointer items-center content-center whitespace-nowrap"
                onClick={() => {
                  window.history.go(-1);
                }}
              >
                <span className="anticon inline-flex items-center content-center text-[24px] text-center text-inherit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
                </span>
              </button>
            </div>
            {/*header center part*/}
            <div className="absolute content-center top-0 left-0 bottom-0 right-0 m-auto w-[246px] pr-0 flex flex-row flex-1 items-center overflow-hidden">
              <div className=" content-center overflow-hidden whitespace-nowrap w-[100%] flex">
                <span className=" text-white font-semibold text-[20px] text-center leading-5 align-baseline inline-block max-w-[100%] overflow-hidden whitespace-nowrap text-ellipsis m-auto">Create a password</span>
              </div>
            </div>
            {/*header right part*/}
            <div className="flex-shrink-1 mr-2">
              <button 
                className="ant-btn min-w-[40px] bg-transparent text-white px-2 h-[40px] inline-flex font-semibold cursor-pointer items-center content-center whitespace-nowrap"
              >
                <span className="anticon inline-flex items-center content-center text-[24px] text-center text-inherit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle><polyline points="120 120 128 120 128 176 136 176" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><circle cx="126" cy="84" r="12"></circle></svg>
                </span>
              </button>
            </div>
          </div>
          <div className="px-4 text-center">
            <div className="flex justify-center mt-4 text-page-icon-color text-center">
              <div className="p-6 rounded-[50%] relative overflow-hidden w-min text-page-icon-color ">
                <div className="absolute w-[100%] h-[100%] bg-[#4cd9ac] opacity-[0.1] rounded-[50%] left-0 top-0"></div>
                <span className="anticon text-page-icon-color w-[64px] h-[64px] text-[64px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M208,40H48A16,16,0,0,0,32,56v58.7c0,89.4,75.8,119.1,91,124.1a16,16,0,0,0,10,0c15.2-5,91-34.7,91-124.1V56A16,16,0,0,0,208,40Zm-48,96H136v24a8,8,0,0,1-16,0V136H96a8,8,0,0,1,0-16h24V96a8,8,0,0,1,16,0v24h24a8,8,0,0,1,0,16Z"></path></svg>
                </span>
              </div>
            </div>
            <div className="mt-4 mb-8 font-semibold text-[24px] text-white leading-tight">
              Create a Password
            </div>
            {/* Custom password input box*/}
            <PasswordInput placeholder="Enter password" label='Password' status = {status} setStatus = {setStatus} inputValue = {password} setInputValue = {setPassword} password={password2} setPassword={setPassword2}/>
            <PasswordInput placeholder="Confirm password" label='Confirm Password' status = {status2} setStatus = {setStatus2} inputValue = {password2} setInputValue = {setPassword2} password={password} setDisabled = {setDisabled}/>
            <div className="bg-[#1A1A1A] rounded-[8px] flex flex-row gap-[10px] py-[14px] pl-3 pr-2 text-start">
              <div className="flex flex-row items-center">
                <div className="w-[32px] h-[32px] rounded-[50%] flex justify-center items-center bg-[#D9C500]/[0.1]">
                  <span className="anticon text-[#D9C500] text-[24px] mt-[3px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm-2,48a12,12,0,1,1-12,12A12,12,0,0,1,126,72Zm10,112h-8a8,8,0,0,1-8-8V128a8,8,0,0,1,0-16h8a8,8,0,0,1,8,8v48a8,8,0,0,1,0,16Z"></path></svg>
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[16px] text-[#D9C500] leading-6">
                  Always choose a strong password!
                </div>
                <div className="text-[14px] leading-6 text-white/[0.45]">
                  Please insert at least 5 characters..
                </div>
              </div>
            </div>
          </div>
          <div className="w-[100%] mt-5 px-4 ">
            <button 
              className="ant-btn text-[14px] text-white bg-[#004bff] w-[100%] rounded-[8px]" 
              disabled={disabled} 
              style={buttonStyle}
              onClick={btnClick}>
              <span className="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
              </span>
              <span className="text-[16px] ml-2 ">Continue</span>
            </button>
          </div>
        </div> 
      </Content>
    </Layout>
  );
}
