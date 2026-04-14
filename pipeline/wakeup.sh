#!/bin/bash
# Triggered by sleepwatcher on Mac wake.
# Runs the nightly pipeline once per calendar day.
#
# Setup:
#   brew install sleepwatcher
#   cp pipeline/wakeup.sh ~/.wakeup && chmod +x ~/.wakeup
#   brew services start sleepwatcher

LAST_RUN_FILE="$HOME/.yysworld_pipeline_last_run"
TODAY=$(date +%Y-%m-%d)
LOG="$HOME/yysworld_pipeline.log"
REPO="/Users/benchan/yy/yysworld"

# Only run once per calendar day
if [ -f "$LAST_RUN_FILE" ] && [ "$(cat $LAST_RUN_FILE)" = "$TODAY" ]; then
  exit 0
fi

echo "$TODAY" > "$LAST_RUN_FILE"

echo "" >> "$LOG"
echo "=== $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG"

cd "$REPO" && npm run pipeline:run >> "$LOG" 2>&1

EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
  echo "[wakeup] pipeline failed with exit code $EXIT_CODE" >> "$LOG"
  # Optionally notify: osascript -e 'display notification "Pipeline failed" with title "yysworld"'
fi
