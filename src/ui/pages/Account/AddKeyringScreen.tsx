import { Card, Column, Content, Header, Layout, Text } from '@/ui/components';
import { colors } from '@/ui/theme/colors';
import { useNavigate } from '../MainRoute';

export default function AddKeyringScreen() {
  const navigate = useNavigate();
  return (
    <Layout>
      <Header
        onBack={() => {
          window.history.go(-1);
        }}
        title="Create a new wallet"
      />
      <Content>
        <Column>
          <Text text="Create Wallet" preset="bold" color="blues" size="xl" style={{marginTop: '8px'}}/>
          <div className="flex flex-row justify-center items-center max-w-sm p-4 my-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" onClick={(e) => {
            navigate('CreateHDWalletScreen', { isImport: false });
          }}>
            <Column full justifyCenter>
              <Text text="Create with mnemonics" size="md" preset="bold" color="grey"/>
            </Column>
          </div>

          {/* <Card
            justifyCenter
            onClick={(e) => {
              navigate('CreateHDWalletScreen', { isImport: false, words: 24 });
            }}>
            <Column full justifyCenter>
              <Text text="Create with mnemonics (24-words)" size="sm" />
            </Column>
          </Card> */}

          <Text text="Restore Wallet" preset="bold" color="blues" size="xl" />

          <div className="flex flex-row justify-center items-center min-w-full p-4 my-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" onClick={(e) => {
            navigate('CreateHDWalletScreen', { isImport: true });
          }}>
            <Column full justifyCenter>
              <Text text="Restore from mnemonics" size="md" preset="bold" color="grey"/>
            </Column>
          </div>


          {/* <Card
            justifyCenter
            onClick={(e) => {
              navigate('CreateHDWalletScreen', { isImport: true, words: 24 });
            }}>
            <Column full justifyCenter>
              <Text text="Restore from mnemonics (24-words)" size="sm" />
            </Column>
          </Card> */}

          <div className="flex flex-row justify-center items-center min-w-full p-4 my-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700" onClick={(e) => {
            navigate('CreateSimpleWalletScreen');
          }}>
            <Column full justifyCenter>
              <Text text="Restore from single private key" size="md" preset="bold" color="grey"/>
            </Column>
          </div>
        </Column>
      </Content>
    </Layout>
  );
}
