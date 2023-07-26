import { useState } from 'react';

import { useNavigate } from '@/ui/pages/MainRoute';
import { useSetTabCallback } from '@/ui/state/global/hooks';
import { TabOption } from '@/ui/state/global/reducer';
import { colors } from '@/ui/theme/colors';

import { Column } from '../Column';
import { Text } from '../Text';
import { Grid } from '../Grid';
import { Icon, IconTypes } from '../Icon';
import { useWallet } from '@/ui/utils';

export function NavTabBar({ tab }: { tab: TabOption }) {
  const navigate = useNavigate();
  return (
    <Grid columns={5} style={{ width: '100%', height: '56px', backgroundColor: colors.transparent }}>
      <div 
        className={`flex flex-col items-center cursor-pointer ${tab === 'Wallet'? 'text-white': 'text-white/[0.45]'} `}
        onClick = {(e) => {
          navigate('MainScreen');
        }}
      >
        <span className="anticon text-[24px]"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M216,72H56a8,8,0,0,1,0-16H192a8,8,0,0,0,0-16H56A24.1,24.1,0,0,0,32,64V192a24.1,24.1,0,0,0,24,24H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Zm-36,84a12,12,0,1,1,12-12A12,12,0,0,1,180,156Z"></path></svg></span>
        <div className="text-[16px]">Wallet</div>
      </div>
      <div 
        className={`flex flex-col items-center cursor-pointer ${tab === 'All'? 'text-white': 'text-white/[0.45]'} `}
        onClick = {(e) => {
          navigate('AllInscriptionScreen');
        }}
      >
        <span className="anticon text-[24px]"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M232,128A104.1,104.1,0,0,0,128,24,104.1,104.1,0,0,0,24,128,104.1,104.1,0,0,0,128,232h.1A104.1,104.1,0,0,0,232,128ZM49.2,88.9l51.2,9.4L46.7,161.5A88,88,0,0,1,49.2,88.9Zm160.1,5.6a88,88,0,0,1-2.5,72.6l-51.2-9.4Zm-8-15.2L167.6,119l-28-78.2a86.8,86.8,0,0,1,50.6,25A88.5,88.5,0,0,1,201.3,79.3ZM122.4,40.2l17.5,49L58.3,74.3a99.2,99.2,0,0,1,7.5-8.5A87.1,87.1,0,0,1,122.4,40.2ZM54.7,176.7,88.4,137l28,78.2a86.8,86.8,0,0,1-50.6-25A88.5,88.5,0,0,1,54.7,176.7Zm78.9,39.1-17.5-49,23,4.2h.1l58.5,10.7a99.2,99.2,0,0,1-7.5,8.5A87.1,87.1,0,0,1,133.6,215.8Z"></path></svg></span>
        <div className="text-[16px]">NFT</div>
      </div>
      <div 
        className={`flex flex-col items-center cursor-pointer ${tab === 'LTC20'? 'text-white': 'text-white/[0.45]'} `}
        onClick = {(e) => {
          navigate('LtcInscriptionScreen');
        }}
      >
        <span className="anticon text-[24px]"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24C74.2,24,32,48.6,32,80v96c0,31.4,42.2,56,96,56s96-24.6,96-56V80C224,48.6,181.8,24,128,24Zm80,104c0,9.6-7.9,19.4-21.6,26.9C170.9,163.4,150.2,168,128,168s-42.9-4.6-58.4-13.1C55.9,147.4,48,137.6,48,128V111.4C65.1,126.3,94.2,136,128,136s62.9-9.7,80-24.6Zm-21.6,74.9C170.9,211.4,150.2,216,128,216s-42.9-4.6-58.4-13.1C55.9,195.4,48,185.6,48,176V159.4C65.1,174.3,94.2,184,128,184s62.9-9.7,80-24.6V176C208,185.6,200.1,195.4,186.4,202.9Z"></path></svg></span>
        <div className="text-[16px]">LTC20</div>
      </div>
      <div 
        className={`flex flex-col items-center cursor-pointer ${tab === 'Settings'? 'text-white': 'text-white/[0.45]'} `}
        onClick = {(e) => {
          navigate('SettingsTabScreen');
        }}
      >
        <span className="anticon text-[24px]"> <svg width="20" height="20" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22.7454 7.80938C22.9001 8.2125 22.7688 8.66719 22.4501 8.9625L20.4204 10.8094C20.4719 11.1984 20.5001 11.5969 20.5001 12C20.5001 12.4031 20.4719 12.8016 20.4204 13.1906L22.4501 15.0375C22.7688 15.3328 22.9001 15.7875 22.7454 16.1906C22.5391 16.7484 22.2907 17.2875 22.0095 17.7984L21.7891 18.1781C21.4798 18.6937 21.1329 19.1812 20.7532 19.6453C20.4719 19.9781 20.0173 20.0953 19.6048 19.9641L16.9938 19.1297C16.3657 19.6125 15.6298 20.0156 14.9313 20.325L14.3454 23.0016C14.2516 23.4234 13.9235 23.7234 13.4923 23.8359C12.8454 23.9438 12.1798 24 11.4579 24C10.8204 24 10.1548 23.9438 9.50788 23.8359C9.07663 23.7234 8.7485 23.4234 8.65475 23.0016L8.06881 20.325C7.32819 20.0156 6.63444 19.6125 6.00631 19.1297L3.39725 19.9641C2.98287 20.0953 2.52584 19.9781 2.24834 19.6453C1.86818 19.1812 1.52131 18.6937 1.21193 18.1781L0.992557 17.7984C0.708026 17.2875 0.460525 16.7484 0.252869 16.1906C0.100994 15.7875 0.228963 15.3328 0.550526 15.0375L2.57834 13.1906C2.52678 12.8016 2.50006 12.4031 2.50006 12C2.50006 11.5969 2.52678 11.1984 2.57834 10.8094L0.550526 8.9625C0.228963 8.66719 0.100994 8.21719 0.252869 7.80938C0.460525 7.25156 0.708494 6.7125 0.992557 6.20156L1.21146 5.82187C1.52131 5.30625 1.86818 4.81875 2.24834 4.35703C2.52584 4.02187 2.98287 3.90562 3.39725 4.03781L6.00631 4.87031C6.63444 4.38562 7.32819 3.9825 8.06881 3.67641L8.65475 0.999844C8.7485 0.574219 9.07663 0.23625 9.50788 0.164531C10.1548 0.0562969 10.8204 0 11.5001 0C12.1798 0 12.8454 0.0562969 13.4923 0.164531C13.9235 0.23625 14.2516 0.574219 14.3454 0.999844L14.9313 3.67641C15.6298 3.9825 16.3657 4.38562 16.9938 4.87031L19.6048 4.03781C20.0173 3.90562 20.4719 4.02187 20.7532 4.35703C21.1329 4.81875 21.4798 5.30625 21.7891 5.82187L22.0095 6.20156C22.2907 6.7125 22.5391 7.25156 22.7454 7.80938ZM11.5001 15.75C13.5719 15.75 15.2501 14.0719 15.2501 11.9578C15.2501 9.92813 13.5719 8.20781 11.5001 8.20781C9.42819 8.20781 7.75006 9.92813 7.75006 11.9578C7.75006 14.0719 9.42819 15.75 11.5001 15.75Z" fill="#AAAAAA"/></svg></span>
        <div className="text-[16px]">Setting</div>
      </div>
      <div 
        className={`flex flex-col items-center cursor-pointer ${tab === 'History'? 'text-white': 'text-white/[0.45]'} `}
        onClick = {(e) => {
          navigate('DiscoverTabScreen');
        }}
      >
        <span className="anticon text-[24px]"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm56,112H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48a8,8,0,0,1,0,16Z"></path></svg></span>
        <div className="text-[16px]">History</div>
      </div>      
    </Grid>
  );
}

// function TabButton({ tabName, icon, isActive }: { tabName: TabOption; icon: IconTypes; isActive: boolean }) {
//   const setTab = useSetTabCallback();
//   const [hover, setHover] = useState('');
//   const navigate = useNavigate();
//   const wallet = useWallet();
//   return (
//     <Column
//       justifyCenter
//       itemsCenter
//       onClick={async (e) => {
//         if (tabName === 'Wallet') {
//           navigate('MainScreen');
//         } else if (tabName === 'History') {
//           navigate('DiscoverTabScreen');
//         } else if (tabName === 'Lock') {
//           await wallet.lockWallet();
//           navigate('UnlockScreen');
//         } else if (tabName === 'Settings') {
//           navigate('SettingsTabScreen');
//         }
//       }}>
//       <Icon icon={icon} color={isActive ? 'white' : 'grey'} size="24px"/>
//       <Text text={tabName} preset="bold" textCenter size="sm" color={isActive ? 'white' : 'grey'}/>
//     </Column>
//   );
// }
