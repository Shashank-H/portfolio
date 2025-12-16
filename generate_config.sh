#!/bin/sh

# Source .env if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  set -a
  . ./.env
  set +a
fi

# Check for required variables
REQUIRED_VARS="FIREBASE_API_KEY FIREBASE_AUTH_DOMAIN FIREBASE_PROJECT_ID FIREBASE_STORAGE_BUCKET FIREBASE_MESSAGING_SENDER_ID FIREBASE_APP_ID FIREBASE_MEASUREMENT_ID"
MISSING_VARS=0

for VAR in $REQUIRED_VARS; do
  eval "VALUE=\$$VAR"
  if [ -z "$VALUE" ]; then
    echo "Warning: $VAR is not set."
    MISSING_VARS=1
  fi
done

echo "Generating firebase-config.js..."

cat <<EOF > firebase-config.js
export const firebaseConfig = {
  apiKey: "$FIREBASE_API_KEY",
  authDomain: "$FIREBASE_AUTH_DOMAIN",
  projectId: "$FIREBASE_PROJECT_ID",
  storageBucket: "$FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "$FIREBASE_MESSAGING_SENDER_ID",
  appId: "$FIREBASE_APP_ID",
  measurementId: "$FIREBASE_MEASUREMENT_ID"
};
EOF

echo "firebase-config.js generated successfully."

