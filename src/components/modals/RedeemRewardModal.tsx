import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { useToast } from '../ui/Toast';
import { ModalSheet } from './ModalSheet';
import { redeemReward } from '../../services/rpc';
import { C, radii, spacing, typography } from '../../theme/tokens';
import type { Child, Reward } from '../../types/app.types';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface RedeemRewardModalProps {
  visible: boolean;
  onClose: () => void;
  reward: Reward | null;
  child: Child | null;
  // Called after a successful redeem with the reward title (for the celebration).
  onRedeemed: (rewardTitle: string) => void;
}

export function RedeemRewardModal({
  visible,
  onClose,
  reward,
  child,
  onRedeemed,
}: RedeemRewardModalProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const current = child?.points ?? 0;
  const cost = reward?.point_cost ?? 0;
  const after = current - cost;
  const affordable = after >= 0;

  const handleRedeem = async () => {
    if (busy || reward === null || child === null) return;
    if (!affordable) {
      toast.show({ message: 'Not enough points yet.', tone: 'error' });
      return;
    }
    setBusy(true);
    const res = await redeemReward(reward.id, child.id);
    setBusy(false);
    if (!res.success) {
      toast.show({ message: res.error, tone: 'error', duration: 5000 });
      return;
    }
    const title = reward.title;
    onClose();
    onRedeemed(title);
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={onClose}
      title="Redeem reward"
      footer={
        <>
          <Button
            label={affordable ? 'Redeem' : 'Not enough points'}
            onPress={handleRedeem}
            loading={busy}
            disabled={!affordable}
            fullWidth
          />
          <Button label="Cancel" variant="ghost" onPress={onClose} fullWidth />
        </>
      }
    >
      {reward === null || child === null ? (
        <Text style={styles.body} maxFontSizeMultiplier={1.4}>
          Nothing to redeem.
        </Text>
      ) : (
        <>
          <GlassCard tint="orange" padding={spacing.s16}>
            <View style={styles.rewardRow}>
              <View style={styles.rewardArt}>
                <Ionicons
                  name={(reward.icon_name as IoniconName) ?? 'gift'}
                  size={28}
                  color={reward.color ?? C.orange}
                />
              </View>
              <View style={styles.rewardMeta}>
                <Text style={styles.rewardTitle} maxFontSizeMultiplier={1.4} numberOfLines={1}>
                  {reward.title}
                </Text>
                {reward.description != null && reward.description !== '' ? (
                  <Text style={styles.rewardDesc} maxFontSizeMultiplier={1.4} numberOfLines={2}>
                    {reward.description}
                  </Text>
                ) : null}
              </View>
            </View>
          </GlassCard>

          <GlassCard padding={spacing.s12}>
            <View style={styles.childRow}>
              <Avatar name={child.name} size="sm" />
              <Text style={styles.childName} maxFontSizeMultiplier={1.4} numberOfLines={1}>
                Redeeming for {child.name}
              </Text>
            </View>
          </GlassCard>

          <GlassCard padding={spacing.s16}>
            <Text style={styles.impactLabel} maxFontSizeMultiplier={1.3}>
              Points impact
            </Text>
            <View style={styles.impactRow}>
              <ImpactCell value={current} label="Balance" />
              <Ionicons name="arrow-forward" size={16} color={C.textLight} />
              <ImpactCell value={cost} label="Cost" tone="orange" prefix="−" />
              <Ionicons name="arrow-forward" size={16} color={C.textLight} />
              <ImpactCell
                value={after}
                label="After"
                tone={affordable ? 'pink' : 'danger'}
              />
            </View>
          </GlassCard>
        </>
      )}
    </ModalSheet>
  );
}

function ImpactCell({
  value,
  label,
  tone = 'neutral',
  prefix = '',
}: {
  value: number;
  label: string;
  tone?: 'neutral' | 'orange' | 'pink' | 'danger';
  prefix?: string;
}) {
  const color =
    tone === 'orange'
      ? '#C36321'
      : tone === 'pink'
        ? C.pink
        : tone === 'danger'
          ? '#B91C1C'
          : C.textDark;
  return (
    <View style={styles.impactCell}>
      <Text style={[styles.impactValue, { color }]} maxFontSizeMultiplier={1.3}>
        {prefix}
        {Math.abs(value)}
      </Text>
      <Text style={styles.impactSub} maxFontSizeMultiplier={1.2}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: C.textMid,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s12,
  },
  rewardArt: {
    width: 48,
    height: 48,
    borderRadius: radii.r14,
    backgroundColor: C.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardMeta: {
    flex: 1,
  },
  rewardTitle: {
    ...typography.title,
    fontSize: 16,
    color: C.textDark,
  },
  rewardDesc: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
  childRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s8,
  },
  childName: {
    ...typography.body,
    color: C.textDark,
    fontFamily: 'DMSans_600SemiBold',
  },
  impactLabel: {
    ...typography.caption,
    color: C.textMid,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: spacing.s12,
  },
  impactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  impactCell: {
    alignItems: 'center',
    flex: 1,
  },
  impactValue: {
    ...typography.title,
    fontSize: 22,
  },
  impactSub: {
    ...typography.caption,
    color: C.textMid,
    marginTop: 2,
  },
});
