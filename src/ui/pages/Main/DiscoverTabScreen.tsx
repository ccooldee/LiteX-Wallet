import { InscriptionMintedItem } from '@/shared/types';
import { Column, Content, Footer, Layout, Row, Text, Grid } from '@/ui/components';
import { Header } from '@/ui/components/@New';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { useNavigate } from '@/ui/pages/MainRoute';
import { useInscriptionSummary } from '@/ui/state/accounts/hooks';
import { balanceToSixDecimalDigit, shortAddress, useWallet } from '@/ui/utils';
import { useState, useEffect } from 'react';
import { WalletHistory } from '@/shared/types';

function MintItem({ info }: { info: InscriptionMintedItem }) {
  const navigate = useNavigate();
  return (
    <Column mt="lg" gap="lg">
      <Text text={info.title} preset="bold" color="white" size="lg" />
      <Row justifyBetween>
        <Text text={info.desc} preset="sub" size="md" />

        <Text
          text="More"
          color="white"
          preset="bold"
          size="md"
          onClick={() => {
            window.open('https://ordinalslite.com/');
          }}
        />
      </Row>

      <Grid columns={3} >
        {info.inscriptions.map((v) => (
          <InscriptionPreview
            key={v.inscriptionId}
            onClick={() => {
              navigate('OrdinalsDetailScreen', { inscription: v });
            }}
            preset="small"
            data={v}
          />
        ))}
      </Grid>
    </Column>
  );
}

export default function DiscoverTabScreen() {
  const inscriptionSummary = useInscriptionSummary();
  const wallet = useWallet();
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const run = async () => {
      setWalletHistory(await wallet.getWalletHistory());
    };
    run();
     
  }, []);

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <Header />
          <div className="text-[24px] text-white font-bold flex flex-row justify-center mt-2">History</div>
          {
            walletHistory.length > 0 ?
              <div className="flex flex-col gap-3 p-4 h-[350px] overflow-scroll">
                {walletHistory.map((history, index) => (
                  <div key={index} className="flex flex-row items-center bg-[#1a1a1a] hover:bg-[#252525] rounded-[8px] py-2 px-4 gap-1 cursor-pointer"
                    onClick = {(e) => {
                      setPos(index);
                      setShowModal(true);
                    }}
                  >
                    <div className="flex flex-col gap-1 flex-grow">
                      <div className="flex flex-row justify-between">
                        <div className="text-white font-bold text-[16px]">{shortAddress(history.senderAddress)}</div>
                        <div className="text-white font-bold text-[16px]">{balanceToSixDecimalDigit(history.amount) + ' LTC'}</div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="text-white/[0.45] text-[12px]">{history.transactionTime}</div>
                        <div className="text-white/[0.45] text-[12px]">{balanceToSixDecimalDigit(history.networkFee) + ' LTC'}</div>
                      </div>  
                    </div>
                    <span className="anticon text-[20px]"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><polyline points="96 48 176 128 96 208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></polyline></svg></span>
                  </div>
                ))}
              </div>
              :
              <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
                <div className="flex flex-col p-4 mt-4 gap-2 justify-center items-center w-[100%]">
                  <div className="flex flex-row items-center justify-center w-[112px] h-[112px] rounded-full relative">
                    <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[112px] h-[112px] bg-[#737373] opacity-[0.1] rounded-full">
                    </div>
                    <span className="text-[64px] text-[#939393]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M168,100h0a12,12,0,0,1-12,12,12,12,0,0,1-12-12,12,12,0,0,1,24,0Zm64-44V184h0v16a16,16,0,0,1-16,16H40a16,16,0,0,1-16-16V168h0V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM216,164.7V56H40v92.7L76.7,112a16.1,16.1,0,0,1,22.6,0L144,156.7,164.7,136a16.1,16.1,0,0,1,22.6,0Z"></path></svg>
                    </span>
                  </div>
                  <div className="text-white/[0.85] text-[16px] font-semibold">
                    No DATA
                  </div>
                </div>
              </Column>
          }
          
          <div className="absolute h-[72px] bottom-0 w-[100%] rounded-t-[16px] bg-[#1a1a1a] p-2">
            <NavTabBar tab="History" />
          </div>
          {showModal && 
            <div className=" absolute w-[100%] rounded-t-3xl bottom-0 bg-black transition delay-150 duration-300 ease-in-out z-50">
              <div className="py-4 px-4 flex flex-row text-white items-center w-[100%] border-solid border-b-[2px] border-[#FDFDFD]/[0.12]">
                <button className="flex-none ant-btn px-2" onClick={()=>{setShowModal(false)}}>
                  <span className="anticon text-[24px] text-white flex flex-row items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                  </span>
                </button>
                <span className="grow flex flex-row justify-center items-center text-[24px] font-semibold text-white">{walletHistory[pos].transactionType}</span>
              </div>
              <div className="p-4 flex flex-col gap-4 w-[100%] mb-2 max-h-[400px]">
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Network</div>
                  <div className="text-white/[0.65]">{walletHistory[pos].network}</div>
                </div>
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Sender address</div>
                  <div className="text-white/[0.65]">{shortAddress(walletHistory[pos].senderAddress)}</div>
                </div>
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Receiver address</div>
                  <div className="text-white/[0.65]">{shortAddress(walletHistory[pos].recevierAddress)}</div>
                </div>
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Transaction time</div>
                  <div className="text-white/[0.65]">{walletHistory[pos].transactionTime}</div>
                </div>
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Amount</div>
                  <div className="text-white/[0.65]">{balanceToSixDecimalDigit(walletHistory[pos].amount) + ' LTC'}</div>
                </div>
                <div className="flex flex-row justify-between text-[16px]">
                  <div className="text-white font-bold">Network fee</div>
                  <div className="text-white/[0.65]">{balanceToSixDecimalDigit(walletHistory[pos].networkFee) + ' LTC'}</div>
                </div>
              </div>
            </div>
          }
        </div>
      </Content>
    </Layout>
  );
}
