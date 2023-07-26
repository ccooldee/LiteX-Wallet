/* eslint-disable quotes */
import {useState} from 'react'
import { Button, Column, Content, Layout, Logo, Row, Text } from '@/ui/components';

import { useNavigate } from '../MainRoute';
import { SocialButtonGroup } from '@/ui/components/@New';

export default function CreateSuccessScreen() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Content preset="middle">
        <div className="bg-[#0c0c0c] w-[100%] h-[100%] relative">
          <div className="py-2 flex flex-row items-center justify-between relative min-h-[40px] h-max-content">
            {/*header left part*/}
            <div className="flex-shrink-1 ml-2">
              <button 
                className="ant-btn min-w-[40px] bg-transparent text-white px-2 h-[40px] inline-flex font-semibold cursor-pointer items-center content-center whitespace-nowrap"
                onClick={() => {
                  navigate('MainScreen');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
              </button>
            </div>
            {/*header center part*/}
            <div className="absolute content-center top-0 left-0 bottom-0 right-0 m-auto w-[246px] pr-0 flex flex-row flex-1 items-center overflow-hidden">
              <div className=" content-center overflow-hidden whitespace-nowrap w-[100%] flex">
                <span className=" text-white font-semibold text-[20px] text-center leading-5 align-baseline inline-block max-w-[100%] overflow-hidden whitespace-nowrap text-ellipsis m-auto">Successful</span>
              </div>
            </div>
            {/*header right part*/}
            <div className="flex-shrink-1 mr-2">
              
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-center mt-[40px] mb-4 text-page-icon-color text-center">
              <div className="p-6 rounded-[50%] relative overflow-hidden w-min text-page-icon-color ">
                <div className="absolute w-[100%] h-[100%] bg-[#4cd9ac] opacity-[0.1] rounded-[50%] left-0 top-0"></div>
                <span className="anticon text-page-icon-color w-[64px] h-[64px] text-[64px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm49.5,85.8-58.6,56a8.1,8.1,0,0,1-5.6,2.2,7.7,7.7,0,0,1-5.5-2.2l-29.3-28a8,8,0,1,1,11-11.6l23.8,22.7,53.2-50.7a8,8,0,0,1,11,11.6Z"></path></svg>
                </span>
              </div>
            </div>
            <div className="mt-4 mb-4 font-semibold text-[24px] text-white leading-tight">
              All done!
            </div>
            <div className="px-[24px] mt-4 mb-[32px] text-[16px] text-white/[0.45]">
              Follow along with product updates or reach out if you have any questions.
            </div>
            <SocialButtonGroup/>
            
          </div>

          <div className="w-[100%] px-4 absolute bottom-0">
            <button 
              className="ant-btn text-[14px] text-white bg-[#004bff] w-[100%] rounded-[8px] mb-[20px] hover:bg-[#2565e6]"
              onClick={()=> {
                navigate('MainScreen');
              }} 
            >
              <span className="anticon">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M128,24A104,104,0,1,0,232,128,104.2,104.2,0,0,0,128,24Zm47.4,107.1a8.7,8.7,0,0,1-1.8,2.6l-33.9,33.9a7.6,7.6,0,0,1-5.6,2.3,7.8,7.8,0,0,1-5.7-2.3,8,8,0,0,1,0-11.3L148.7,136H88a8,8,0,0,1,0-16h60.7L128.4,99.7a8,8,0,0,1,11.3-11.3l33.9,33.9a8.7,8.7,0,0,1,1.8,2.6A8.3,8.3,0,0,1,175.4,131.1Z"></path></svg>
              </span>
              <span className="text-[16px] ml-2 ">Go to Home</span>
            </button>
          </div>
        </div> 
      </Content>
    </Layout>
  );
}
