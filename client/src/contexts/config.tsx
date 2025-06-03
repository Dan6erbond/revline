import React from "react";

const ConfigContext = React.createContext({
  basePath: "",
  serverUrl: "",
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
    <ConfigContext.Provider value={{ ...props, serverUrl }}>
      {children}
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
