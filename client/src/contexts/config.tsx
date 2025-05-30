import React from "react";

const ConfigContext = React.createContext({
  basePath: "",
});

export const useConfig = () => React.useContext(ConfigContext);

const ConfigProvider = ({
  children,
  ...props
}: {
  basePath: string;
  children?: React.ReactNode;
}) => {
  return (
    <ConfigContext.Provider value={props}>{children}</ConfigContext.Provider>
  );
};

export default ConfigProvider;
