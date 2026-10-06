import { useNetworkState } from 'expo-network';

export function useNetworkStatus(): { isConnected: boolean } {
  const state = useNetworkState();
  return {
    isConnected: state.isConnected === true && state.isInternetReachable !== false,
  };
}