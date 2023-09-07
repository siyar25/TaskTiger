import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Title({titleClass, subTitleClass}) {
    const navigate = useNavigate()

    const goHome = () => {
        navigate("/")
    }

  return (
    <div className={titleClass} onClick={() => goHome()}>
    TaskTiger.
    <div className={subTitleClass}>Your Task, Our <span id='hunt'>Hunt</span>.</div>
  </div>
  )
}
