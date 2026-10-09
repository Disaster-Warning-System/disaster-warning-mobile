import { StyleSheet, Text, View } from 'react-native';

import { AppColors, Radius, Typography } from '@/constants/theme';
import type { ReportStatus } from '@/types/hazardReport';

const STATUS_STYLES: Record<ReportStatus, { background: string; color: string }> = {
  'Pending Verification': { background: '#FFF5D9', color: '#9A6A00' },
  Verified: { background: '#E3F6EC', color: '#087A45' },
  Rejected: { background: '#FDECEC', color: '#9B2520' },
  'Needs More Information': { background: '#E8F2FC', color: '#075B94' },
};

export default function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors = STATUS_STYLES[status];
  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}>
      <View style={[styles.dot, { backgroundColor: colors.color }]} />
      <Text style={[styles.text, { color: colors.color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignItems: 'center', alignSelf: 'flex-start', borderRadius: Radius.pill, flexDirection: 'row', gap: 6, paddingHorizontal: 10, paddingVertical: 6 },
  dot: { borderRadius: 4, height: 7, width: 7 },
  text: { ...Typography.label, fontSize: 12 },
});
