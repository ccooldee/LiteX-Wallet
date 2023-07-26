import { useExtensionIsInTab } from '../features/browser/tabs';
import { SocialButtonGroup } from './@New';

export const AppDimensions = (props) => {
  const extensionIsInTab = useExtensionIsInTab();
  return (
    <div style={{ width: '100%', height: '100%'}}>
      <div
        style={{
          width: extensionIsInTab ? '100%' : '390px',
          height: extensionIsInTab ? '100%' : '600px'
        }}
        {...props}
      />
      <div className="BackgroundExpandView">
        <div className="expand-view-header">
          <div className="logo-container">
            <img className="w-[24px]" src='./images/logo/wallet-logo.png'/>
            {/* <svg fill="none" height="24" viewBox="0 0 16 24" width="16" xmlns="http://www.w3.org/2000/svg">
              <path d="M15.8 8.71982V5.79499L2.81557 0L0 1.24374V11.4943L9.74516 15.8269L4.49671 18.1367V15.8269L2.28253 14.8292L0 15.8269V22.7973L2.69256 24L15.8 18.1503V13.7631L4.34637 8.66515V6.01367L13.1211 9.92255L15.8 8.71982Z" fill="currentColor"></path>
            </svg> */}
          </div>
          <div className="help-container">
            <div className="help-container-button" onClick={() => { window.location.href = 'https://docs.litexwallet.com/'; }}>
              <span className="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><circle cx="128" cy="128" r="96" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></circle><circle cx="128" cy="180" r="12"></circle><path d="M128,144v-8a28,28,0,1,0-28-28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></path></svg>
              </span>
              <span className="ant-btn-content-wrapper">Help</span>
            </div>
          </div>
        </div>
        <div className="expand-view-footer">
          <SocialButtonGroup/>
        </div>
      </div>
    </div>

  );
};
