
export function SocialButtonGroup() {
  return (
    <div className="social-button-group">
      <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
        <button 
          className="social-button"
          onClick={() => { window.location.href = 'https://twitter.com/LiteXwallet'; }}
        >
          <span className="anticon">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256">
              <rect width="256" height="256" fill="none"></rect>
              <path d="M245.7,77.7l-30.2,30.1C209.5,177.7,150.5,232,80,232c-14.5,0-26.5-2.3-35.6-6.8-7.3-3.7-10.3-7.6-11.1-8.8a8,8,0,0,1,3.9-11.9c.2-.1,23.8-9.1,39.1-26.4a108.6,108.6,0,0,1-24.7-24.4c-13.7-18.6-28.2-50.9-19.5-99.1a8.1,8.1,0,0,1,5.5-6.2,8,8,0,0,1,8.1,1.9c.3.4,33.6,33.2,74.3,43.8V88a48.3,48.3,0,0,1,48.6-48,48.2,48.2,0,0,1,41,24H240a8,8,0,0,1,7.4,4.9A8.4,8.4,0,0,1,245.7,77.7Z"></path>
            </svg>
          </span>
        </button>
      </div>
      <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
        <button className="social-button" onClick={() => { window.location.href = 'https://discord.gg/QmWUhmXufq'; }}>
          <span className="anticon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M247.3,169.8l-34-113.2a15.6,15.6,0,0,0-9.2-10.2h-.6l.6-.2A192.4,192.4,0,0,0,169.6,36a8,8,0,0,0-9.4,6.3,7.9,7.9,0,0,0,6.2,9.4c4.5.9,8.9,2,13.2,3.2A8,8,0,0,1,176,70h-.8A185.4,185.4,0,0,0,128,64a181.8,181.8,0,0,0-46.1,5.8,8,8,0,0,1-5.6-14.9h.1c4.3-1.2,8.7-2.3,13.2-3.2a8,8,0,0,0,6.3-9.4A8.1,8.1,0,0,0,86.5,36,191.2,191.2,0,0,0,51.9,46.4a15.6,15.6,0,0,0-9.2,10.2L8.7,169.8a16,16,0,0,0,4.9,16.7,34.7,34.7,0,0,0,2.9,2.5h.1c16.2,13.2,37.5,23.3,61.5,29.1a6.3,6.3,0,0,0,1.9.3,8,8,0,0,0,1.9-15.8,160.3,160.3,0,0,1-31.3-11.1h0a8,8,0,0,1,8.6-13.2c19,8.4,42.9,13.7,68.8,13.7s49.8-5.3,68.8-13.7a8,8,0,0,1,8.6,13.2h0a160.3,160.3,0,0,1-31.3,11.1,8,8,0,0,0,1.9,15.8,6.3,6.3,0,0,0,1.9-.3c24-5.8,45.3-15.9,61.5-29.1h.1a34.7,34.7,0,0,0,2.9-2.5A16,16,0,0,0,247.3,169.8ZM96,156a12,12,0,1,1,12-12A12,12,0,0,1,96,156Zm64,0a12,12,0,1,1,12-12A12,12,0,0,1,160,156Z"></path></svg></span>
        </button>
      </div>
      <div className="social-button-wrapper" style={{WebkitMaskImage: 'url(./images/mask/social-button-mask.svg)', WebkitMaskPosition: 'center center', WebkitMaskRepeat: 'no-repeat'}}>
        <button className="social-button" onClick={() => { window.location.href = 'https://t.me/bitx_brc20'; }}>
          <span className="anticon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M227.7,48.3,175.3,234.2a15.9,15.9,0,0,1-14.1,11.6h-1.4a16,16,0,0,1-14.4-9.1l-35.7-75.4a4.1,4.1,0,0,1,.8-4.6l51.3-51.3a8,8,0,1,0-11.3-11.3L99.2,145.5a4.1,4.1,0,0,1-4.6.8l-75-35.5a16.6,16.6,0,0,1-9.5-15.6A15.9,15.9,0,0,1,21.8,80.7L208.1,28.2a16,16,0,0,1,17.7,6.5A16.7,16.7,0,0,1,227.7,48.3Z"></path></svg></span>
        </button>
      </div>
    </div>
  );
}