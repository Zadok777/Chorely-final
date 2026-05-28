import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useToast } from '../ui/Toast';
import { ModalSheet } from './ModalSheet';
import { createChild } from '../../services/children';
import { useFamilyStore } from '../../store/familyStore';

// COPPA: we collect a child's display name and (optional) date of birth only —
// never email, phone, or any other PII. When a DOB makes the child under 13,
// we flag the row and record that the parent (who is adding them) consented.

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Add the child's name")
    .max(40, 'Keep it under 40 characters'),
  dob: yup
    .string()
    .trim()
    .default('')
    .test(
      'valid-past-date',
      'Use a real past date (YYYY-MM-DD)',
      (value) => {
        if (value === undefined || value === '') return true;
        if (!DATE_PATTERN.test(value)) return false;
        const parsed = new Date(`${value}T00:00:00`);
        return !Number.isNaN(parsed.getTime()) && parsed.getTime() <= Date.now();
      }
    ),
});

type FormValues = yup.InferType<typeof schema>;

function ageFromDob(dob: string): number | null {
  if (!DATE_PATTERN.test(dob)) return null;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const monthDiff = now.getMonth() - d.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) {
    age -= 1;
  }
  return age;
}

interface AddChildModalProps {
  visible: boolean;
  onClose: () => void;
  onAdded: () => void;
}

export function AddChildModal({ visible, onClose, onAdded }: AddChildModalProps) {
  const toast = useToast();
  const family = useFamilyStore((s) => s.family);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: { name: '', dob: '' },
  });

  const close = () => {
    reset({ name: '', dob: '' });
    onClose();
  };

  const onSubmit = async (values: FormValues) => {
    if (submitting) return;
    if (family === null) {
      toast.show({ message: 'No family loaded.', tone: 'error' });
      return;
    }
    setSubmitting(true);
    const dob = values.dob.trim();
    const age = dob === '' ? null : ageFromDob(dob);
    const under13 = age !== null && age < 13;

    const res = await createChild({
      family_id: family.id,
      name: values.name,
      date_of_birth: dob === '' ? null : dob,
      is_under_13: under13,
      parental_consent_given: under13,
      parental_consent_at: under13 ? new Date().toISOString() : null,
    });
    setSubmitting(false);

    if (!res.success) {
      toast.show({ message: res.error, tone: 'error', duration: 5000 });
      return;
    }
    useFamilyStore.getState().upsertChild(res.data);
    toast.show({ message: `${res.data.name} added.`, tone: 'success' });
    reset({ name: '', dob: '' });
    onAdded();
    onClose();
  };

  return (
    <ModalSheet
      visible={visible}
      onClose={close}
      title="Add a child"
      footer={
        <>
          <Button
            label="Add child"
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
            fullWidth
          />
          <Button label="Cancel" variant="ghost" onPress={close} fullWidth />
        </>
      }
    >
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            label="Child's name"
            placeholder="Sofia"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            autoCapitalize="words"
            maxLength={40}
            error={errors.name?.message}
          />
        )}
      />
      <Controller
        name="dob"
        control={control}
        render={({ field }) => (
          <Input
            label="Date of birth (optional)"
            placeholder="YYYY-MM-DD"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            autoCorrect={false}
            maxLength={10}
            helper="Only a name and birthday — never an email or phone for kids."
            error={errors.dob?.message}
          />
        )}
      />
    </ModalSheet>
  );
}
