import { useCallback,useEffect,useState } from "react";
import { getShelters } from "@/services/api/shelterApi";
import type { Shelter } from "@/types/shelter";
export function useShelters(){const[shelters,setShelters]=useState<Shelter[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState("");const refresh=useCallback(async()=>{setLoading(true);setError("");try{setShelters(await getShelters());}catch(e){setError(e instanceof Error?e.message:"Could not load shelters.");}finally{setLoading(false);}},[]);useEffect(()=>{void refresh();},[refresh]);return{shelters,loading,error,refresh};}
