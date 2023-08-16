#!/bin/sh
echo "NEXT_PUBLIC_API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"
echo "Check that we have NEXT_PUBLIC_API_BASE_URL vars"
test -n "$NEXT_PUBLIC_API_BASE_URL"

find /app/apps/web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_API_BASE_URL#$NEXT_PUBLIC_API_BASE_URL#g"

echo "Starting Nextjs"
exec "$@"
