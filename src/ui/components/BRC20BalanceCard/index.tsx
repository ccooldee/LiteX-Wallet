import { Tooltip } from 'antd';

import { TokenBalance } from '@/shared/types';
import { colors } from '@/ui/theme/colors';
import { fontSizes } from '@/ui/theme/font';
import { InfoCircleOutlined } from '@ant-design/icons';

import { Card } from '../Card';
import { Column } from '../Column';
import { Row } from '../Row';
import { Text } from '../Text';

export interface BRC20BalanceCardProps {
  tokenBalance: TokenBalance;
  onClick?: () => void;
}

export default function BRC20BalanceCard(props: BRC20BalanceCardProps) {
  const {
    tokenBalance: { ticker, overallBalance, transferableBalance, availableBalance },
    onClick
  } = props;
  return (
    <div className="bg-[#1a1a1a] hover:bg-[#252525] flex flex-col w-[170px] min-w-[170px] h-[160px] min-h-[160px] rounded-[8px] p-2 gap-3 cursor-pointer"
      onClick = {onClick}
    >
      <div className="flex flex-row justify-between"> 
        <img className="w-[30px] h-[30px]" src="./images/logo/ltc20.png"/>
        <div className="text-white font-bold text-[20px]">{ticker}</div>
      </div>
      <div className="flex flex-row justify-between mt-2">
        <div className="text-white text-[12px]">Transferable:</div>
        <div className="text-white text-[14px]">{transferableBalance}</div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="text-white text-[12px]">Available:</div>
        <div className="text-white text-[14px]">{availableBalance}</div>
      </div>
      <div className="flex flex-row justify-between">
        <div className="text-white text-[12px]">Balance:</div>
        <div className="text-white text-[14px]">{overallBalance}</div>
      </div>
    </div>
  );
}
