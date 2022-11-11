
import { FC } from "react"

import { SideMenu } from "../ui"
import { AdminNavBar } from '../admin/AdminNavBar';
import { Box, Typography } from "@mui/material";

interface Props {
    title: string,
    subTitle: string,
    icon?: JSX.Element,
    children?: JSX.Element,
}

export const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => {
    return (
        <>

            <nav>
                <AdminNavBar />
            </nav>

            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0 30px'
            }}>
                <Box display='flex' flexDirection='column'>
                    <Typography variant='h1' component='h1'>
                        {icon}
                        {' '}
                        {title}
                    </Typography>

                    <Typography variant='h2' mb={1}>{subTitle}</Typography>

                    <Box className='fadeIn'>
                        {children}
                    </Box>
                </Box>
            </main>


        </>
    )
}