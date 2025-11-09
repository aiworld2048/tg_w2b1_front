import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from '../hooks/baseUrl';

const AuthContext = createContext({
  auth: null,
  user: null,
  updateProfile: () => {},
  logout: () => {},
  createGuestAccount: () => {},
  authenticate: () => {},
  refreshProfile: () => Promise.resolve(null),
});

const POLLING_INTERVAL = 15000;

const normalizeToken = (value) => {
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed.startsWith('Bearer ') ? trimmed.slice(7) : trimmed;
};

const readStoredToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  const stored = window.localStorage.getItem('token');
  const normalized = normalizeToken(stored);
  if (normalized && stored !== normalized) {
    window.localStorage.setItem('token', normalized);
  }
  return normalized;
};

const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(readStoredToken);
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : null;
  });
  const pollingRef = useRef(null);

  const clearPollingTimer = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const updateProfile = useCallback((nextProfileOrUpdater) => {
    setProfile((previousProfile) => {
      const resolvedProfile =
        typeof nextProfileOrUpdater === 'function'
          ? nextProfileOrUpdater(previousProfile)
          : nextProfileOrUpdater || null;

      if (resolvedProfile) {
        localStorage.setItem('userProfile', JSON.stringify(resolvedProfile));
      } else {
        localStorage.removeItem('userProfile');
      }

      return resolvedProfile;
    });
  }, []);

  const logout = useCallback(() => {
    clearPollingTimer();
    setToken(null);
    setProfile(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userProfile');
    navigate('/?type=all', { replace: true });
  }, [clearPollingTimer, navigate]);

  const fetchProfile = useCallback(async (activeToken) => {
    if (!activeToken) {
      return null;
    }

    const response = await fetch(`${BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${activeToken}`,
        Accept: 'application/json',
      },
    });

    if (response.status === 401) {
      const error = new Error('Unauthorized');
      error.code = 401;
      throw error;
    }

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data?.data ?? null;
  }, []);

  const refreshProfile = useCallback(
    async (activeToken) => {
      const tokenToUse = activeToken ?? token;
      if (!tokenToUse) {
        return null;
      }

      try {
        const latestProfile = await fetchProfile(tokenToUse);
        if (latestProfile) {
          updateProfile((currentProfile) =>
            currentProfile
              ? { ...currentProfile, ...latestProfile }
              : latestProfile
          );
        }
        return latestProfile;
      } catch (error) {
        if (error.code === 401) {
          logout();
        } else {
          console.error('Error refreshing profile:', error);
        }
        return null;
      }
    },
    [token, fetchProfile, updateProfile, logout]
  );

  const authenticate = useCallback(
    async (nextToken, profileData, options = {}) => {
      const normalizedToken = normalizeToken(nextToken);
      if (!normalizedToken) {
        logout();
        return;
      }

      setToken(normalizedToken);
      try {
        localStorage.setItem('token', normalizedToken);
      } catch (error) {
        console.warn('Unable to persist auth token:', error);
      }

      if (profileData) {
        updateProfile(profileData);
      } else if (!options.skipProfileFetch) {
        await refreshProfile(normalizedToken);
      }
    },
    [logout, refreshProfile, updateProfile]
  );
  const createGuestAccount = useCallback(
    async (userData, guestToken) => {
      await authenticate(guestToken, userData, { skipProfileFetch: true });
    },
    [authenticate]
  );

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('userProfile');
    }
  }, [token]);

  useEffect(() => {
    clearPollingTimer();

    if (!token) {
      return undefined;
    }

    const run = () => {
      refreshProfile();
    };

    run();
    pollingRef.current = setInterval(run, POLLING_INTERVAL);

    return () => {
      clearPollingTimer();
    };
  }, [token, refreshProfile, clearPollingTimer]);

  const value = useMemo(
    () => ({
      auth: token,
      user: profile,
      updateProfile,
      logout,
      createGuestAccount,
      authenticate,
      refreshProfile,
    }),
    [token, profile, updateProfile, logout, createGuestAccount, authenticate, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthContextProvider };
