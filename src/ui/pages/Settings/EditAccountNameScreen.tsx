import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { Account } from '@/shared/types';
import { Button, Content, Header, Input, Layout } from '@/ui/components';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { keyringsActions } from '@/ui/state/keyrings/reducer';
import { useWallet } from '@/ui/utils';

export default function EditAccountNameScreen() {
  const { t } = useTranslation();

  const { state } = useLocation();
  const { account } = state as {
    account: Account;
  };

  const wallet = useWallet();
  const [alianName, setAlianName] = useState('');
  const dispatch = useAppDispatch();
  const handleOnClick = async () => {
    const newAccount = await wallet.setAccountAlianName(account, alianName);
    dispatch(keyringsActions.updateAccountName(newAccount));
    dispatch(accountActions.updateAccountName(newAccount));
    window.history.go(-1);
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ('Enter' == e.key) {
      handleOnClick();
    }
  };

  const validName = useMemo(() => {
    if (alianName.length == 0) {
      return false;
    }
    return true;
  }, [alianName]);
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
              <div className="grow flex flex-row justify-center text-[24px] font-semibold">Edit account name</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%] p-4">
            <Input
              placeholder={account.alianName}
              onChange={(e) => {
                setAlianName(e.target.value);
              }}
              onKeyUp={(e) => handleOnKeyUp(e)}
              autoFocus={true}
            />
            <Button
              disabled={!validName}
              text="Change Account Name"
              preset="primary"
              onClick={(e) => {
                handleOnClick();
              }}
            />
          </div>
        </div>
      </Content>
    </Layout>
    
  );
}
