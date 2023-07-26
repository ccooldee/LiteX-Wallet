import { CSSProperties, useEffect, useState } from 'react';

import { colors } from '@/ui/theme/colors';
import { useWallet } from '@/ui/utils';

import { Column } from '../Column';
import { Input } from '../Input';
import { Row } from '../Row';
import { Text } from '../Text';

enum FeeRateType {
  SLOW,
  AVG,
  FAST,
  CUSTOM
}

export function FeeRateBar({ onChange }: { onChange: (val: number) => void }) {
  const wallet = useWallet();
  const [feeOptions, setFeeOptions] = useState<{ title: string; desc?: string; feeRate: number }[]>([]);

  useEffect(() => {
    wallet.getFeeSummary().then((v) => {
      setFeeOptions([...v.list, { title: 'Custom', feeRate: 0 }]);
    });
  }, []);

  const [feeOptionIndex, setFeeOptionIndex] = useState(FeeRateType.AVG);
  const [feeRateInputVal, setFeeRateInputVal] = useState('');

  useEffect(() => {
    const defaultOption = feeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;

    let val = defaultVal;
    if (feeOptionIndex === FeeRateType.CUSTOM) {
      val = parseInt(feeRateInputVal) || 0;
    } else if (feeOptions.length > 0) {
      val = feeOptions[feeOptionIndex].feeRate;
    }
    onChange(val);
  }, [feeOptions, feeOptionIndex, feeRateInputVal]);

  const adjustFeeRateInput = (inputVal: string) => {
    let val = parseInt(inputVal);
    if (!val) {
      setFeeRateInputVal('');
      return;
    }
    const defaultOption = feeOptions[1];
    const defaultVal = defaultOption ? defaultOption.feeRate : 1;
    if (val <= 0) {
      val = defaultVal;
    }
    setFeeRateInputVal(val.toString());
  };

  return (
    <Column>
      <Row justifyCenter>
        {feeOptions.map((v, index) => {
          const selected = index === feeOptionIndex;
          return (
            <div className="flex flex-col justify-center w-[75px] h-[75px] items-center p-2 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              key={v.title}
              onClick={() => {
                setFeeOptionIndex(index);
              }}
            >
              <Text text={v.title} textCenter style={{ color: selected ? colors.blues : colors.grey }} preset="bold"/>
              {v.title !== 'Custom' && (
                <Text
                  text={`${v.feeRate} lit/vB`}
                  size="xxs"
                  textCenter
                  style={{ color: selected ? colors.blues : colors.grey }}
                  preset="bold"
                />
              )}
              {v.title !== 'Custom' && (
                <Text
                  text={`${v.desc}`}
                  size="xxs"
                  textCenter
                  style={{ color: selected ? colors.blues : colors.grey }}
                  preset="bold"
                />
              )}
            </div>
          );
        })}
      </Row>
      {feeOptionIndex === FeeRateType.CUSTOM && (
        <Input
          preset="amount"
          placeholder={'lit/vB'}
          value={feeRateInputVal}
          onChange={async (e) => {
            adjustFeeRateInput(e.target.value);
          }}
          // onBlur={() => {
          //   const val = parseInt(feeRateInputVal) + '';
          //   setFeeRateInputVal(val);
          // }}
          autoFocus={true}
        />
      )}
    </Column>
  );
}
