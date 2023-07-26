import moment from 'moment';
import { useEffect, useState } from 'react';

import { Inscription } from '@/shared/types';
import { Button, Column, Content, Header, Layout, Row, Text } from '@/ui/components';
import { useTools } from '@/ui/components/ActionComponent';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useAppDispatch } from '@/ui/state/hooks';
import { useTxIdUrl } from '@/ui/state/settings/hooks';
import { transactionsActions } from '@/ui/state/transactions/reducer';
import { copyToClipboard, useLocationState, useWallet } from '@/ui/utils';

import { useNavigate } from '../MainRoute';

export default function OrdinalsDetailScreen() {
  const navigate = useNavigate();
  const { inscription } = useLocationState<{ inscription: Inscription }>();

  const currentAccount = useCurrentAccount();
  const withSend = currentAccount.address === inscription.address;

  const dispatch = useAppDispatch();

  const isUnconfirmed = inscription.timestamp == 0;
  const date = moment(inscription.timestamp * 1000).format('YYYY-MM-DD hh:mm:ss');

  const genesisTxUrl = useTxIdUrl(inscription.genesisTransaction);

  const [isMultiStuck, setIsMultiStuck] = useState(false);
  const wallet = useWallet();
  // detect multiple inscriptions
  useEffect(() => {
    wallet.getInscriptionUtxoDetail(inscription.inscriptionId).then((v) => {
      if (v.inscriptions.length > 1) {
        setIsMultiStuck(true);
      }
    });
  }, []);

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center">
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="160 208 80 128 160 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg>
            </button>
            <div className="text-[24px] ml-[40px]">Inscription Detail</div>
          </div>
          <div className="flex flex-col max-w-[600px] overflow-scroll px-4 gap-4 mt-4">
            <Text
              text={isUnconfirmed ? 'Inscription (not confirmed yet)' : `Inscription ${inscription.inscriptionNumber}`}
              preset="title-bold"
              textCenter
            />
            <Row justifyCenter>
              <InscriptionPreview data={inscription} preset="large" />
            </Row>
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-col gap-2 px-4">
            <button 
              className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
              onClick={(e) => {
                dispatch(transactionsActions.reset());
                navigate('OrdinalsTxCreateScreen', { inscription });
              }}
            >
              <span className="text-[24px] h-[24px] w-[24px] ml-1">
                <svg style={{transform: 'rotate(180deg)'}} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
              </span>
              <div className="font-bold">Send</div>
            </button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

/*
{isMultiStuck && (
  <Text
    color="danger"
    textCenter
    text={'Multiple inscriptions are mixed together. Please split them first.'}
  />
)}
{withSend &&
  (isMultiStuck ? (
    <Button
      text="Split"
      icon="send"
      preset="primary"
      onClick={(e) => {
        dispatch(transactionsActions.reset());
        navigate('SplitTxCreateScreen', { inscription });
      }}
    />
  ) : (
    <button 
      className="text-white rounded-[8px] bg-[#004BFF] hover:bg-[#2565e6] active:bg-[#0031a6] flex flex-row px-4 py-3 items-center justify-center gap-2"
      onClick={(e) => {
        dispatch(transactionsActions.reset());
        navigate('OrdinalsTxCreateScreen', { inscription });
      }}
    >
      <span className="text-[24px] h-[24px] w-[24px] ml-1">
        <svg style={{transform: 'rotate(180deg)'}} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" opacity="0.2"></path><path d="M210.3,35.9,23.9,88.4a8,8,0,0,0-1.2,15l85.6,40.5a7.8,7.8,0,0,1,3.8,3.8l40.5,85.6a8,8,0,0,0,15-1.2L220.1,45.7A7.9,7.9,0,0,0,210.3,35.9Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path><line x1="110.9" y1="145.1" x2="156.1" y2="99.9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
      </span>
      <div className="font-bold">Send</div>
    </button>

  ))}
<Column gap="lg">
  <Section title="id" value={inscription.inscriptionId} />
  <Section title="address" value={inscription.address} />
  <Section title="output value" value={inscription.outputValue} />
  <Section title="preview" value={inscription.preview} link={inscription.preview} />
  <Section title="content" value={inscription.content} link={inscription.content} />
  <Section title="content length" value={inscription.contentLength} />
  <Section title="content type" value={inscription.contentType} />
  <Section title="timestamp" value={isUnconfirmed ? 'unconfirmed' : date} />
  <Section title="genesis transaction" value={inscription.genesisTransaction} link={genesisTxUrl} />
</Column>
*/
function Section({ value, title, link }: { value: string | number; title: string; link?: string }) {
  const tools = useTools();
  return (
    <div className="bg-[#1a1a1a] flex flex-col min-w-full p-3 rounded-[8px] gap-2">
      <Text text={title} preset="bold" size="md" color="white"/>
      <Text
        text={value}
        preset={link ? 'link' : 'bold'}
        size="xs"
        color="white"
        wrap
        onClick={() => {
          if (link) {
            window.open(link);
          } else {
            copyToClipboard(value).then(() => {
              tools.toastSuccess('Copied');
            });
          }
        }}
      />
    </div>
  );
}
