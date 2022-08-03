import React from 'react'
import useBreadcrumbs from 'use-react-router-breadcrumbs'

import { routes } from '@/router/App'
import BreadCrumb from '../atoms/BreadCrumb'

const RouteCrumb = () => {
  const crumbs = useBreadcrumbs(routes(true), {
    disableDefaults: true,
  })
  const entries = crumbs.map((crumb) => ({
    name: crumb.breadcrumb,
    path: crumb.match.pathname,
  }))
  return <BreadCrumb entries={entries} />
}

export default RouteCrumb