import { colors } from '@/ui/theme/colors';

import { Column } from '../Column';
import { Icon } from '../Icon';
import { Row } from '../Row';
import { Text } from '../Text';

export interface BRC20PreviewProps {
  tick: string;
  balance: string;
  inscriptionNumber: number;
  timestamp?: number;
  type?: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function BRC20Preview({
  tick,
  balance,
  inscriptionNumber,
  timestamp,
  type,
  selected,
  onClick
}: BRC20PreviewProps) {
  if (!balance) {
    balance = 'deploy';
  }
  return (
    <Column
      style={{ backgroundColor: colors.bg4, width: 120, height: 130, minWidth: 100, minHeight: 130, borderRadius: 5}}
      onClick={onClick}>
      <Column
        style={{
          padding: 8,
          paddingTop: 20,
          height: 96,
          backgroundColor: type === 'TRANSFER' ? (selected ? '#384a9c' : '#171d3b') : '#000',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5
        }}>
        <Row justifyCenter>
          <Text text={tick} color="white_muted" size="lg" />
        </Row>
        <Row justifyCenter>
          <Text text={balance} size="xl" textCenter />
        </Row>
      </Column>

      <Column px="sm" pb="sm" gap="sm">
        <Row justifyCenter gap="sm">
          <Text text={`#${inscriptionNumber}`} color="primary" />
          {selected && <Icon icon="circle-check" color="green" style={{ marginRight: 5 }} />}
        </Row>
      </Column>
    </Column>
  );
}
