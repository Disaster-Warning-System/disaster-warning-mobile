import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from '@/components/common/Card';
import EmptyState from '@/components/common/EmptyState';
import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import ShelterCard from '@/components/shelters/ShelterCard';
import { AppColors, Radius, Typography } from '@/constants/theme';
import { useShelters } from '@/hooks/useShelters';

export default function CitizenShelterDashboard() {
  const router = useRouter();
  const { shelters, loading, error, refresh } = useShelters();

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh]),
  );

  const summary = useMemo(
    () => ({
      open: shelters.filter(
        (shelter) =>
          shelter.operationalStatus === 'Open' &&
          shelter.occupancy < shelter.capacity,
      ).length,
      spaces: shelters
        .filter((shelter) => shelter.operationalStatus === 'Open')
        .reduce((total, shelter) => total + shelter.availableSpaces, 0),
      full: shelters.filter(
        (shelter) => shelter.occupancy >= shelter.capacity,
      ).length,
    }),
    [shelters],
  );

  const previews = shelters.slice(0, 2);

  return (
    <View style={styles.section}>
      <View style={styles.headingRow}>
        <View style={styles.headingCopy}>
          <Text style={styles.eyebrow}>SHELTER AVAILABILITY</Text>
          <Text style={styles.title}>Emergency shelters</Text>
          <Text style={styles.subtitle}>
            Check current capacity and available spaces.
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="View all emergency shelters"
          onPress={() => router.navigate('/(tabs)/shelters')}
          style={styles.viewAllIcon}
        >
          <Ionicons name="arrow-forward" size={18} color={AppColors.primary} />
        </Pressable>
      </View>

      {error ? (
        <View style={styles.errorWrap}>
          <ErrorMessage message={error} />
          <Pressable
            accessibilityRole="button"
            onPress={() => void refresh()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try loading shelters again</Text>
          </Pressable>
        </View>
      ) : null}

      {loading && shelters.length === 0 ? (
        <Card style={styles.loadingCard}>
          <Loading size="small" color={AppColors.primary} />
          <Text style={styles.muted}>Loading shelter availability...</Text>
        </Card>
      ) : null}

      {!loading && !error && shelters.length === 0 ? (
        <EmptyState
          icon="business-outline"
          title="No shelters listed yet"
          description="Shelter information will appear here when it is available."
        />
      ) : null}

      {shelters.length > 0 ? (
        <>
          <View style={styles.summaryRow}>
            <SummaryCard label="Open" value={summary.open} />
            <SummaryCard label="Open spaces" value={summary.spaces} />
            <SummaryCard label="Full" value={summary.full} />
          </View>

          <View style={styles.previewHeading}>
            <Text style={styles.previewTitle}>Shelter preview</Text>
            <Text style={styles.muted}>Tap a shelter for its details</Text>
          </View>
          {previews.map((shelter) => (
            <ShelterCard
              key={shelter.id}
              shelter={shelter}
              onPress={() =>
                router.push({
                  pathname: '/shelters/[id]',
                  params: { id: shelter.id },
                })
              }
            />
          ))}

          <Pressable
            accessibilityRole="button"
            onPress={() => router.navigate('/(tabs)/shelters')}
            style={styles.browseButton}
          >
            <Text style={styles.browseText}>Browse all shelters</Text>
            <Ionicons name="chevron-forward" size={17} color={AppColors.primary} />
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <Card style={styles.summaryCard}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 22 },
  headingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headingCopy: { flex: 1, paddingRight: 12 },
  eyebrow: {
    ...Typography.label,
    color: AppColors.primary,
    fontSize: 10,
    letterSpacing: 1.1,
  },
  title: { ...Typography.sectionTitle, color: AppColors.text, marginTop: 3 },
  subtitle: { ...Typography.secondary, color: AppColors.muted, marginTop: 3 },
  viewAllIcon: {
    alignItems: 'center',
    backgroundColor: AppColors.primarySoft,
    borderRadius: Radius.pill,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  errorWrap: { marginBottom: 10 },
  retryButton: { alignSelf: 'flex-start', marginTop: 8, paddingVertical: 4 },
  retryText: { ...Typography.label, color: AppColors.primary },
  loadingCard: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 14,
  },
  muted: { ...Typography.secondary, color: AppColors.muted, fontSize: 12 },
  summaryRow: { flexDirection: 'row', gap: 8, marginBottom: 18 },
  summaryCard: { flex: 1, paddingHorizontal: 10, paddingVertical: 12 },
  summaryValue: {
    ...Typography.sectionTitle,
    color: AppColors.text,
    fontSize: 20,
    textAlign: 'center',
  },
  summaryLabel: {
    ...Typography.secondary,
    color: AppColors.muted,
    fontSize: 10,
    lineHeight: 14,
    marginTop: 3,
    textAlign: 'center',
  },
  previewHeading: {
    alignItems: 'baseline',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  previewTitle: { ...Typography.label, color: AppColors.text },
  browseButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 4,
    paddingVertical: 8,
  },
  browseText: { ...Typography.label, color: AppColors.primary },
});
