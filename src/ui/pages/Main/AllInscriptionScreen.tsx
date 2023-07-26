import { Column, Content, Icon, Layout, Row, Text } from '@/ui/components';
import { Header } from '@/ui/components/@New';
import { colors } from '@/ui/theme/colors';
import { useLocationState, useWallet } from '@/ui/utils';
import { useNavigate } from '../MainRoute';
import { NavTabBar } from '@/ui/components/NavTabBar';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { useEffect, useState } from 'react';
import { Inscription } from '@/shared/types';
import { LoadingOutlined } from '@ant-design/icons';
import { useTools } from '@/ui/components/ActionComponent';
import InscriptionPreview from '@/ui/components/InscriptionPreview';
import { Pagination } from '@/ui/components/Pagination';

export default function AllInscriptionScreen() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Content preset="middle">
        <div className="flex flex-col realtive w-[100%] h-[100%] bg-[#0c0c0c]">
          <Header />
          <div className="flex flex-col">
            <div className="flex flex-col justify-center items-center">
              <div className="flex flex-row items-center justify-center w-[100%] py-2 text-[24px]">
                All Inscriptions
              </div>
            </div>
            <div className="max-h-[440px] w-[100%] overflow-scroll px-4">
              <InscriptionList />
            </div>
          </div>
          <div className="absolute h-[72px] bottom-0 w-[100%] rounded-t-[16px] bg-[#1a1a1a] p-2">
            <NavTabBar tab="All" />
          </div>
        </div>
      </Content>
    </Layout>
  );
}

function InscriptionList() {
  const navigate = useNavigate();
  const wallet = useWallet();
  const currentAccount = useCurrentAccount();

  const [filterLists, setFilterLists] = useState<Inscription[]>([]);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [total, setTotal] = useState(-1);
  const [pagination, setPagination] = useState({ currentPage: 1, pageSize: 4 });

  const tools = useTools();

  const fetchData = async () => {
    if (filterLists.length > 0)
    {
      setInscriptions(filterLists.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize));
    }
    else{
      try {
        // tools.showLoading(true);
        const { list, total } = await wallet.getAllInscriptionList(
          currentAccount.address,
          1,
          100
        );
        console.log('---length of list-----', list);
        if (list === undefined)
        {
          setTotal(0);
        }
        else
        {
          const filterList: Inscription[] = [];
          /* filter  LTC20  */
          for(let i=0; i<list.length; i++)
          {
            if (list[i].contentType.includes('text/plain'))
            {
              try {
                let response = await fetch(list[i].content);
                response = await (response.json());
                continue;
              } catch (e) {
                //console.log(e);
              } finally {
                //console.log('');
              }
            }
            filterList.push(list[i]);
          }
          setFilterLists(filterList);
          setInscriptions(filterList.slice((pagination.currentPage - 1) * pagination.pageSize, pagination.currentPage * pagination.pageSize));
          setTotal(filterList.length);
        }
      } catch (e) {
        tools.toastError((e as Error).message);
      } finally {
        // tools.showLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination]);

  if (total === -1) {
    return (
      <Column style={{ minHeight: 150 }} itemsCenter justifyCenter>
        <LoadingOutlined style={{color: colors.blues}}/>
      </Column>
    );
  }

  if (total === 0) {
    return (
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
    );
  }

  return (
    <Column>
      <div className="grid grid-cols-2 gap-2">
        {inscriptions.map((data, index) => (
          <InscriptionPreview
            key={index}
            data={data}
            preset="medium"
            onClick={() => {
              navigate('OrdinalsDetailScreen', { inscription: data, withSend: true });
            }}
          />
        ))}
      </div>
      <Row justifyCenter mt="lg">
        <Pagination
          pagination={pagination}
          total={total}
          onChange={(pagination) => {
            setPagination(pagination);
          }}
        />
      </Row>
    </Column>
  );
}