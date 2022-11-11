import { FC } from "react"
import Head from "next/head"
import { NavBar, SideMenu } from "../ui"

interface Props {
    title: string,
    pageDescription: string,
    imageFullUrl?: string,
    children?: JSX.Element,
}

export const ShopLayout: FC<Props> = ({ children, title, pageDescription, imageFullUrl }) => {
    return (
        <>
            <Head>
                <title>{title}</title>
                {/* meta tags para el seo, los de og, son para las redes sociales */}
                <meta name='description' content={pageDescription} />

                <meta name='og:title' content={title} />
                <meta name='og:description' content={pageDescription} />

                {
                    imageFullUrl && (
                        <meta name='og:image' content={imageFullUrl} />
                    )
                }

            </Head>

            <nav>
                <NavBar />
            </nav>

            <SideMenu />

            <main style={{
                margin: '80px auto',
                maxWidth: '1440px',
                padding: '0 30px'
            }}>
                {children}
            </main>

            <footer>
                {/* todo custom footer */}
            </footer>
        </>
    )
}
