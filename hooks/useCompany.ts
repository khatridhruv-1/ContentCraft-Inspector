import { useCurrentUser } from '@/hooks/useCurrentUser';

export const useCompanyId = () => {
  const { companyId } = useCurrentUser();

  return { companyId, companyloading: false, companyIderror: null as Error | null };
};
