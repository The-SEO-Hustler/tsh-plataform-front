import React from 'react'
import styles from './styles.module.css'

function Callout({ children }) {
  return (
    <div className={`${styles.callout} bg-card rounded-lg p-6 my-6 outline outline-1 outline-foreground/10`}>
      {children}
    </div>
  )
}

export default Callout;
