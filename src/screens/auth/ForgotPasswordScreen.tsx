import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Header } from '../../components/layout/Header';
import { ScreenContainer } from '../../components/layout/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';
import { requestPasswordReset } from '../../services/auth';
import {
  spacing,
  typography,
  useThemedStyles,
  type Palette,
} from '../../theme';
import type { RootStackParamList } from '../../types/app.types';

type Nav = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Email is required')
    .email('Enter a valid email'),
});

type FormValues = yup.InferType<typeof schema>;

export function ForgotPasswordScreen() {
  const nav = useNavigation<Nav>();
  const toast = useToast();
  const styles = useThemedStyles(makeStyles);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    setSubmitting(true);
    const email = values.email.trim();
    const res = await requestPasswordReset(email);
    setSubmitting(false);

    if (!res.success) {
      toast.show({ message: res.error, tone: 'error', duration: 5000 });
      return;
    }
    toast.show({ message: 'Check your email for a code.', tone: 'success' });
    nav.navigate('ResetPassword', { email });
  };

  return (
    <ScreenContainer keyboardAvoiding scroll>
      <Header title="Reset password" onBack={() => nav.goBack()} />

      <View style={styles.intro}>
        <Text style={styles.helper} maxFontSizeMultiplier={1.5}>
          Enter your email and we&apos;ll send you a code to reset your
          password.
        </Text>
      </View>

      <View style={styles.form}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email"
              placeholder="you@example.com"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              error={errors.email?.message}
            />
          )}
        />

        <View style={styles.submit}>
          <Button
            label="Send code"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            fullWidth
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const makeStyles = (C: Palette) =>
  StyleSheet.create({
    intro: {
      marginTop: spacing.s8,
      marginBottom: spacing.s16,
    },
    helper: {
      ...typography.body,
      color: C.textMid,
    },
    form: {
      gap: spacing.s16,
    },
    submit: {
      marginTop: spacing.s8,
    },
  });
