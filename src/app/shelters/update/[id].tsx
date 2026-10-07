import { Redirect } from 'expo-router';

export default function ShelterManagementUnavailable() {
  return <Redirect href='/(tabs)/shelters' />;
}
