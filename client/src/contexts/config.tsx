import React from "react";

const ConfigContext = React.createContext({
  basePath: "",
  serverUrl: "http://localhost:4000",
});

export const useConfig = () => React.useContext(ConfigContext);

const ConfigProvider = ({
  children,
  serverUrl,
  ...props
}: {
  basePath: string;
  serverUrl: string;
  children?: React.ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={{ ...props, serverUrl: serverUrl ?? "http://localhost:4000" }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
