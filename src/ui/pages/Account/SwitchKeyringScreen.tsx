import VirtualList from 'rc-virtual-list';
import { forwardRef, useMemo, useState } from 'react';

import { KEYRING_TYPE } from '@/shared/constant';
import { WalletKeyring } from '@/shared/types';
import { Card, Column, Content, Header, Icon, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { RemoveWalletPopover } from '@/ui/components/RemoveWalletPopover';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring, useKeyrings } from '@/ui/state/keyrings/hooks';
import { keyringsActions } from '@/ui/state/keyrings/reducer';
import { colors } from '@/ui/theme/colors';
import { shortAddress, useWallet } from '@/ui/utils';
import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';

import { useNavigate } from '../MainRoute';

export interface ItemData {
  key: string;
  keyring: WalletKeyring;
}

interface MyItemProps {
  keyring: WalletKeyring;
  autoNav?: boolean;
}

export function MyItem({ keyring, autoNav }: MyItemProps, ref) {
  const navigate = useNavigate();
  const currentKeyring = useCurrentKeyring();
  const selected = currentKeyring.index === keyring?.index;
  const wallet = useWallet();

  const keyrings = useKeyrings();

  const dispatch = useAppDispatch();

  const tools = useTools();

  const displayAddress = useMemo(() => {
    const address = keyring.accounts[0].address;
    return shortAddress(address);
  }, []);

  const [optionsVisible, setOptionsVisible] = useState(false);
  const [removeVisible, setRemoveVisible] = useState(false);

  return (
    <div className="flex flex-row justify-between items-center min-w-full p-2 my-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
      <Row
        full
        onClick={async (e) => {
          if (currentKeyring.key !== keyring.key) {
            await wallet.changeKeyring(keyring);
            dispatch(keyringsActions.setCurrent(keyring));
            dispatch(accountActions.setCurrent(keyring.accounts[0]));
          }
          if (autoNav) navigate('MainScreen');
        }}>
        <Column style={{ width: 20 , marginRight: 10}} selfItemsCenter>
          {selected && (
            <svg className="w-7 h-7 text-blue-900 dark:text-white font-extrabold" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
            </svg>
          )}
        </Column>

        <Column justifyCenter>
          <Text text={`${keyring.alianName}`} preset="bold" color="blues"/>
          <Text text={`${displayAddress}`} preset="bold" color="grey" />
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
            <Column>
              <Row
                onClick={() => {
                  navigate('EditWalletNameScreen', { keyring });
                }}>
                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                  <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                </svg>
                <Text text="Edit Name" size="sm" preset="bold"/>
              </Row>
              <hr/>
              {keyring.type === KEYRING_TYPE.HdKeyring ? (
                <Row
                  onClick={() => {
                    navigate('ExportMnemonicsScreen', { keyring });
                  }}>
                  <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  <Text text="Show Secret Recovery Phrase" size="sm" preset="bold"/>
                </Row>
              ) : (
                <Row
                  onClick={() => {
                    navigate('ExportPrivateKeyScreen', { account: keyring.accounts[0] });
                  }}>
                  <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                  </svg>
                  <Text text="Export Private Key" size="sm" preset="bold"/>
                </Row>
              )}
              <hr/>
              <Row
                onClick={() => {
                  if (keyrings.length == 1) {
                    tools.toastError('Removing the last wallet is not allowed');
                    return;
                  }
                  setRemoveVisible(true);
                  setOptionsVisible(false);
                }}>
                <svg className="w-5 h-5 text-red-500 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                  <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z"/>
                </svg>

                <Text text="Remove Wallet" size="sm" color="danger" preset="bold"/>
              </Row>
            </Column>
          </Column>
        )}
      </Column>

      {removeVisible && (
        <RemoveWalletPopover
          keyring={keyring}
          onClose={() => {
            setRemoveVisible(false);
          }}
        />
      )}
    </div>
  );
}

export default function SwitchKeyringScreen() {
  const navigate = useNavigate();

  const keyrings = useKeyrings();

  const items = useMemo(() => {
    const _items: ItemData[] = keyrings.map((v) => {
      return {
        key: v.key,
        keyring: v
      };
    });
    // _items.push({
    //   key: 'add'
    // });
    return _items;
  }, [keyrings]);
  const ForwardMyItem = forwardRef(MyItem);
  return (
    <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
        title="Switch Wallet"
      />
      <Content>
        <VirtualList
          data={items}
          data-id="list"
          itemHeight={30}
          itemKey={(item) => item.key}
          // disabled={animating}
          style={{
            boxSizing: 'border-box'
          }}
          // onSkipRender={onAppear}
          // onItemRemove={onAppear}
        >
          {(item, index) => <ForwardMyItem keyring={item.keyring} autoNav={true} />}
        </VirtualList>
        <button type="button" className="text-white font-bold text-[20px] bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 rounded-xl text-sm px-5 py-3 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => {navigate('AddKeyringScreen');}}>Create Wallet</button>
      </Content>
    </Layout>
  );
}
