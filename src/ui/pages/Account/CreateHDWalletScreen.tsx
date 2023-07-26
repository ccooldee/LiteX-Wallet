import { Checkbox, Dropdown, Radio } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as bip39 from 'bip39';
import bitcore from 'bitcore-lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { ADDRESS_TYPES, RESTORE_WALLETS } from '@/shared/constant';
import { AddressType, RestoreWalletType } from '@/shared/types';
import { Button, Card, Column, Content, Grid, Header, Input, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import { AddressTypeCard } from '@/ui/components/AddressTypeCard';
import { FooterButtonContainer } from '@/ui/components/FooterButtonContainer';
import { Icon } from '@/ui/components/Icon';
import { TabBar } from '@/ui/components/TabBar';
import { useCreateAccountCallback } from '@/ui/state/global/hooks';
import { fontSizes } from '@/ui/theme/font';
import { amountToSatoshis, copyToClipboard, useWallet } from '@/ui/utils';
import { CloseOutlined, LoadingOutlined } from '@ant-design/icons';

import { AES } from 'crypto-js';
import { useNavigate } from '../MainRoute';

function Step0({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  return (
    <Column gap="lg">
      <Text text="Choose a wallet you want to restore from" preset="title-bold" textCenter mt="xl" />
      {RESTORE_WALLETS.map((item, index) => {
        return (
          <Button
            key={index}
            preset="primary"
            onClick={() => {
              updateContextData({ tabType: TabType.STEP2, restoreWalletType: item.value });
            }}>
            <Text text={item.name} color="white"/>
          </Button>
        );
      })}
    </Column>
  );
}

function Step1_Create({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  const [checked, setChecked] = useState(false);

  const wallet = useWallet();
  const tools = useTools();

  const init = async () => {
    const _mnemonics = (await wallet.generatePreMnemonic(contextData.entropy));
    updateContextData({
      mnemonics: _mnemonics
    });
  };

  useEffect(() => {
    init();
  }, []);

  const onChange = (e: CheckboxChangeEvent) => {
    const val = e.target.checked;
    setChecked(val);
    updateContextData({ step1Completed: val });
  };

  function copy(str: string) {
    copyToClipboard(str).then(() => {
      tools.toastSuccess('Copied');
    });
  }

  const btnClick = () => {
    updateContextData({
      tabType: TabType.STEP2
    });
  };

  const words = contextData.mnemonics.split(' ');
  return (
    <div className="p-4 flex flex-col w-[100%] justify-center">
      <div className="text-[14px] leading-relaxed px-4 mb-4 text-white/[0.45] text-center ">
        Keep your recovery phrase in a safe place and never disclose it. Anyone with this phrase can take control of your assets.
      </div>
      <Row justifyCenter>
        <Radio.Group
          onChange={async (e) => {
            const wordsType = e.target.value;
            let words;
            if (wordsType === WordsType.WORDS_24)
              words = 24;
            else
              words = 12;
            const entropy = words /3 * 32;
            const _mnemonics = (await wallet.generatePreMnemonic(entropy));
            updateContextData({
              mnemonics: _mnemonics,
              wordsType: wordsType,
              entropy: entropy
            });
          }}
          value={contextData.wordsType}>
          {wordsItems.map((v) => (
            <Radio key={v.key} value={v.key}>
              {v.label}
            </Radio>
          ))}
        </Radio.Group>
      </Row>
      <div className="grid grid-cols-3 gap-4 mt-4 max-h-[240px] min-h-[240px] overflow-scroll">
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
          copy(contextData.mnemonics);
        }}
      >
        <span className="ant-icon h-[28px] w-[28px] text-[28px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="216 184 216 40 72 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline><rect x="40" y="72" width="144" height="144" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect></svg>
        </span>
        <span className="text-[16px]">
          Copy & Save to the clipboard
        </span>
      </button>
      <Button text="Continue" preset="primary" onClick={btnClick} />
    </div>
  );
}


function Step1_Import({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  const [keys, setKeys] = useState<Array<string>>(new Array(wordsItems[contextData.wordsType].count).fill(''));
  const [curInputIndex, setCurInputIndex] = useState(0);
  const [hover, setHover] = useState(999);
  const [disabled, setDisabled] = useState(true);

  const handleEventPaste = (event, index: number) => {
    const copyText = event.clipboardData?.getData('text/plain');
    const textArr = copyText.trim().split(' ');
    const newKeys = [...keys];
    if (textArr) {
      for (let i = 0; i < keys.length - index; i++) {
        if (textArr.length == i) {
          break;
        }
        newKeys[index + i] = textArr[i];
      }
      setKeys(newKeys);
    }

    event.preventDefault();
  };

  const onChange = (e: any, index: any) => {
    const newKeys = [...keys];
    newKeys.splice(index, 1, e.target.value);
    setKeys(newKeys);
  };

  useEffect(() => {
    setDisabled(true);

    const hasEmpty =
      keys.filter((key) => {
        return key == '';
      }).length > 0;
    if (hasEmpty) {
      return;
    }

    const mnemonic = keys.join(' ');
    if (!bip39.validateMnemonic(mnemonic)) {
      return;
    }

    setDisabled(false);
  }, [keys]);

  useEffect(() => {
    //todo
  }, [hover]);

  const onNext = () => {
    const mnemonics = keys.join(' ');
    updateContextData({ mnemonics, tabType: TabType.STEP2 });
  };
  const handleOnKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!disabled && 'Enter' == e.key) {
      onNext();
    }
  };

  return (
    <div className="p-4 flex flex-col w-[100%] justify-center">
      <div className="text-[14px] leading-relaxed px-4 mb-4 text-white/[0.45] text-center ">
        To import an existing account, please enter seed phrase
      </div>

      <Row justifyCenter>
        <Radio.Group
          onChange={(e) => {
            const wordsType = e.target.value;
            updateContextData({ wordsType });
            setKeys(new Array(wordsItems[wordsType].count).fill(''));
          }}
          value={contextData.wordsType}>
          {wordsItems.map((v) => (
            <Radio key={v.key} value={v.key}>
              {v.label}
            </Radio>
          ))}
        </Radio.Group>
      </Row>

      <div className="grid grid-cols-3 gap-4 mt-4 max-h-[300px] min-h-[240px] overflow-scroll">
        {keys.map((_, index) => {
          return (
            <div key={index} className="flex flex-row gap-1 rounded-[8px] bg-[#252525] text-[14px] leading-loose px-4 py-2">
              <div className="text-white/[0.45]">{`${index + 1}. `}</div>
              <Input
                containerStyle={{ width: 60, minHeight: 25, height: 25, padding: 0 }}
                style={{ width: 60, backgroundColor: '#252525' }}
                value={_}
                onPaste={(e) => {
                  handleEventPaste(e, index);
                }}
                onChange={(e) => {
                  onChange(e, index);
                }}
                // onMouseOverCapture={(e) => {
                //   setHover(index);
                // }}
                // onMouseLeave={(e) => {
                //   setHover(999);
                // }}
                onFocus={(e) => {
                  setCurInputIndex(index);
                }}
                onBlur={(e) => {
                  setCurInputIndex(999);
                }}
                onKeyUp={(e) => handleOnKeyUp(e)}
                autoFocus={index == curInputIndex}
              />
            </div>
          );
        })}
      </div>
      
      <FooterButtonContainer>
        <Button
          disabled={disabled}
          text="Continue"
          preset="primary"
          onClick={() => {
            onNext();
          }}
        />
      </FooterButtonContainer>
    </div>
  );
}

function Step2({
  contextData,
  updateContextData
}: {
  contextData: ContextData;
  updateContextData: (params: UpdateContextDataParams) => void;
}) {
  const wallet = useWallet();
  const tools = useTools();

  const hdPathOptions = useMemo(() => {
    const restoreWallet = RESTORE_WALLETS[contextData.restoreWalletType];
    return ADDRESS_TYPES.filter((v) => {
      if (v.displayIndex < 0) {
        return false;
      }
      if (!restoreWallet.addressTypes.includes(v.value)) {
        return false;
      }

      if (!contextData.isRestore && v.isUnisatLegacy) {
        return false;
      }

      if (contextData.customHdPath && v.isUnisatLegacy) {
        return false;
      }

      return true;
    })
      .sort((a, b) => a.displayIndex - b.displayIndex)
      .map((v) => {
        return {
          label: v.name,
          hdPath: v.hdPath,
          addressType: v.value,
          isUnisatLegacy: v.isUnisatLegacy
        };
      });
  }, [contextData]);

  const [previewAddresses, setPreviewAddresses] = useState<string[]>(hdPathOptions.map((v) => ''));

  const [addressAssets, setAddressAssets] = useState<{
    [key: string]: { total_btc: string; satoshis: number; total_inscription: number };
  }>({});

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createAccount = useCreateAccountCallback();
  const navigate = useNavigate();

  const [pathText, setPathText] = useState(contextData.customHdPath);

  useEffect(() => {
    const option = hdPathOptions[contextData.addressTypeIndex];
    updateContextData({ addressType: option.addressType });
  }, [contextData.addressTypeIndex]);

  const generateAddress = async () => {
    const addresses: string[] = [];
    for (let i = 0; i < hdPathOptions.length; i++) {
      const options = hdPathOptions[i];
      try {
        const keyring = await wallet.createTmpKeyringWithMnemonics(
          contextData.mnemonics,
          contextData.customHdPath || options.hdPath,
          contextData.passphrase,
          options.addressType
        );
        const address = keyring.accounts[0].address;
        addresses.push(address);
      } catch (e) {
        console.log(e);
        setError((e as any).message);
        return;
      }
    }
    setPreviewAddresses(addresses);
  };

  useEffect(() => {
    generateAddress();
  }, [contextData.passphrase, contextData.customHdPath]);

  const fetchAddressesBalance = async () => {
    if (!contextData.isRestore) {
      return;
    }

    const addresses = previewAddresses;
    if (!addresses[0]) return;

    setLoading(true);
    const balances = await wallet.getMultiAddressAssets(addresses.join(','));
    setLoading(false);

    const addressAssets: { [key: string]: { total_btc: string; satoshis: number; total_inscription: number } } = {};
    let maxSatoshis = 0;
    let recommended = 0;
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      const balance = balances[i];
      const satoshis = amountToSatoshis(balance.total_btc);
      addressAssets[address] = {
        total_btc: balance.total_btc,
        satoshis,
        total_inscription: balance.total_inscription
      };
      if (satoshis > maxSatoshis) {
        maxSatoshis = satoshis;
        recommended = i;
      }
    }
    if (maxSatoshis > 0) {
      updateContextData({
        addressTypeIndex: recommended
      });
    }

    setAddressAssets(addressAssets);
  };

  useEffect(() => {
    fetchAddressesBalance();
  }, [previewAddresses]);

  const submitCustomHdPath = () => {
    if (contextData.customHdPath === pathText) return;
    const isValid = bitcore.HDPrivateKey.isValidPath(pathText);
    if (!isValid) {
      setError('Invalid derivation path.');
      return;
    }
    updateContextData({
      customHdPath: pathText
    });
  };

  const resetCustomHdPath = () => {
    updateContextData({
      customHdPath: ''
    });
    setError('');
    setPathText('');
  };

  const onNext = async () => {
    try {
      const option = hdPathOptions[contextData.addressTypeIndex];
      const hdPath = contextData.customHdPath || option.hdPath;

      // const addressTypeInfo = ADDRESS_TYPES[contextData.addressType];
      // console.log(`hdPath: ${finalHdPath}, passphrase:${contextData.passphrase}, addressType:${addressTypeInfo.name}`);

      await createAccount(contextData.mnemonics, hdPath, contextData.passphrase, contextData.addressType);
      navigate('CreateSuccessScreen');
    } catch (e) {
      tools.toastError((e as any).message);
    }
  };

  return (
    <div className="px-4">
      <Column>
        <Text text="Address Type" preset="bold" />
        {hdPathOptions.map((item, index) => {
          const address = previewAddresses[index];
          const assets = addressAssets[address] || {
            total_btc: '--',
            satoshis: 0,
            total_inscription: 0
          };
          const hasVault = contextData.isRestore && assets.satoshis > 0;
          if (item.isUnisatLegacy && !hasVault) {
            return null;
          }

          const hdPath = (contextData.customHdPath || item.hdPath) + '/0';
          return (
            <AddressTypeCard
              key={index}
              label={`${item.label} (${hdPath})`}
              address={address}
              assets={assets}
              checked={index == contextData.addressTypeIndex}
              onClick={() => {
                updateContextData({
                  addressTypeIndex: index,
                  addressType: item.addressType
                });
              }}
            />
          );
        })}

        <Text text="Custom HdPath (Optional)" preset="bold" mt="lg" />

        <Column>
          <Input
            placeholder={'Custom HD Wallet Derivation Path'}
            value={pathText}
            onChange={async (e) => {
              setError('');
              setPathText(e.target.value);
            }}
            onBlur={(e) => {
              submitCustomHdPath();
            }}
          />
          {contextData.customHdPath && (
            <Icon
              onClick={() => {
                resetCustomHdPath();
              }}>
              <CloseOutlined />
            </Icon>
          )}
        </Column>
        {error && <Text text={error} color="error" />}

        <Text text="Phrase (Optional)" preset="bold" mt="lg" />

        <Input
          placeholder={'Passphrase'}
          defaultValue={contextData.passphrase}
          onChange={async (e) => {
            updateContextData({
              passphrase: e.target.value
            });
          }}
        />

        <FooterButtonContainer>
          <Button text="Continue" preset="primary" onClick={onNext} />
        </FooterButtonContainer>

        {loading && (
          <Icon>
            <LoadingOutlined />
          </Icon>
        )}
      </Column>
    </div>
  );
}

enum TabType {
  STEP1 = 'STEP1',
  STEP2 = 'STEP2',
  STEP3 = 'STEP3'
}

export enum WordsType {
  WORDS_12,
  WORDS_24
}

const wordsItems = [
  {
    key: WordsType.WORDS_12,
    label: '12 words',
    count: 12
  },
  {
    key: WordsType.WORDS_24,
    label: '24 words',
    count: 24
  }
];

interface ContextData {
  mnemonics: string;
  entropy: number;
  hdPath: string;
  passphrase: string;
  addressType: AddressType;
  step1Completed: boolean;
  tabType: TabType;
  restoreWalletType: RestoreWalletType;
  isRestore: boolean;
  isCustom: boolean;
  customHdPath: string;
  addressTypeIndex: number;
  wordsType: WordsType;
  isImport: boolean;
  fromUnlock: boolean;
}

interface UpdateContextDataParams {
  mnemonics?: string;
  hdPath?: string;
  passphrase?: string;
  addressType?: AddressType;
  step1Completed?: boolean;
  tabType?: TabType;
  restoreWalletType?: RestoreWalletType;
  isCustom?: boolean;
  customHdPath?: string;
  addressTypeIndex?: number;
  wordsType?: WordsType;
  entropy?: number;
}

export default function CreateHDWalletScreen() {
  const navigate = useNavigate();

  const { state } = useLocation();
  const { isImport, fromUnlock, wordsType = WordsType.WORDS_12, walletType } = state as {
    isImport: boolean;
    fromUnlock: boolean;
    wordsType?: number;
    walletType: RestoreWalletType;
  };

  const [contextData, setContextData] = useState<ContextData>({
    mnemonics: '',
    entropy: wordsItems[wordsType].count / 3 * 32,
    hdPath: '',
    passphrase: '',
    addressType: AddressType.P2WPKH,
    step1Completed: false,
    tabType: TabType.STEP1,
    restoreWalletType: walletType,
    isRestore: isImport,
    isCustom: false,
    customHdPath: '',
    addressTypeIndex: 0,
    wordsType: WordsType.WORDS_12,
    isImport: isImport,
    fromUnlock: fromUnlock
  });

  const updateContextData = useCallback(
    (params: UpdateContextDataParams) => {
      setContextData(Object.assign({}, contextData, params));
    },
    [contextData, setContextData]
  );

  const items = useMemo(() => {
    if (contextData.isRestore) {
      return [
        // {
        //   key: TabType.STEP3,
        //   label: 'Step 3',
        //   children: <Step0 contextData={contextData} updateContextData={updateContextData} />
        // },
        {
          key: TabType.STEP1,
          label: 'Step 1',
          children: <Step1_Import contextData={contextData} updateContextData={updateContextData} />
        },
        {
          key: TabType.STEP2,
          label: 'Step 2',
          children: <Step2 contextData={contextData} updateContextData={updateContextData} />
        }
      ];
    } else {
      return [
        {
          key: TabType.STEP1,
          label: 'Step 1',
          children: <Step1_Create contextData={contextData} updateContextData={updateContextData} />
        },
        {
          key: TabType.STEP2,
          label: 'Step 2',
          children: <Step2 contextData={contextData} updateContextData={updateContextData} />
        }
      ];
    }
  }, [contextData, updateContextData]);

  const currentChildren = useMemo(() => {
    const item = items.find((v) => v.key === contextData.tabType);
    return item?.children;
  }, [items, contextData.tabType]);

  const activeTabIndex = useMemo(() => {
    const index = items.findIndex((v) => v.key === contextData.tabType);
    if (index === -1) {
      return 0;
    } else {
      return index;
    }
  }, [items, contextData.tabType]);
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
                  navigate('WelcomeScreen');
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
                <span className=" text-white font-semibold text-[20px] text-center leading-5 align-baseline inline-block max-w-[100%] overflow-hidden whitespace-nowrap text-ellipsis m-auto">{contextData.isRestore ? 'Restore Wallet' : 'Create Wallet'}</span>
              </div>
            </div>
            {/*header right part*/}
            <div className="flex-shrink-1 mr-2">
              <button 
                className="ant-btn min-w-[40px] bg-transparent text-white px-2 h-[40px] inline-flex font-semibold cursor-pointer items-center content-center whitespace-nowrap"
                onClick={() => {
                  navigate('WelcomeScreen');
                }}
              >
                <span className="anticon inline-flex items-center content-center text-[24px] text-center text-inherit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                </span>
              </button>
            </div>
          </div>
          {currentChildren}
        </div>
      </Content>
    </Layout>
  );
}
