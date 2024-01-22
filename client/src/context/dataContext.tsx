'use client';
import { FC, PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { authRoutes } from "@/router/routes";
import UserService from "@/services/UserService";

const DataContext = createContext<any>('');

export const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [data, setData] = useState<{}>({});
  const { pathname } = useRouter();

  useEffect(() => {
    async function getData() {
      if(!authRoutes.includes(pathname) && !Object.keys(data).length) {
        try {          
          const response = await UserService.getUserData();

          if (response.status === 200) {
            setData(response.data);
            // console.log('CONTEXT DATA', response);
          }
        } catch (err) {
          console.log(err);          
        }
      }
    }

    getData();
  }, [pathname])

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  )
}

export const useDataContext = () => useContext(DataContext);