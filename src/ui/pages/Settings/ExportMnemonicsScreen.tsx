import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ADDRESS_TYPES } from '@/shared/constant';
import { WalletKeyring } from '@/shared/types';
import { Button, Input, Layout, Content, Icon, Header, Text, Column, Row, Card, Grid } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { useCurrentKeyring, useKeyrings } from '@/ui/state/keyrings/hooks';
import { copyToClipboard, useLocationState, useWallet } from '@/ui/utils';

type Status = '' | 'error' | 'warning' | undefined;

export default function ExportMnemonicsScreen() {
  //const { keyring } = useLocationState<{ keyring: WalletKeyring }>();
  const keyrings = useKeyrings();
  const keyring = useCurrentKeyring();

  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);

  const [mnemonic, setMnemonic] = useState('');
  const [status, setStatus] = useState<Status>('');
  const [error, setError] = useState('');
  const wallet = useWallet();
  const tools = useTools();
  const [show, setShow] = useState(false);

  const [passphrase, setPassphrase] = useState('');

  const btnClick = async () => {
    try {
      const { mnemonic, hdPath, passphrase } = await wallet.getMnemonics(password, keyring);
      setMnemonic(mnemonic);
      setPassphrase(passphrase);
    } catch (e) {
      setStatus('error');
      setError((e as any).message);
    }
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ('Enter' == e.key) {
      btnClick();
    }
  };

  useEffect(() => {
    setDisabled(true);
    if (password) {
      setDisabled(false);
      setStatus('');
      setError('');
    }
  }, [password]);

  function copy(str: string) {
    copyToClipboard(str);
    tools.toastSuccess('Copied');
  }
  const words = mnemonic.split(' ');

  const pathName = ADDRESS_TYPES.find((v) => v.hdPath === keyring.hdPath)?.name;
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
            <div className="text-[20px] text-white">Show seed phrase</div>
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
              mnemonic == '' ? 
                <div className="mt-4 flex flex-row items-center px-4 gap-2 relative z-2 bg-[#1A1A1A] mb-4 rounded-[8px] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]">
                  <span className="anticon text-white/[0.45]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M93.2,122.8A70.3,70.3,0,0,1,88,96a72,72,0,1,1,72,72,70.3,70.3,0,0,1-26.8-5.2h0L120,176H96v24H72v24H32V184l61.2-61.2Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><circle cx="180" cy="76" r="12"></circle></svg>
                  </span>
                  <input 
                    className="ant-input text-[16px]" 
                    placeholder="Input Current Password" 
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
                </div> : 
                <Column>
                  <div className="grid grid-cols-3 gap-4 mt-4 max-h-[350px] min-h-[240px] overflow-scroll">
                    {words.map((v, index) => {
                      return (
                        <div key={index} className="flex flex-row gap-1 rounded-[8px] bg-[#252525] text-[14px] leading-loose px-4 py-2">
                          <div className="text-white/[0.45]">{`${index + 1}. `}</div>
                          <div className="text-white">{v}</div>
                        </div>
                      );
                    })}
                  </div>
                  <button 
                    className="ant-btn flex flex-row justify-center gap-2 text-[#a6a6a6] items-center mt-2 hover:text-white mb-[28px]"
                    onClick={(e) => {
                      copy(mnemonic);
                    }}
                  >
                    <span className="ant-icon h-[28px] w-[28px] text-[28px]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 184 216 40 72 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><rect x="40" y="72" width="144" height="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect></svg>
                    </span>
                    <span className="text-[16px]">
                      Copy & Save to the clipboard
                    </span>
                  </button>
                </Column>    
            }
          </div>
        </div>
      </Content>
    </Layout>
  );
}

/*
 <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
        title="Secret Recovery Phrase"
      />

      <Content style={{marginTop: '8px'}}>
        {mnemonic == '' ? (
          <Column>
            <Input
              preset="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              onKeyUp={(e) => handleOnKeyUp(e)}
              autoFocus={true}
            />
            {error && <Text text={error} preset="regular" color="error" />}

            <Button disabled={disabled} text="Show Secret Recovery Phrase" preset="primary" onClick={btnClick} />
          </Column>
        ) : (
          <Column>
            <Row
              justifyCenter
              onClick={(e) => {
                copy(mnemonic);
              }}>
              <Icon icon="copy" color="textDim" />
              <Text text="Copy to clipboard" color="textDim" />
            </Row>

            <Row justifyCenter>
              <Grid columns={2}>
                {words.map((v, index) => {
                  return (
                    <Row key={index}>
                      <Text text={`${index + 1}. `} style={{ width: 40 }} />
                      <Card preset="style2" style={{ width: 200 }}>
                        <Text text={v} selectText />
                      </Card>
                    </Row>
                  );
                })}
              </Grid>
            </Row>
            <Card>
              <Column>
                <Text text="Advance Options" />
                <Text
                  text={`Derivation Path: ${keyring.hdPath}/0 (${pathName})`}
                  preset="sub"
                  onClick={() => {
                    copy(keyring.hdPath);
                  }}
                />
                {passphrase && <Text text={`Passphrase: ${passphrase}`} preset="sub" />}
              </Column>
            </Card>
          </Column>
        )}
      </Content>
    </Layout>
*/