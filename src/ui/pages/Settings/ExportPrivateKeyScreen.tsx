import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Account } from '@/shared/types';
import { Button, Input, Layout, Icon, Content, Header, Text, Column, Card, Row } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { copyToClipboard, useWallet } from '@/ui/utils';

type Status = '' | 'error' | 'warning' | undefined;

export default function ExportPrivateKeyScreen() {
  const { t } = useTranslation();

  const { state } = useLocation();
  const { account } = state as {
    account: Account;
  };

  const [password, setPassword] = useState('');
  const [disabled, setDisabled] = useState(true);

  const [privateKey, setPrivateKey] = useState({ hex: '', wif: '' });
  const [status, setStatus] = useState<Status>('');
  const [error, setError] = useState('');
  const wallet = useWallet();
  const tools = useTools();

  const btnClick = async () => {
    try {
      const _res = await wallet.getPrivateKey(password, account);
      setPrivateKey(_res);
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
              <div className="grow flex flex-row justify-center text-[24px] font-semibold">Export private key</div>
            </div>
          </div>
          {privateKey.wif == '' ? (
            <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%] p-4">
              <Input
                preset="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyUp={(e) => handleOnKeyUp(e)}
                autoFocus={true}
              />
              {error && <Text text={error} preset="regular" color="error" />}

              <Button text="Show Private Key" preset="primary" disabled={disabled} onClick={btnClick} />
            </div>
          ) : (
            <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%] p-4">
              <Text text="WIF Private Key:" preset="bold" color="white" size="sm" textCenter mt="lg" />

              <Card
                onClick={(e) => {
                  copy(privateKey.wif);
                }}>
                <Row>
                  <Icon icon="copy" color="textDim" />
                  <Text
                    text={privateKey.wif}
                    color="textDim"
                    style={{
                      overflowWrap: 'anywhere'
                    }}
                  />
                </Row>
              </Card>

              <Text text="Hex Private Key:" preset="bold" color="white" size="sm" textCenter mt="lg" />

              <Card
                onClick={(e) => {
                  copy(privateKey.hex);
                }}>
                <Row>
                  <Icon icon="copy" color="textDim" />
                  <Text
                    text={privateKey.hex}
                    color="textDim"
                    style={{
                      overflowWrap: 'anywhere'
                    }}
                  />
                </Row>
              </Card>
            </div>
          )}
        </div>
      </Content>
    </Layout>
  );
}
