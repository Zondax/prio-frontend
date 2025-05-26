'use client'

import styles from './tv-static.module.css'

export function TVStatic() {
  return (
    <div className={styles.tvContainer}>
      <div className={styles.static} />
      <div className={styles.screen} />
      <div className={styles.vignette} />
      <div className={styles.flicker} />
    </div>
  )
}
