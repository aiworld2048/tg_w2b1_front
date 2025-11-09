import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '../contexts/AuthContext';

const EMPTY_OBJECT = {};

const useFetch = (url, options = {}) => {
  const { auth, logout } = useContext(AuthContext);

  const {
    method = 'GET',
    headers: headersOption,
    body,
    requiresAuth = true,
    transformResponse,
    onUnauthorized,
    skip = false,
    initialData,
  } = options || {};

  const [data, setData] = useState(
    initialData !== undefined ? initialData : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const transformRef = useRef(transformResponse);

  useEffect(() => {
    if (initialData !== undefined) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    transformRef.current = transformResponse;
  }, [transformResponse]);

  const defaultUnauthorizedHandler = useCallback(() => {
    if (logout) {
      logout();
    }
  }, [logout]);

  const unauthorizedHandler = onUnauthorized || defaultUnauthorizedHandler;

  const headersKey = useMemo(
    () => (headersOption ? JSON.stringify(headersOption) : ''),
    [headersOption]
  );

  const normalizedHeaders = useMemo(
    () => (headersOption ? headersOption : EMPTY_OBJECT),
    [headersKey]
  );

  const memoizedHeaders = useMemo(() => {
    const resolvedHeaders = {
      Accept: 'application/json',
      ...normalizedHeaders,
    };

    if (body && !resolvedHeaders['Content-Type']) {
      resolvedHeaders['Content-Type'] = 'application/json';
    }

    if (requiresAuth && auth && !resolvedHeaders.Authorization) {
      resolvedHeaders.Authorization = `Bearer ${auth}`;
    }

    return resolvedHeaders;
  }, [auth, body, headersKey, normalizedHeaders, requiresAuth]);

  useEffect(() => {
    if (!url || skip) {
      setLoading(false);
      return;
    }

    const abortController = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(url, {
          method,
          headers: memoizedHeaders,
          body,
          signal: abortController.signal,
        });

        if (response.status === 401) {
          unauthorizedHandler?.();
          setError('Unauthorized');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(response.statusText || 'Something Went Wrong!');
        }

        const payload = await response.json();
        const resolvedData = transformRef.current
          ? transformRef.current(payload)
          : payload?.data ?? payload;

        setData(resolvedData);
        setLoading(false);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'Something Went Wrong!');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [
    url,
    method,
    body,
    memoizedHeaders,
    unauthorizedHandler,
    skip,
  ]);

  return { data, loading, error };
};

export default useFetch;