import React from 'react'
import Head from 'next/head'
import Logo from '../assets/logoCircle100.svg'
import { Container } from '../styles/pages/Home'
import Boxes from '@components/Boxes/index'

const Home = () => {
  return (
    <Container>
      <Head>
        <title>Homepage</title>
      </Head>

      <main>
        <Logo />
        <h1>ReactJS Structure</h1>
        <p>A ReactJS + Next.js structure</p>
        <div>
          <Boxes />
        </div>
      </main>

      <footer>
        <a
          href="https://github.com/amaralc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by ...
        </a>
      </footer>
    </Container>
  )
}

export default Home
