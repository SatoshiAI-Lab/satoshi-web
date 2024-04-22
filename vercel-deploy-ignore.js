console.log('VERCEL_GIT_COMMIT_REF:', process.env.VERCEL_GIT_COMMIT_REF)

if (
  process.env.VERCEL_GIT_COMMIT_REF === 'main' ||
  process.env.VERCEL_GIT_COMMIT_REF === 'dev'
) {
  console.log('✅ - Build can proceed')
  return 1
} else {
  console.log('🛑 - Build cancelled')
  return 0
}
