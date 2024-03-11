import React from 'react'
import { Container, Spinner } from 'react-bootstrap'

function LoaderPause() {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <Spinner className="spinner-grow" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>

      <Spinner  className="spinner-grow" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>

      <Spinner className="spinner-grow" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>

      <Spinner  className="spinner-grow" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>

      <Spinner className="spinner-border" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>

      <Spinner  className="spinner-grow" 
        style={{width: '3rem', height: '3rem'}}
        role="status" >
        <span className="sr-only">Loading...</span>
      </Spinner>
    </Container>
  )
}

export default LoaderPause

