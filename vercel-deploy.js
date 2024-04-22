console.log('Your deploy branch:', process.env.VERCEL_GIT_COMMIT_REF)

// Only main & dev allowed deploy.
const isMain = process.env.VERCEL_GIT_COMMIT_REF === 'main'
const isDev = process.env.VERCEL_GIT_COMMIT_REF === 'dev'
if (isMain || isDev) {
  console.log('✅ - Build can proceed')
  return 1
} else {
  console.log('❌ - Build cancelled')
  return 0
}
