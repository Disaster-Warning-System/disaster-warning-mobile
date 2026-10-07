import { StyleSheet,Text,View } from "react-native";
import type { Shelter } from "@/types/shelter";
export function availabilityStatus(s:Pick<Shelter,"capacity"|"occupancy"|"operationalStatus">){return s.occupancy>=s.capacity?"Full":s.operationalStatus;}
export default function ShelterStatusBadge({shelter}:{shelter:Pick<Shelter,"capacity"|"occupancy"|"operationalStatus">}){const status=availabilityStatus(shelter);const color=status==="Open"?styles.open:status==="Full"?styles.full:styles.closed;return <View style={[styles.badge,color]}><Text style={styles.text}>{status}</Text></View>;}
const styles=StyleSheet.create({badge:{alignSelf:"flex-start",borderRadius:20,paddingHorizontal:10,paddingVertical:5},open:{backgroundColor:"#e5f7ef"},full:{backgroundColor:"#fff3d6"},closed:{backgroundColor:"#e9eef2"},text:{color:"#263746",fontSize:12,fontWeight:"700"}});
