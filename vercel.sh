#!/bin/bash

branch=$VERCEL_GIT_COMMIT_REF

echo "--------------- Build script running ---------------"
echo "--------------- Build branch: $branch ---------------"

# Allowed build brnachs.
if [[ 
  "$branch" == "main" || 
  "$branch" == "dev"
]]; then
  echo "✅ - Build can proceed"
  exit 1;
else
  echo "🛑 - Build cancelled"
  exit 0;
fi
