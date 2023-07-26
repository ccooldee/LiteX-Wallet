/* eslint-disable indent */
import { useEffect, useState } from 'react';

import { colors } from '@/ui/theme/colors';

import { Column } from '../Column';
import { Row } from '../Row';
import { Text } from '../Text';
import './index.less';

interface TabProps {
  key: string | number;
  label: string;
}

interface TabBarProps {
  defaultActiveKey?: string | number;
  activeKey?: string | number;
  items: TabProps[];
  onTabClick: (string) => void;
  progressEnabled?: boolean;
  preset?: string;
}

export function MainTabBar(props: TabBarProps) {
  const { items, defaultActiveKey, activeKey, onTabClick, progressEnabled, preset } = props;
  const [tabKey, setTabKey] = useState(defaultActiveKey);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const curIndex = items.findIndex((v) => v.key === tabKey);
    setProgress(curIndex);
    onTabClick(tabKey);
  }, [tabKey]);

  useEffect(() => {
    if (activeKey !== tabKey) {
      setTabKey(activeKey);

      const curIndex = items.findIndex((v) => v.key === activeKey);
      setProgress(curIndex);
    }
  }, [activeKey]);

  if (preset == 'number-page') {
    return (
      <Row>
        {items.map((v, index) => {
          const isSelected = v.key === tabKey;
          const reach = isSelected; //index <= (tabKey as number);
          return (
            <Column
              key={v.key}
              style={Object.assign(
                { width: 20, height: 20 },
                reach
                  ? {
                      backgroundColor: colors.gold
                    }
                  : {
                      backgroundColor: colors.bg2
                    }
              )}
              justifyCenter
              itemsCenter
              onClick={() => {
                setTabKey(v.key);
              }}>
              <Text text={v.label} color={'white'} />
            </Column>
          );
        })}
      </Row>
    );
  }

  return (
    <Row justifyBetween gap="xl">
      {items.map((v, index) => {
        const isSelected = v.key === tabKey;
        if (progressEnabled && index > progress) {
          return (
            <Column key={v.key}>
              <Text text={v.label} color={'black'} />
            </Column>
          );
        } else {
          return (
            // <Column
            //   key={v.key}
            //   classname={isSelected ? 'selected-tab' : ''}
            //   onClick={() => {
            //     setTabKey(v.key);
            //   }}>
            //   <Text text={v.label} color={isSelected ? 'blues' : 'black'} preset="bold" size="lg"/>
            // </Column>
            <>
            { isSelected ? 
              <Column
                style={{borderBottom: 'solid', borderBottomWidth: '2px', borderColor: colors.blues}}
                key={v.key}
                classname={isSelected ? 'selected-tab' : ''}
                onClick={() => {
                  setTabKey(v.key);
                }}>
                <Text text={v.label} color='blues' preset="bold" size="lg"/>
              </Column>:
              <Column
                key={v.key}
                classname={isSelected ? 'selected-tab' : ''}
                onClick={() => {
                  setTabKey(v.key);
              }}>
                <Text text={v.label} color='black' preset="bold" size="lg"/>
              </Column>}
            </>
          );
        }
      })}
      <hr className="break-line"/>
    </Row>
  );
}
