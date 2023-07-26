import { Tooltip } from 'antd';
import { CSSProperties, useEffect, useState } from 'react';

import { Inscription, NftInfo } from '@/shared/types';
import { colors } from '@/ui/theme/colors';
import { fontSizes } from '@/ui/theme/font';

import { formatDate } from '../../utils';
import { Column } from '../Column';
import Iframe from '../Iframe';
import { Row } from '../Row';
import { Text } from '../Text';
import './index.less';

function getDateShowdate(date: Date) {
  if (date.getTime() < 100) {
    return 'unconfirmed';
  } else {
    const old = Date.now() - date.getTime();
    if (old < 60 * 1000) {
      return `${Math.floor(old / 1000)} secs ago`;
    }
    if (old < 1000 * 60 * 60) {
      return `${Math.floor(old / 60000)} mins ago`;
    }
    if (old < 1000 * 60 * 60 * 24) {
      return `${Math.floor(old / 3600000)} hours ago`;
    }
    if (old < 1000 * 60 * 60 * 24 * 30) {
      return `${Math.floor(old / 86400000)} days ago`;
    }
  }
  return formatDate(date, 'yyyy-MM-dd');
}

const $viewPresets = {
  large: {},

  medium: {},

  small: {}
};

const $containerPresets: Record<Presets, CSSProperties> = {
  large: {
    backgroundColor: colors.black,
    width: 300
  },
  medium: {
    backgroundColor: colors.black,
    width: 144,
    height: 180
  },
  small: {
    backgroundColor: colors.black,
    width: 80
  }
};

const $iframePresets: Record<Presets, CSSProperties> = {
  large: {
    width: 300,
    height: 300
  },
  medium: {
    width: 90,
    height: 90
  },
  small: {
    width: 80,
    height: 80
  }
};

const $timePresets: Record<Presets, string> = {
  large: 'sm',
  medium: 'sm',
  small: 'xxs'
};

const $numberPresets: Record<Presets, string> = {
  large: 'md',
  medium: 'sm',
  small: 'xxs'
};

type Presets = keyof typeof $viewPresets;

export interface InscriptionProps {
  data: Inscription;
  onClick?: (data: any) => void;
  preset: Presets;
}

export default function InscriptionPreview({ data, onClick, preset }: InscriptionProps) {
  const date = new Date(data.timestamp * 1000);
  const time = getDateShowdate(date);
  const isUnconfirmed = date.getTime() < 100;
  const numberStr = isUnconfirmed ? 'unconfirmed' : `# ${data.inscriptionNumber}`;
  const [isNft, setIsNft] = useState(false);
  const init: NftInfo = {
    amount: '',
    option: '',
    tick: ''
  }
  const [Nft, setNft] = useState(init);

  const fetchData = async () => {
    if (data.contentType.includes('text/plain'))
    {
      try {
        let response = await fetch(data.content);
        response = await (response.json());
        setIsNft(true);
        setNft({amount: response.amt, option: response.op, tick: response.tick});
      } catch (e) {
        //console.log(e);
      } finally {
        //console.log('');
      }
    }     
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  return (
    <>
      {
        preset === 'medium' && 
        <div 
          onClick={onClick} 
          className="bg-[#131516] hover:border-white/[0.5] border-white/[0.15] border-solid border-[2px] flex flex-col w-[170px] min-w-[170px] h-[170px] min-h-[170px] rounded-[8px] p-2 cursor-pointer items-center"
        >
          <div className="text-[16px] text-white">Ordinals</div>
          <Iframe preview={data.preview} style={$iframePresets[preset]} />
          <div className="text-[14px] text-white/[0.65]">{numberStr}</div>
        </div>
      }
      {
        preset === 'large' && 
        <div 
          onClick={onClick} 
          className="bg-[#131516] hover:border-white/[0.5] border-white/[0.15] border-solid border-[2px] flex flex-col w-[340px] min-w-[340px] h-[340px] min-h-[340px] rounded-[8px] p-2 cursor-pointer items-center"
        >
          <div className="text-[24px] text-white">Ordinals</div>
          <Iframe preview={data.preview} style={$iframePresets[preset]} />
          <div className="text-[20px] text-white/[0.65]">{time}</div>
        </div>
      }
      {
        (preset === 'small' && isNft === false ) &&
        <div 
          className="bg-[#131516] border-white/[0.15] border-solid border-[2px] flex flex-col w-[150px] min-w-[150px] h-[140px] min-h-[140px] rounded-[8px] p-2 items-center"
        >
          <div className="text-[16px] text-white">Ordinals</div>
          <Iframe preview={data.preview} style={$iframePresets[preset]} />
          <div className="text-[14px] text-white/[0.65]">{numberStr}</div>
        </div>
      }
      {
        (preset === 'small' && isNft === true ) && 
        <div 
          className="bg-[#131516] border-white/[0.15] border-solid border-[2px] flex flex-col w-[150px] min-w-[150px] h-[140px] min-h-[140px] rounded-[8px] p-2 items-center gap-2"
        >
          <div className="text-[16px] text-white font-bold">{Nft.option}</div>
          <div className="text-[40px] text-blue-700 font-bold">{Nft.tick}</div>
          <div className="text-[16px] text-white/[0.65]">{Nft.amount}</div>
        </div>
      }
    </>
  );
}

/*
<Column gap="zero" onClick={onClick} style={Object.assign({ position: 'relative' }, $containerPresets[preset])}>
  <Iframe preview={data.preview} style={$iframePresets[preset]} />
  <div style={Object.assign({ position: 'absolute', zIndex: 10 }, $iframePresets[preset])}>
    <Column fullY>
      <Row style={{ flex: 1 }} />
      <Row fullX justifyEnd mb="sm">
        <Tooltip
          title={`The UTXO containing this inscription has ${data.outputValue} lits`}
          overlayStyle={{
            fontSize: fontSizes.xs
          }}>
          <div>
            <Text
              text={`${data.outputValue} lits`}
              size="xs"
              style={{
                backgroundColor: '#212f40',
                padding: 2,
                borderRadius: 5,
                paddingLeft: 4,
                paddingRight: 4,
                marginRight: 2
              }}
            />
          </div>
        </Tooltip>
      </Row>
    </Column>
  </div>
  <Column px="md" py="sm" gap="zero" bg="bg5" full>
    <Text text={numberStr} color="white" size={$numberPresets[preset] as any} />
    {isUnconfirmed == false && <Text text={time} preset="sub" size={$timePresets[preset] as any} />}
  </Column>
</Column>
*/