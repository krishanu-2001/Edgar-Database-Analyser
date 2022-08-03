import React from 'react'
import { Link } from 'react-router-dom'

const BreadCrumb = ({ entries }) => (
  <div className="text-2xl font-semibold breadcrumbs p-0">
    <ul>
      {entries.map(({ name, path, state }, idx) => (
        <li key={idx}>
          <Link to={path} state={state}>
            {name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
)

export default BreadCrumb
