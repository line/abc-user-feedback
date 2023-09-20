#!/bin/sh
echo "NEXT_PUBLIC_API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"
echo "NEXT_PUBLIC_MAX_DAYS: $NEXT_PUBLIC_MAX_DAYS"

echo "Check that we have NEXT_PUBLIC_API_BASE_URL and NEXT_PUBLIC_MAX_DAYS vars"

test -n "$NEXT_PUBLIC_API_BASE_URL"
test -n "$NEXT_PUBLIC_MAX_DAYS"

find /app/apps/web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_API_BASE_URL#$NEXT_PUBLIC_API_BASE_URL#g"
find /app/apps/web/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_NEXT_PUBLIC_MAX_DAYS#$NEXT_PUBLIC_MAX_DAYS#g"

echo "Starting Nextjs"
exec "$@"
