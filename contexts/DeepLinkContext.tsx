import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface DeepLinkParams {
  [key: string]: string | string[] | undefined;
}

interface DeepLinkContextType {
  pendingParams: DeepLinkParams | null;
  setPendingParams: (params: DeepLinkParams) => void;
  clearPendingParams: () => void;
  getAndClearParams: () => DeepLinkParams | null;
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(undefined);

export const DeepLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pendingParams, setPendingParamsState] = useState<DeepLinkParams | null>(null);
  const paramsRef = useRef<DeepLinkParams | null>(null);

  const setPendingParams = useCallback((params: DeepLinkParams) => {
    if (Object.keys(params).length === 0) return;

    console.log('[DeepLinkContext] Storing pending params:', params);
    setPendingParamsState(params);
    paramsRef.current = params;
  }, []);

  const clearPendingParams = useCallback(() => {
    console.log('[DeepLinkContext] Clearing pending params');
    setPendingParamsState(null);
    paramsRef.current = null;
  }, []);

  const getAndClearParams = useCallback(() => {
    const params = paramsRef.current;
    if (params) {
      console.log('[DeepLinkContext] Retrieving and clearing params:', params);
      clearPendingParams();
    }
    return params;
  }, [clearPendingParams]);

  return (
    <DeepLinkContext.Provider value={{ pendingParams, setPendingParams, clearPendingParams, getAndClearParams }}>
      {children}
    </DeepLinkContext.Provider>
  );
};

export const useDeepLink = () => {
  const context = useContext(DeepLinkContext);
  if (context === undefined) {
    throw new Error('useDeepLink must be used within a DeepLinkProvider');
  }
  return context;
};
