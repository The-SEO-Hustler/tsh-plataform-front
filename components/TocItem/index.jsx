import React, { useRef } from 'react'
import s from './TocItem.module.css'
function TocItem({ h2Id, h2Title, tag, children, onClick }) {
  // add a eventlistner that toggles the attribute data-open
  const tabRef = useRef(null)

  const handleClick = (e) => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <li
      className={`${s.topicWrapper} ${tag === 'h2' ? s.h2 : s.h3}`}
    >
      <div className={s.topicW}>


        <a href={`#${h2Id}`} className={`${s.topic} `} data-heading-type="h2" style={{ textDecoration: 'none' }} onClick={handleClick}>
          <span>{h2Title}</span>
        </a>

      </div>
      {children.length > 0 && (
        <div className='py-1'>
          <div className={s.initialChildConector} />
          <ul className={s.headingTab} ref={tabRef}>
            {children.map(({ id: h3Id, title: h3Title }) => (
              <li key={h3Id} className={`${s.topicWrapper} ${s.h3}`} >
                <a href={`#${h3Id}`} className={`${s.topic} `} data-heading-type="h3" style={{ textDecoration: 'none' }} onClick={handleClick}>
                  <span>{h3Title}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className={s.endChildConector} />
        </div>
      )}
    </li>
  )
}

export default TocItem