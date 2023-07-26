import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, Input, Layout, Header, Content, Column } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { getUiType, useWallet } from '@/ui/utils';

import { useNavigate } from '../MainRoute';
import { useUnlockCallback } from '@/ui/state/global/hooks';
import { PasswordInput } from '@/ui/components/@New';

type Status = '' | 'error' | 'warning' | undefined;

const $disabledButtonStyle: CSSProperties = Object.assign({}, {
  backgroundColor: '#0031a6',
  color: 'rgba(255, 255, 255, 0.3)',
  cursor: 'not-allowed'
} as CSSProperties);


export default function ChangePasswordScreen() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [passwordC, setPasswordC] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [status, setStatus] = useState('empty');
  const [status2, setStatus2] = useState('empty');

  const [statusC, setStatusC] = useState<Status>('');

  const [showInputPassword, setShowInputPassword] = useState(false);

  const [disabled, setDisabled] = useState(true);
  const wallet = useWallet();
  const tools = useTools();
  const [show, setShow] = useState(false);
  const unlock = useUnlockCallback();
  const UIType = getUiType();
  const isInNotification = UIType.isNotification;
  const [buttonStyle, setButtonStyle] = useState($disabledButtonStyle)

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showInputPassword && 'Enter' == e.key) {
      btnClick();
    }
  };

  const btnClick = async () => {
    // run(password);
    try {
      const currentAccount = await wallet.getCurrentAccount();
      const _res = await wallet.getPrivateKey(passwordC, currentAccount);
      //console.log(_res);
      setShowInputPassword(true);
    } catch (e) {
      tools.toastError('PASSWORD ERROR');
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

  const verify = async () => { 
    try {
      await wallet.changePassword(passwordC, password);
      tools.toastSuccess('Success');
      navigate('MainScreen');
    } catch (err) {
      tools.toastError((err as any).message);
    }
  };
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
            <div className="text-[20px] text-white">Change password</div>
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line></svg>
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {
              showInputPassword ? 
                <>
                  <PasswordInput placeholder="Enter password" label='Password' status = {status} setStatus = {setStatus} inputValue = {password} setInputValue = {setPassword} password={password2} setPassword={setPassword2}/>
                  <PasswordInput placeholder="Confirm password" label='Confirm Password' status = {status2} setStatus = {setStatus2} inputValue = {password2} setInputValue = {setPassword2} password={password} setDisabled = {setDisabled}/>
                  <button 
                    className="ant-btn text-[14px] text-white bg-[#004bff] w-[100%] rounded-[8px]" 
                    disabled={disabled} 
                    style={buttonStyle}
                    onClick={verify}>
                    <span className="anticon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                    </span>
                    <span className="text-[16px] ml-2 ">Change Password</span>
                  </button>
                </> : 
                <div className="mt-4 flex flex-row items-center px-4 gap-2 relative z-2 bg-[#1A1A1A] mb-4 rounded-[8px] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]">
                  <span className="anticon text-white/[0.45]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M93.2,122.8A70.3,70.3,0,0,1,88,96a72,72,0,1,1,72,72,70.3,70.3,0,0,1-26.8-5.2h0L120,176H96v24H72v24H32V184l61.2-61.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><circle cx="180" cy="76" r="12"></circle></svg>
                  </span>
                  <input 
                    className="ant-input text-[16px]" 
                    placeholder="Input Current Password" 
                    type={show? 'text': 'password'} 
                    onChange={(e) => setPasswordC(e.target.value)}
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
            }
          </div>
        </div>
      </Content>
    </Layout>
  );
}
