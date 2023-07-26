import { NETWORK_TYPES } from '@/shared/constant';
import { Content, Header, Layout, Icon, Column, Row, Card, Text } from '@/ui/components';
import { useChangeNetworkTypeCallback, useNetworkType } from '@/ui/state/settings/hooks';

export default function NetworkTypeScreen() {
  const networkType = useNetworkType();
  const changeNetworkType = useChangeNetworkTypeCallback();
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
            <div className="text-[20px] text-white">Manage networks</div>
            <button 
              className="ant-btn text-[24px]"
              onClick={() => {
                window.history.go(-1);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"></line></svg>
            </button>
          </div>
          <div className="p-4 gap-4 flex flex-col">
            {NETWORK_TYPES.map((item, index) => {
              return (
                <div 
                  className="flex flex-row justify-center items-center max-w-sm p-4 my-1 rounded-[8px] bg-[#1a1a1a] hover:bg-[#252525]" 
                  onClick={async () => {
                    await changeNetworkType(item.value);
                    window.location.reload();
                  }}
                  key={index}
                >
                  <Row full justifyBetween itemsCenter>
                    <Row itemsCenter>
                      <Text text={item.label} preset="regular-bold" />
                    </Row>
                    <Column>{item.value == networkType && <Icon icon="check" />}</Column>
                  </Row>
                </div>
              );
            })}
          </div>
        </div>
      </Content>
    </Layout>
  );
}
