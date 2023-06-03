import { useEffect, useState } from 'react';

export default function useFetch<T>(url: string) {
  const [data, setData] = useState<T | undefined>();
  const [error, setError] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setData(undefined);
    setLoading(true);
    // sdkAuthRequest<T>(url, { signal })
    //   .then((response: T) => {
    //     setData(response);
    //   })
    //   .catch(err => {
    //     if(err.type === "CREDENTIAL_EXPIRED"){
    //         deleteFromLocalStorage(AUTH_TOKEN);
    //         deleteFromLocalStorage('PROFILE');
    //         window.location.href = '/ingresar'
    //     }        
    //     setError(err)
    //   })
    //   .finally(() => {
    //     setLoading(false)
    //   });

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, error, loading };
}