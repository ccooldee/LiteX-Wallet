import { useNavigate } from '@/ui/pages/MainRoute';
import { useCurrentAccount } from '@/ui/state/accounts/hooks';
import { shortAddress } from '@/ui/utils';

import { Icon } from '../Icon';
import { Row } from '../Row';
import { Text } from '../Text';
import './index.less';

const AccountSelect = () => {
  const navigate = useNavigate();
  const currentAccount = useCurrentAccount();

  return (
    <Row
      justifyCenter
      px="sm"
      py="sm"
      bg="transparent"
      rounded>
      <Text text={shortAddress(currentAccount?.alianName, 8)} color="black" preset="bold"/>
    </Row>
  );
};

export default AccountSelect;
