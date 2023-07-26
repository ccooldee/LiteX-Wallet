import VirtualList from 'rc-virtual-list';
import { forwardRef, useMemo, useState, useEffect } from 'react';

import { Account } from '@/shared/types';
import { Card, Column, Content, Header, Icon, Layout, Row, Text, Input, Button } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { colors } from '@/ui/theme/colors';
import { copyToClipboard, shortAddress, useWallet } from '@/ui/utils';
import {
  CheckCircleFilled,
  CopyOutlined,
  EditOutlined,
  EllipsisOutlined,
  KeyOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import { useSetCurrentAccountCallback } from '@/ui/state/accounts/hooks';

import { useNavigate } from '../MainRoute';

export interface ItemData {
  key: string;
  account?: Account;
}

interface MyItemProps {
  account?: Account;
  autoNav?: boolean;
}

export function MyItem({ account, autoNav }: MyItemProps, ref) {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();
  const selected = currentAccount.pubkey == account?.pubkey;
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  const keyring = useCurrentKeyring();
  if (!account) {
    return <div />;
  }
  const [optionsVisible, setOptionsVisible] = useState(false);
  const path = keyring.hdPath + '/' + account.index;

  const tools = useTools();

  return (
    <div className="flex flex-row justify-between items-center min-w-full p-2 my-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <Row>
        <Column style={{ width: 20 , marginRight: 10}} selfItemsCenter>
          {selected && (
            <svg className="w-7 h-7 text-blue-900 dark:text-white font-extrabold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
          )}
        </Column>
        <Column
          onClick={async (e) => {
            if (currentAccount.pubkey !== account.pubkey) {
              await wallet.changeAccount(account);
              dispatch(accountActions.setCurrent(account));
            }
            if (autoNav) navigate('MainScreen');
          }}>
          <Text text={account.alianName} preset="bold" color="blues"/>
          <Text text={`${shortAddress(account.address)} (${path})`} preset="bold" color="grey"/>
        </Column>
      </Row>
      <Column relative>
        {optionsVisible && (
          <div
            style={{
              position: 'fixed',
              zIndex: 10,
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}
            onTouchStart={(e) => {
              setOptionsVisible(false);
            }}
            onMouseDown={(e) => {
              setOptionsVisible(false);
            }}></div>
        )}
        <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15"
          onClick={async (e) => {
            setOptionsVisible(!optionsVisible);
          }}
        >
          <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
        </svg>

        {optionsVisible && (
          <Column
            style={{
              backgroundColor: colors.white,
              width: 180,
              position: 'absolute',
              right: 0,
              padding: 16,
              borderRadius: 12,
              zIndex: 10,
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)'
            }}>
            <Row
              onClick={() => {
                navigate('EditAccountNameScreen', { account });
              }}>
              <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
              </svg>
              <Text text="Edit Name" size="sm" preset="bold"/>
            </Row>
            <hr/>
            <Row
              onClick={() => {
                copyToClipboard(account.address);
                tools.toastSuccess('copied');
                setOptionsVisible(false);
              }}>
              <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                <path d="M5 9V4.13a2.96 2.96 0 0 0-1.293.749L.879 7.707A2.96 2.96 0 0 0 .13 9H5Zm11.066-9H9.829a2.98 2.98 0 0 0-2.122.879L7 1.584A.987.987 0 0 0 6.766 2h4.3A3.972 3.972 0 0 1 15 6v10h1.066A1.97 1.97 0 0 0 18 14V2a1.97 1.97 0 0 0-1.934-2Z"/>
                <path d="M11.066 4H7v5a2 2 0 0 1-2 2H0v7a1.969 1.969 0 0 0 1.933 2h9.133A1.97 1.97 0 0 0 13 18V6a1.97 1.97 0 0 0-1.934-2Z"/>
              </svg>
              <Text text="Copy address" size="sm" preset="bold"/>
            </Row>
            <hr/>
            <Row
              onClick={() => {
                navigate('ExportPrivateKeyScreen', { account });
              }}>
              <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
              </svg>
              <Text text="Export Private Key" size="sm" preset="bold"/>
            </Row>
          </Column>
        )}
      </Column>
    </div>
  );
}

export default function SwitchAccountScreen() {
  const navigate = useNavigate();
  const keyring = useCurrentKeyring();
  const wallet = useWallet();
  const tools = useTools();
  const setCurrentAccount = useSetCurrentAccountCallback();
  const currentKeyring = useCurrentKeyring();
  const [alianName, setAlianName] = useState('');
  const [defaultName, setDefaultName] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);

  const handleOnClick = async () => {
    await wallet.deriveNewAccountFromMnemonic(currentKeyring, alianName || defaultName);
    tools.toastSuccess('Success');
    const currentAccount = await wallet.getCurrentAccount();
    setCurrentAccount(currentAccount);
    navigate('MainScreen');
  };

  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ('Enter' == e.key) {
      handleOnClick();
    }
  };

  const init = async () => {
    const accountName = await wallet.getNextAlianName(currentKeyring);
    setDefaultName(accountName);
  };
  
  useEffect(() => {
    init();
  }, []);

  const items = useMemo(() => {
    const _items: ItemData[] = keyring.accounts.map((v) => {
      return {
        key: v.address,
        account: v
      };
    });
    return _items;
  }, []);
  const ForwardMyItem = forwardRef(MyItem);

  return (
    <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
        title="Switch Account"
      />
      <Content>
        <VirtualList data={items} data-id="list" itemHeight={20} itemKey={(item) => item.key}>
          {(item, index) => <ForwardMyItem account={item.account} autoNav={true} />}
        </VirtualList>
        {
          showCreateAccount ? 
            <>
              <Input
                placeholder={defaultName}
                onChange={(e) => {
                  setAlianName(e.target.value);
                }}
                onKeyUp={(e) => handleOnKeyUp(e)}
                autoFocus={true}
              />
              <button type="button" className="text-white font-bold text-[20px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-xl text-sm px-5 py-3 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => {handleOnClick();}}>Create an Account</button>
            </>:        
            <button type="button" className="text-white font-bold text-[20px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-xl text-sm px-5 py-3 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => {setShowCreateAccount(true);}}>Create an Account</button>
        }

      </Content>
      
    </Layout>
  );
}
