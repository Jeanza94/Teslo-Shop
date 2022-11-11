import { GetServerSideProps, NextPage } from 'next';
import { Chip, Grid, Typography } from "@mui/material"
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Link from "next/link";
import { ShopLayout } from "../../components/layouts"
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';





// const rows = [
//     { id: 1, paid: true, fullName: 'Fernando Herrera' },
//     { id: 2, paid: true, fullName: 'Melissa Florez' },
//     { id: 3, paid: false, fullName: 'Hernando Vallejo' },
//     { id: 4, paid: true, fullName: 'Natalia Herrara' },
//     { id: 5, paid: false, fullName: 'Alejando Magno' },
// ]

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Nombre Completo', width: 300 },

    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra información si esta pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (
                params.row.paid
                    ? <Chip color='success' label='Pagada' variant='outlined' />
                    : <Chip color='error' label='No Pagada' variant='outlined' />
            )
        }
    },

    {
        field: 'link-order',
        headerName: 'Ver Orden',
        width: 200,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <Link href={`/orders/${params.row.orderId}`} >{params.row.orderId} </Link>
            )
        }
    }
];


interface Props {
    orders: IOrder[]
}

const HistoryPage: NextPage<Props> = ({ orders }) => {

    console.log({ orders })

    const rows = orders.map((order, i) => ({
        id: i + 1,
        paid: order.isPaid,
        fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        orderId: order._id

    }))


    return (
        <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
            <>
                <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

                <Grid container className='fadeIn'>

                    <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                        <DataGrid
                            rows={rows}
                            columns={columns}
                            pageSize={10}
                            rowsPerPageOptions={[10]}
                        />
                    </Grid>

                </Grid>
            </>

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user.id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage