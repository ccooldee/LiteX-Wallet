import { RawTxInfo, ToAddressInfo, TxType } from '@/shared/types';
import { Header } from '@/ui/components';
import { usePushOrdinalsTxCallback } from '@/ui/state/transactions/hooks';
import { useLocationState } from '@/ui/utils';

import { SignPsbt } from '../Approval/components';
import { useNavigate } from '../MainRoute';

interface LocationState {
  rawTxInfo: RawTxInfo;
}
export default function OrdinalsTxConfirmScreen() {
  const { rawTxInfo } = useLocationState<LocationState>();
  const navigate = useNavigate();
  const pushOrdinalsTx = usePushOrdinalsTxCallback();
  return (
    <SignPsbt
      params={{ data: { psbtHex: rawTxInfo.psbtHex, type: TxType.SEND_INSCRIPTION, rawTxInfo } }}
      handleCancel={() => {
        window.history.go(-1);
      }}
      handleConfirm={() => {
        pushOrdinalsTx(rawTxInfo.rawtx).then(({ success, txid, error }) => {
          if (success) {
            navigate('TxSuccessScreen', { txid });
          } else {
            navigate('TxFailScreen', { error });
          }
        });
      }}
    />
  );
}


