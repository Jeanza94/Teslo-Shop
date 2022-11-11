import { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Link from "next/link"
import { AuthContext, UiContext } from "../../context"
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, DashboardOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"


export const SideMenu = () => {

    const router = useRouter();
    const { isLoggedIn, user, logoutUser } = useContext(AuthContext);
    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const [searchTerm, setSearchTerm] = useState('');

    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`);
    }




    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }} >

                <List>

                    <ListItem>
                        <Input
                            autoFocus
                            type='text'
                            placeholder="Buscar..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItem
                        button
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                    >
                        <ListItemIcon>
                            <AccountCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItem>

                    <ListItem
                        button
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                        onClick={() => navigateTo('/orders/history')}
                    >
                        <ListItemIcon>
                            <ConfirmationNumberOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItem>

                    <Link href='/category/men' className="link" onClick={toggleSideMenu}>
                        <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                            <ListItemIcon>
                                <MaleOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Hombres'} />
                        </ListItem>
                    </Link>

                    <Link href='/category/women' className='link' onClick={toggleSideMenu}>
                        <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                            <ListItemIcon>
                                <FemaleOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Mujeres'} />
                        </ListItem>
                    </Link>

                    <Link href='/category/kid' className='link' onClick={toggleSideMenu}>
                        <ListItem button sx={{ display: { xs: '', sm: 'none' } }}>
                            <ListItemIcon>
                                <EscalatorWarningOutlined />
                            </ListItemIcon>
                            <ListItemText primary={'Niños'} />
                        </ListItem>
                    </Link>

                    <ListItem
                        button
                        sx={{ display: !isLoggedIn ? 'flex' : 'none' }}
                        onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}
                    >
                        <ListItemIcon>
                            <VpnKeyOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItem>

                    <ListItem
                        button
                        sx={{ display: isLoggedIn ? 'flex' : 'none' }}
                        onClick={logoutUser}
                    >
                        <ListItemIcon>
                            <LoginOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItem>


                    {/* Admin */}
                    <Divider />

                    {
                        user?.role === 'admin' && (
                            <>
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin')}

                                >
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/products  ')}
                                >
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/orders')}
                                >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItem>

                                <ListItem
                                    button
                                    onClick={() => navigateTo('/admin/users')}
                                >
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItem>
                            </>
                        )
                    }

                </List>
            </Box>
        </Drawer>
    )
}