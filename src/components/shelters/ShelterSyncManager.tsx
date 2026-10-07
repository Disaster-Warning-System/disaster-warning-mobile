import { useEffect } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { syncPendingShelterUpdates } from "@/services/sync/shelterSyncService";
export default function ShelterSyncManager(){const{isConnected}=useNetworkStatus();useEffect(()=>{if(isConnected)void syncPendingShelterUpdates().catch(e=>console.error("Shelter update sync failed.",e));},[isConnected]);return null;}
