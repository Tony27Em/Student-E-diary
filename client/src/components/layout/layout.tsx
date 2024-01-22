import { FC, PropsWithChildren, useState } from 'react';
import Header from './header';
import SidebarLeft from './sidebar-left';
import SidebarRight from './sidebar-right';
import { Drawer } from '@mui/material';

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

  const toggleLeftSidebar = (state: boolean): void => setIsLeftOpen(state);
  const toggleRightSidebar = (state: boolean): void => setIsRightOpen(state);

  return (
    <div>
      <Drawer
        anchor='left'
        open={isLeftOpen}
        onClose={() => setIsLeftOpen(false)}
      >
        <SidebarLeft closeSidebar={toggleLeftSidebar} />
      </Drawer>

      <Drawer
        anchor='right'
        open={isRightOpen}
        onClose={() => setIsRightOpen(false)}
      >
        <SidebarRight closeSidebar={toggleRightSidebar} />
      </Drawer>

      <Header openSidebars={{ toggleLeftSidebar, toggleRightSidebar }} />

      <main>{children}</main>
    </div>
  )
}

export default Layout;
