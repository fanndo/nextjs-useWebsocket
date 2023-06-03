import { FC } from 'react';
import { PropsWithChildren } from 'react'; 

import Head from 'next/head';

// import { Navbar, SideMenu } from '../ui';


interface Props {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
}

export const PrincipalLayout:FC<PropsWithChildren<Props>> = ({ children, title, pageDescription, imageFullUrl }) => {
  return (
    <>
        <Head>
            <title>{ title }</title>

            <meta name="description" content={ pageDescription } />
            
            
            <meta name="og:title" content={ title } />
            <meta name="og:description" content={ pageDescription } />

            {
                imageFullUrl && (
                    <meta name="og:image" content={ imageFullUrl } />
                )
            }

        </Head> 

        <nav>
            {/* <Navbar /> */}
        </nav>

        {/* <SideMenu /> */}

        <main style={{
            padding: '7px 30px'
        }}>
            { children }
        </main>

        {/* Footer */}
        <footer>
            {/* TODO: mi custom footer */}
        </footer>

    </>
  )
}