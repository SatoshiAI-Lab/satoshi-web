console.log('---------- Start Vercel Deploy ----------')

const allows = ['main', 'dev']

console.log(
  'Deploy branch:',
  process.env.VERCEL_GIT_COMMIT_REF,
  allows.includes(process.env.VERCEL_GIT_COMMIT_REF)
)

if (!allows.includes(process.env.VERCEL_GIT_COMMIT_REF)) {
  console.log('✅ - Build can proceed.')
  return 1
} else {
  console.log('❌ - Build cancelled, allowed branches:', allows.join(', '))
  return 0
}
