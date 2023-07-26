import { useAccountAddress, useCurrentAccount, useSetCurrentAccountCallback } from '@/ui/state/accounts/hooks';
import { shortAddress, useWallet } from '@/ui/utils';
import { useState, useEffect, useMemo} from 'react';
import { useTools } from '@/ui/components/ActionComponent';
import { accountActions } from '@/ui/state/accounts/reducer';
import { useAppDispatch } from '@/ui/state/hooks';
import { useCurrentKeyring } from '@/ui/state/keyrings/hooks';
import { useNavigate } from '@/ui/pages/MainRoute';
import { Account } from '@/shared/types';
import { Card, Column, Content, Icon, Layout, Row, Text, Input, Button } from '@/ui/components';
import { ADDRESS_TYPES } from '@/shared/constant';
import { db } from '@/ui/utils/config';
// import { collection, getDocs, doc, getDoc, query, setDoc } from 'firebase/firestore';
import { AES } from 'crypto-js';

export interface ItemData {
  key: string;
  account?: Account;
}

export function Header() {
  const address = useAccountAddress();
  const currentAccount = useCurrentAccount();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const keyring = useCurrentKeyring();
  const wallet = useWallet();
  const tools = useTools();
  const dispatch = useAppDispatch();
  const setCurrentAccount = useSetCurrentAccountCallback();
  const currentKeyring = useCurrentKeyring();
  const [alianName, setAlianName] = useState('');
  const [defaultName, setDefaultName] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [items, setItems] = useState<ItemData[]>([]);

  const handleOnClick = async () => {
    await wallet.deriveNewAccountFromMnemonic(currentKeyring, alianName || defaultName);
    tools.toastSuccess('Success');
    const currentAccount = await wallet.getCurrentAccount();
    setCurrentAccount(currentAccount);
    setShowCreateAccount(false);
    setItems(prevItems => [...prevItems, {key: currentAccount.address, account: currentAccount}]);
  };

  const init = async () => {
    const accountName = await wallet.getNextAlianName(currentKeyring);
    setDefaultName(accountName);
    const _items: ItemData[] = keyring.accounts.map((v) => {
      return {
        key: v.address,
        account: v
      };
    });
    setItems(_items);
  };
  
  useEffect(() => {
    init();
  }, []);

  return (
    <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
      <button className="ant-btn text-[24px]" onClick={() => {navigate('SettingsTabScreen')}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 12H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path><path d="M4 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
      </button>
      <div 
        className="flex flex-row gap-2 items-center cursor-pointer ml-[50px]"
        onClick = {()=> {
          setShowModal(true);
        }}
      >
        <div className="text-white font-semibold">{shortAddress(currentAccount?.alianName, 8)}</div>
        <div className="text-white/[0.45]">(...{address.slice(-3)})</div>
        <span className="anticon text-white/[0.45] text-[24px] flex">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="208 96 128 176 48 96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
        </span>
      </div>
      {showModal && 
        <div className=" absolute w-[100%] rounded-t-3xl bottom-0 bg-black transition delay-150 duration-300 ease-in-out z-50">
          <div className="py-4 px-4 flex flex-row text-white items-center w-[100%] border-solid border-b-[2px] border-[#FDFDFD]/[0.12]">
            <button className="flex-none ant-btn px-2" onClick={()=>{setShowModal(false)}}>
              <span className="anticon text-[24px] text-white flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
              </span>
            </button>
            <span className="grow flex flex-row justify-center items-center text-[24px] font-semibold text-white">Select Account</span>
          </div>
          <div className="p-4 flex flex-col gap-2 w-[100%] mb-2 max-h-[400px] overflow-scroll border-solid border-b-[2px] border-[#FDFDFD]/[0.12]">
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

                  <button
                    className="text-white flex-none" 
                    onClick={() => {
                      navigate('EditAccountNameScreen', { account: item.account });
                    }}>
                    <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                      <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z"/>
                      <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z"/>
                    </svg>
                  </button>
                  <button
                    className="text-white flex-none"
                    onClick={() => {
                      navigate('ExportPrivateKeyScreen', { account: item.account });
                    }}>
                    <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 14">
                      <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>
                    </svg>
                  </button>
                </div>
              ))
            }
          </div>
          <div className="p-4 w-[100%] ">
            {
              showCreateAccount ? 
                <>
                  <Input
                    placeholder={defaultName}
                    onChange={(e) => {
                      setAlianName(e.target.value);
                    }}
                    autoFocus={true}
                  />
                  <button className="flex flex-row justify-center items-center gap-2 mt-2  bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] w-[100%] p-4"  onClick={() => {handleOnClick();}}>
                    <span className="anticon text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"></path></svg>
                    </span>
                    <div className="white text-[16px]">Create a new account</div>
                  </button> 
                </>: 
                <button className="flex flex-row justify-center items-center gap-2 bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] w-[100%] p-4" onClick={() => {setShowCreateAccount(true);}}>
                  <span className="anticon text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm40,112H136v32a8,8,0,0,1-16,0V136H88a8,8,0,0,1,0-16h32V88a8,8,0,0,1,16,0v32h32a8,8,0,0,1,0,16Z"></path></svg>
                  </span>
                  <div className="white text-[16px]">Create a new account</div>
                </button>       
            }
          </div>
        </div>
      }
    </div>
  );
}