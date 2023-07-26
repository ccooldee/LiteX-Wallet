import React, { useEffect, useState } from 'react';

import { Column, Content, Layout, Row } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { Button } from '@/ui/components/Button';
import { Input } from '@/ui/components/Input';
import { Logo } from '@/ui/components/Logo';
import { Text } from '@/ui/components/Text';
import { useUnlockCallback } from '@/ui/state/global/hooks';
import { getUiType, useWallet } from '@/ui/utils';
import { BackgroundImage } from '@/ui/components/@New'

import { useNavigate } from '../../MainRoute';

export default function UnlockScreen() {
  const wallet = useWallet();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [show, setShow] = useState(false);
  const UIType = getUiType();
  const isInNotification = UIType.isNotification;
  const unlock = useUnlockCallback();
  const tools = useTools();
  const btnClick = async () => {
    // run(password);
    try {
      await unlock(password);
      if (!isInNotification) {
        const hasVault = await wallet.hasVault();
        if (!hasVault) {
          navigate('WelcomeScreen');
          return;
        } else {
          navigate('MainScreen');
          return;
        }
      }
    } catch (e) {
      tools.toastError('PASSWORD ERROR');
    }
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled && 'Enter' == e.key) {
      btnClick();
    }
  };

  useEffect(() => {
    if (password) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [password]);
  return (
    <Layout>
      <Content preset="middle">
        <BackgroundImage/>
        <div className="px-[16px] text-center opacity-[0.999] w-[100%] h-[100%]">
          <div className="mt-[120px] mb-[24px] flex flex-row justify-center">
            <img className="w-[120px]" src="./images/logo/wallet-logo.png"></img>
          </div>
          <div className="mt-4 font-semibold text-[24px] leading-tight text-white">
            Welcome back!
          </div>
          <div className="mt-2 text-[16px] leading-loose text-white/[0.65]">
            Enter your password to unlock wallet
          </div>
          <div 
            className="mt-[60px] flex flex-row items-center px-4 gap-2 relative z-2 bg-[#1A1A1A] mb-4 rounded-[8px] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]">
            <span className="anticon text-white/[0.45]">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M93.2,122.8A70.3,70.3,0,0,1,88,96a72,72,0,1,1,72,72,70.3,70.3,0,0,1-26.8-5.2h0L120,176H96v24H72v24H32V184l61.2-61.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><circle cx="180" cy="76" r="12"></circle></svg>
            </span>
            <input 
              className="ant-input text-[16px]" 
              placeholder="Password" 
              type={show? 'text': 'password'} 
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => handleOnKeyUp(e)}
              autoFocus={true}
            />
            <span 
              className="anticon text-white/[0.45]"
              onClick={
                ()=>{ setShow(!show)}
              }
            >
              {
                show ? <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><circle cx="128" cy="128" r="40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle></svg>: <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="201.1" y1="127.3" x2="224" y2="166.8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="154.2" y1="149.3" x2="161.3" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="101.7" y1="149.2" x2="94.6" y2="189.6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="54.8" y1="127.3" x2="31.9" y2="167" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><path d="M32,104.9C48.8,125.7,79.6,152,128,152s79.2-26.3,96-47.1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
              }
            </span>
          </div>
          <Button disabled={disabled} text="Unlock" preset="primary" onClick={btnClick} style={{padding:'24px'}}/>
        </div>
        {/* <Column fullX>
          <Row justifyCenter>
            <Logo preset="large" />
          </Row>

          <Column gap="xl" mt="xxl">
            <Text preset="title-bold" text="Enter your password" textCenter />
            <Input
              preset="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => handleOnKeyUp(e)}
              autoFocus={true}
            />
            <Button disabled={disabled} text="Unlock" preset="primary" onClick={btnClick} />
          </Column>
        </Column> */}
      </Content>
    </Layout>
  );
}
