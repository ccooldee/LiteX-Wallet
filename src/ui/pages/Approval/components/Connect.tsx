import VirtualList from 'rc-virtual-list';
import { forwardRef } from 'react';

import { Account } from '@/shared/types';
import { Button, Card, Column, Content, Footer, Header, Icon, Layout, Row, Text } from '@/ui/components';
import WebsiteBar from '@/ui/components/WebsiteBar';
import { useAccounts, useCurrentAccount } from '@/ui/state/accounts/hooks';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { shortAddress, useApproval, useWallet } from '@/ui/utils';
import { CheckCircleFilled } from '@ant-design/icons';

interface MyItemProps {
  account?: Account;
}

export function MyItem({ account }: MyItemProps, ref) {
  const currentAccount = useCurrentAccount();
  const selected = currentAccount.pubkey == account?.pubkey;
  const wallet = useWallet();
  const dispatch = useAppDispatch();
  if (!account) {
    return <div />;
  }

  return (
    <Card
      justifyBetween
      mt="md"
      onClick={async (e) => {
        if (currentAccount.pubkey !== account.pubkey) {
          await wallet.changeAccount(account);
          dispatch(accountActions.setCurrent(account));
        }
      }}>
      <Row>
        <Column style={{ width: 20 }} selfItemsCenter>
          {selected && (
            <Icon>
              <CheckCircleFilled />
            </Icon>
          )}
        </Column>
        <Column>
          <Text text={account.alianName} />
          <Text text={`${shortAddress(account.address)}`} preset="sub" />
        </Column>
      </Row>
      <Column relative></Column>
    </Card>
  );
}

interface Props {
  params: {
    session: {
      origin: string;
      icon: string;
      name: string;
    };
  };
}

export default function Connect({ params: { session } }: Props) {
  const [getApproval, resolveApproval, rejectApproval] = useApproval();

  const currentAccount = useCurrentAccount();
  const wallet = useWallet();
  const dispatch = useAppDispatch();

  const handleCancel = () => {
    rejectApproval('User rejected the request.');
  };

  const handleConnect = async () => {
    resolveApproval();
  };

  const accounts = useAccounts();
  const items = accounts.map((v) => ({
    key: v.address,
    account: v
  }));
  const ForwardMyItem = forwardRef(MyItem);

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center justify-center p-4">
            <div className="text-[24px] text-white mt-4">Connect the LiteX Wallet</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
            <WebsiteBar session={session} />
            <div className="w-[100%] p-4">
              <div className="text-white text-[16px] mb-2">Choose the account(s) you'd like to connect</div>
              <div className="flex flex-col gap-2 w-[100%] mb-2 max-h-[250px] overflow-scroll">
                {
                  items.map((item, index) =>(
                    <div 
                      key={index} 
                      className="flex flex-row items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] py-2 px-4"
                      onClick={async (e) => {
                        if (currentAccount.pubkey !== item.account?.pubkey) {
                          if (item.account)
                          {
                            await wallet.changeAccount(item.account);
                            dispatch(accountActions.setCurrent(item.account));
                            //saveData();
                          }
                        }
                      }}
                    > 
                      <div className="flex flex-col gap-2 grow">
                        <div className="text-[16px] text-white font-semibold">{item.account?.alianName}</div>
                        <div className="text-[12px] text-white/[0.45] font-semibold">{shortAddress(item.account?.address)}</div>
                      </div>
                      {
                        (currentAccount.pubkey == item.account?.pubkey) &&  <span className="anticon flex-none text-[#4cd9ac]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                        </span>
                      }
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-[24px] flex flex-col gap-2 w-[100%] p-4">
            <div className="text-white/[0.45] text-[16px]">Make sure you trust this site before connecting</div>
            <div className="grid grid-cols-2 w-[100%] gap-2">
              <button 
                className="text-white rounded-[8px] bg-[#1b1b1b] hover:bg-[#363636] active:bg-[#1b1b1b] flex flex-row px-4 py-3 items-center justify-center gap-2"
                onClick={handleCancel}
              >
                <span className="text-[24px] h-[24px] w-[24px] ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm37.7,130.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0L128,139.3l-26.3,26.4a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L116.7,128,90.3,101.7a8.1,8.1,0,0,1,11.4-11.4L128,116.7l26.3-26.4a8.1,8.1,0,0,1,11.4,11.4L139.3,128Z"></path></svg>
                </span>
                <div className="font-bold">Cancel</div>
              </button>
              <button 
                className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
                onClick={handleConnect}
              >
                <span className="text-[24px] h-[24px] w-[24px] ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
                <div className="font-bold">Connect</div>
              </button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

