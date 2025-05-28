export const FetchChatContext = createContext();

export const chatDataFlow = ({ children }) => {
  return (
    <FetchChatContext.Provider value={{}}>{children}</FetchChatContext.Provider>
  );
};
