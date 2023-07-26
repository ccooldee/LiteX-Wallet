import { useEffect, useState } from 'react';

import { ConnectedSite } from '@/background/service/permission';
import { Icon, Layout, Header, Content, Column, Card, Row, Text, Image } from '@/ui/components';
import { Empty } from '@/ui/components/Empty';
import { fontSizes } from '@/ui/theme/font';
import { useWallet } from '@/ui/utils';

export default function ConnectedSitesScreen() {
  const wallet = useWallet();

  const [sites, setSites] = useState<ConnectedSite[]>([]);

  const getSites = async () => {
    const sites = await wallet.getConnectedSites();
    setSites(sites);
  };

  useEffect(() => {
    getSites();
  }, []);

  const handleRemove = async (origin: string) => {
    await wallet.removeConnectedSite(origin);
    getSites();
  };
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
            <div className="text-[20px] text-white">Connected sites</div>
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line></svg>
            </button>
          </div>
          <Column>
            <div className='flex flex-col p-4 gap-3'>
              {sites.length > 0 ? (
                sites.map((item, index) => {
                  return (
                    <Card key={item.origin}>
                      <Row full justifyBetween itemsCenter>
                        <Row itemsCenter>
                          <Image src={item.icon} size={fontSizes.logo} />
                          <Text text={item.origin} preset="bold" color="white"/>
                        </Row>
                        <Column justifyCenter>
                          <Icon
                            icon="close"
                            onClick={() => {
                              handleRemove(item.origin);
                            }}
                          />
                        </Column>
                      </Row>
                    </Card>
                  );
                })
              ) : (
                <div className="flex flex-col p-4 mt-4 gap-2 justify-center items-center w-[100%]">
                  <div className="flex flex-row items-center justify-center w-[112px] h-[112px] rounded-full relative">
                    <div className="absolute left-0 top-0 flex flex-row items-center justify-center w-[112px] h-[112px] bg-[#737373] opacity-[0.1] rounded-full">
                    </div>
                    <span className="text-[64px] text-[#939393]">
                      <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M221.6,173.3A102.9,102.9,0,0,0,232,128,104.2,104.2,0,0,0,154.8,27.5h-.5A103.8,103.8,0,0,0,60.4,49l-1.3,1.2A103.9,103.9,0,0,0,128,232h2.4A104.3,104.3,0,0,0,221,174.6h0ZM216,128a89.3,89.3,0,0,1-5.5,30.7l-46.4-28.5a16,16,0,0,0-6.3-2.3l-22.8-3a16.1,16.1,0,0,0-15.3,6.8h-8.6l-3.8-7.9a16.2,16.2,0,0,0-11-8.7l-6.6-1.4,2.5-5.9a8.1,8.1,0,0,1,7.4-4.9h16.1a16.1,16.1,0,0,0,7.7-2l12.2-6.8a16.1,16.1,0,0,0,3-2.1l26.9-24.4A15.7,15.7,0,0,0,170,50.7,88,88,0,0,1,216,128ZM40,128a87.1,87.1,0,0,1,9.5-39.7l10.4,27.9a16.1,16.1,0,0,0,11.6,10l5.5,1.2h.1l12,2.6a7.8,7.8,0,0,1,5.5,4.3l2.1,4.4a16.1,16.1,0,0,0,14.4,9h1.2l-7.7,17.2a15.9,15.9,0,0,0,2.8,17.4l16.1,17.4a8.3,8.3,0,0,1,2,6.9l-1.8,9.3A88.1,88.1,0,0,1,40,128Z"></path></svg>
                    </span>
                  </div>
                  <div className="text-white/[0.85] text-[16px] font-semibold">
                    No dApps found
                  </div>
                  <div className="text-white/[0.45] text-[14px]">
                    Your list of approved dApps will appear here.
                  </div>
                </div>
              )}
            </div>
          </Column>
        </div>
      </Content>
    </Layout>
  );
}
