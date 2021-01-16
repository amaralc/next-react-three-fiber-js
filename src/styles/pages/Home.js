import styled from 'styled-components'

export const Container = styled.div`
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  main {
    display: flex;
    justify-content: center;
    align-items: center;

    flex-direction: column;

    h1 {
      font-size: 54px;
      color: ${props => props.theme.colors.primary};
      margin-top: 40px;
    }

    p {
      margin-top: 24px;
      font-size: 24px;
      line-height: 32px;
    }

    div {
      height: 300px;
    }
  }

  footer {
    margin-top: 32px;

    a {
      text-decoration: none;
      color: #8257e6;
    }
  }
`
