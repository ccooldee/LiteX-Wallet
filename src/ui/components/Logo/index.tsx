import { fontSizes } from '@/ui/theme/font';

import { Image } from '../Image';
import { Column } from '../Column';
import { Row } from '../Row';
import { Text } from '../Text';

export function Logo(props: { preset?: 'large' | 'small' }) {
  const { preset } = props;
  if (preset === 'large') {
    return (
      <Column justifyCenter itemsCenter mt='xxl'>
        <Image src="./images/logo/wallet-logo.png" size={fontSizes.xxxxl}/>
        <Text text="LiteX Wallet" preset="title-bold" size="xxl" mt='xl' />
      </Column>
    );
  } else {
    return (
      <Row justifyCenter itemsCenter>
        <Image src="./images/logo/wallet-logo.png" size={fontSizes.xxxl} />
        <Text text="LiteX Wallet" preset="title-bold" />
      </Row>
    );
  }
}
