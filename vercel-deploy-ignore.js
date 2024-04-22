#!/bin/bash

console.log(`VERCEL_GIT_COMMIT_REF: ${$VERCEL_GIT_COMMIT_REF}`)

if ($VERCEL_GIT_COMMIT_REF == 'main' || $VERCEL_GIT_COMMIT_REF == 'dev') {
  console.log('✅ - Build can proceed')
  return 1
} else {
  console.log('🛑 - Build cancelled')
  return 0
}
