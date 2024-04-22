console.log('---------- Start vercel deploy ----------')
console.log('Deploy branch:', process.env.VERCEL_GIT_COMMIT_REF)

const allows = ['main', 'dev']

if (allows.includes(process.env.VERCEL_GIT_COMMIT_REF)) {
  console.log('✅ - Build can proceed')
  return 1
} else {
  console.log('❌ - Build cancelled, allowed branches:', allows.join(', '))
  return 0
}
