// hooks/useCompanyId.ts
import { useEffect, useState } from "react";
import { getCompanyIdbyUser } from '@/lib/companyHelper/companyHelpers'
import { getUser } from '@/lib/user/appwrite'   

export const useCompanyId = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyloading, setLoading] = useState(true);
  const [companyIderror, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanyId = async () => {
      try {
        // Get session token from localStorage
        const sessionToken = localStorage.getItem("sessionToken");
        if (!sessionToken) {
          setError(new Error("No session token found"));
          setLoading(false);
          return;
        }

        // Get user data
        const user = await getUser(sessionToken);
        if (!user || !user.$id) {
          setError(new Error("Invalid user data"));
          setLoading(false);
          return;
        }

        // Get company ID for this user
        const id = await getCompanyIdbyUser(user.$id);
        
        // Log and set the company ID (important: handle case where id might be null)
        console.log("Company ID retrieved:", id);
        setCompanyId(id || null); // Ensure we store null and not undefined
      } catch (err) {
        console.error("Error getting company ID:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, []);

  return { companyId, companyloading, companyIderror };
};