import React from 'react';
import { StyleSheet } from 'react-native';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { TAB_BAR_CLEARANCE } from './layout';

// Stub. Reward creation and point redemption land in Phase 7.
export function RewardsScreen() {
  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Header title="Rewards" />
      <EmptyState
        icon="gift-outline"
        title="Rewards are coming soon"
        description="Define rewards your kids can spend their points on, then redeem them once they've earned enough."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: TAB_BAR_CLEARANCE,
    flexGrow: 1,
    justifyContent: 'center',
  },
});
