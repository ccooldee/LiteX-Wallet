import { Button, Card, Column, Content, Footer, Header, Layout, Row, Text } from '@/ui/components';
import WebsiteBar from '@/ui/components/WebsiteBar';
import { useApproval } from '@/ui/utils';

interface Props {
  params: {
    data: {
      text: string;
    };
    session: {
      origin: string;
      icon: string;
      name: string;
    };
  };
}
export default function SignText({ params: { data, session } }: Props) {
  const [getApproval, resolveApproval, rejectApproval] = useApproval();

  const handleCancel = () => {
    rejectApproval();
  };

  const handleConfirm = () => {
    resolveApproval();
  };
  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] bg-[#0c0c0c]">
          <div className="bg-[#1a1a1a] flex flex-row gap-2 items-center justify-center p-4">
            <div className="text-[24px] text-white mt-4">Signature request</div>
          </div>
          <div className="flex flex-col gap-4 justify-center items-center pt-[32px] w-[100%]">
            <WebsiteBar session={session} />
            <div className="w-[100%] p-4">
              <Card>
                <div
                  style={{
                    userSelect: 'text',
                    maxHeight: 384,
                    overflow: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    flexWrap: 'wrap'
                  }}>
                  {data.text}
                </div>
              </Card>
            </div>
          </div>
          
          <div className="absolute bottom-[24px] flex flex-col gap-2 w-[100%] p-4">
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
                onClick={handleConfirm}
              >
                <span className="text-[24px] h-[24px] w-[24px] ml-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
                <div className="font-bold">Sign</div>
              </button>
            </div>
          </div>
        </div>
      </Content>
    </Layout>
  );
}
