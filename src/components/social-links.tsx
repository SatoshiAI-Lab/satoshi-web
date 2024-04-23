import React from 'react'
import { clsx } from 'clsx'
import { FaBloggerB, FaGithub } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { IconButton } from '@mui/material'

interface Props extends React.ComponentProps<'div'> {
  // Don't want to display some icon? add to `excludes` array.
  excludes?: (typeof socialLink)[number]['name'][]
}

const socialLink = [
  {
    name: 'GitHub',
    icon: <FaGithub size={22} color="inherit" />,
    onClick: () => window.open('https://github.com/SatoshiAI-Lab', '_blank'),
  },
  {
    name: 'Blog',
    icon: <FaBloggerB size={22} color="inherit" />,
    onClick: () => window.open('https://blog.mysatoshi.ai/', '_blank'),
  },
  {
    name: 'X',
    icon: <FaXTwitter size={22} color="inherit" />,
    onClick: () => window.open('https://twitter.com/mysatoshiai', '_blank'),
  },
] as const

export const SocialLinks = (props: Props) => {
  const { className, excludes } = props

  return (
    <div className={clsx('flex mr-2', className)}>
      {socialLink.map(
        (s, i) =>
          !excludes?.includes(s.name) && (
            <IconButton
              key={i}
              onClick={s.onClick}
              className="mx-2 cursor-pointer !text-black dark:!text-white"
            >
              {s.icon}
            </IconButton>
          )
      )}
    </div>
  )
}

export default SocialLinks
