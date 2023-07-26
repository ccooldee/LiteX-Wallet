import { CSSProperties } from 'react';
import { useState } from 'react';

const $emptyStyle: CSSProperties = Object.assign({}, {

} as CSSProperties);

const $dangerStyle: CSSProperties = Object.assign({}, {
  border: 'solid',
  borderWidth: '2px',
  borderColor: '#d9c500'
} as CSSProperties);

const $warningStyle: CSSProperties = Object.assign({}, {
  border: 'solid',
  borderWidth: '2px',
  borderColor: '#bf1616'
} as CSSProperties);
  

export function PasswordInput(props) {
  const {status, setStatus, inputValue, setInputValue, placeholder, label, password, setPassword} = props;
  const [hint, setHint] = useState('');
  const [basicStyle, setBasicStyle] = useState(Object.assign({}, $emptyStyle))
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleInputChange = (event) => {
    const length = event.target.value.length;
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]*$/;
    const test = regex.test(event.target.value);
    if ( length === 0 )
    {
      setHint(`${label} is required`);
      setStatus('warning');
      setBasicStyle(Object.assign({}, $warningStyle));
    }
    if (length < 5)
    {
      setHint(`${label} must be at least 5 characters in length`);
      setStatus('warning');
      setBasicStyle(Object.assign({}, $warningStyle));
    }
    else {
      if (label === 'Confirm Password' && password !== event.target.value)
      {
        setHint(`${label} do not match!`);
        setStatus('warning');
        setBasicStyle(Object.assign({}, $warningStyle));
      }
      else{
        setHint('');
        setStatus('complete');
        setBasicStyle(Object.assign({}, $emptyStyle));
      }
        
    }
    setInputValue(event.target.value);
    if (label === 'Password') setPassword('');
  };
  return (
    <div className="relative inline-block w-[100%] ">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave} 
        tabIndex={-1} 
        className="flex relative z-2 bg-[#1A1A1A] mb-4 rounded-[8px] hover:border-solid hover:border-[#004BFF] hover:border-[2px] focus:border-solid focus:border-[#004BFF] focus:border-[2px]" style={basicStyle}>
        <span className="px-3 flex-1 flex flex-row">
          <input className="ant-input text-[14px]" placeholder={placeholder} type="password" value={inputValue} onChange={handleInputChange}/>
          {(status === 'warning') && <span className="h-[48px] mr-[-8px] flex items-center">
            <span className="anticon text-[#bf1616] text-[20px] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm37.7,130.3a8.1,8.1,0,0,1,0,11.4,8.2,8.2,0,0,1-11.4,0L128,139.3l-26.3,26.4a8.2,8.2,0,0,1-11.4,0,8.1,8.1,0,0,1,0-11.4L116.7,128,90.3,101.7a8.1,8.1,0,0,1,11.4-11.4L128,116.7l26.3-26.4a8.1,8.1,0,0,1,11.4,11.4L139.3,128Z"></path></svg>
            </span>
          </span>}
          {(status === 'danger') && <span className="h-[48px] mr-[-8px] flex items-center">
            <span className="anticon text-[#d9c500] text-[20px] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z"></path></svg>
            </span>
          </span>}
        </span>
      </div>
      {(showTooltip && hint !== '') &&  (
        <div className="absolute bottom-[48px] flex flex-col mb-6 group-hover:flex">
          <span className="relative z-10 text-[14px] min-w-[32px] min-h-[32px] px-[8px] py-[6px] text-white text-start break-words bg-[#424242] rounded-[6px] max-w-[240px]">{hint}</span>
          <div className="w-3 h-3 ml-8 -mt-2 rotate-45 bg-[#424242]"></div>
        </div>
      )}
    </div>
  );
}

