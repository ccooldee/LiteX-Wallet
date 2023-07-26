import { Column, Content, Header, Icon, Layout, Row, Text } from '@/ui/components';
import { colors } from '@/ui/theme/colors';
import { useLocationState } from '@/ui/utils';
import { useNavigate } from '../MainRoute';
import { Loading } from '@/ui/components/ActionComponent/Loading';

export default function TxFailScreen() {
  const navigate = useNavigate();

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
            <div className="text-[24px] text-white ml-[113px]">Success</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
            <div className="flex justify-center mt-4 text-page-icon-color text-center">
              <div className="p-6 rounded-[50%] relative overflow-hidden w-min text-page-icon-color ">
                <div className="absolute w-[100%] h-[100%] bg-[#4cd9ac] opacity-[0.1] rounded-[50%] left-0 top-0"></div>
                <span className="anticon text-page-icon-color w-[64px] h-[64px] text-[64px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
              </div>
            </div>
            <div className="text-[32px] font-bold text-white">Inscribe Success</div>
            <div className="text-[16px] text-white/[0.45] p-4 text-center">The transferable and available balance of LTC20 will be refreshed in a few minutes.</div>
          </div>
          <div className="absolute bottom-[24px] w-[100%] flex flex-col gap-2 px-4">
            <button 
              onClick={() => {
                //onClickConfirm();
              }}
              className="ant-btn flex flex-row justify-center items-center py-2 gap-2 bg-[#004bff] hover:bg-[#2565e6] w-[100%] rounded-[8px]"
            >
              <div className="text-[16px] text-white">Done</div>
            </button>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
