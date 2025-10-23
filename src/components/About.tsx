import React from 'react'

const About: React.FC = () => {
  return (
    <div style={{ maxWidth: 720, margin: '2rem auto' }}>
      <h1 style={{ marginTop: 0 }}>About</h1>
      <p>
        Made by <strong>Robert Niemela</strong>
      </p>
      <p>
        Email: <a href="mailto:rvniemela@hotmail.com">rvniemela@hotmail.com</a>
      </p>
      <p>
        Website: <a href="https://rvniemela.com" target="_blank" rel="noreferrer">rvniemela.com</a>
      </p>
    </div>
  )
}

export default About


