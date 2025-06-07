import React from 'react'
import styles from './styles.module.css'
function Quote({ children }) {
  return (
    <div className={`${styles.quote} border-l-4 border-primary pl-4 py-4 my-6`}>
      {children}
    </div>
  )
}

export default Quote;