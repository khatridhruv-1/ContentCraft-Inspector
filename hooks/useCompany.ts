// hooks/useCompanyId.ts
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCompanyIdbyUser } from '@/lib/companyHelper/companyHelpers'
import { getUser } from '@/lib/user/appwrite'

export const useCompanyId = () => {
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [companyloading, setLoading] = useState(true);
  const [companyIderror, setError] = useState<Error | null>(null);
  const router = useRouter();

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
      } catch (err: unknown) {
        const msg = (err as Error)?.message ?? '';
        if (msg === 'SESSION_EXPIRED') {
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('documentId');
          router.push('/auth/login');
          return;
        }
        setError((err as Error)?.message ? (err as Error) : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyId();
  }, [router]);

  return { companyId, companyloading, companyIderror };
};