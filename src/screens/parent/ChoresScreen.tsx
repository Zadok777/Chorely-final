import React from 'react';
import { StyleSheet } from 'react-native';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { EmptyState } from '../../components/ui/EmptyState';
import { TAB_BAR_CLEARANCE } from './layout';

// Stub. Chore creation, assignment, submission, and approval land in Phase 6.
export function ChoresScreen() {
  return (
    <ScreenContainer scroll contentStyle={styles.content}>
      <Header title="Chores" />
      <EmptyState
        icon="checkbox-outline"
        title="Chores are coming soon"
        description="Create chores, assign them to your kids, and approve completions — all landing in the next build phase."
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
