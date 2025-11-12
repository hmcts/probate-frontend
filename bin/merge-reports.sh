#!/bin/bash

# Clean up any previous output
rm -f ./functional-output/mochawesome.json
rm -f ./functional-output/merged/mochawesome.json

mkdir -p functional-output/merged

echo 'Looking for JSON reports...'

# Count mochawesome reports
REPORT_COUNT=$(find . -name 'mochawesome*.json' \
  -not -path '*/node_modules/*' \
  -not -path './functional-output/mochawesome.json' \
  -not -path './functional-output/merged/*' | wc -l)

echo "Found $REPORT_COUNT report file(s)"
echo "Report locations:"
find . -name 'mochawesome*.json' \
  -not -path '*/node_modules/*' \
  -not -path './functional-output/mochawesome.json' \
  -not -path './functional-output/merged/*'

if [ "$REPORT_COUNT" -gt 1 ]; then
    echo 'Merging multiple reports...'
    find . -name 'mochawesome*.json' \
      -not -path '*/node_modules/*' \
      -not -path './functional-output/mochawesome.json' \
      -not -path './functional-output/merged/*' \
      -print0 | xargs -0 mochawesome-merge > ./functional-output/merged/mochawesome.json
      REPORT_JSON_FILE="./functional-output/merged/mochawesome.json"
elif [ "$REPORT_COUNT" -eq 1 ]; then
    echo 'Single report found, copying...'
    REPORT_FILE=$(find . -name 'mochawesome*.json' \
      -not -path '*/node_modules/*' \
      -not -path './functional-output/mochawesome.json' \
      -not -path './functional-output/merged/*' | head -n 1)
    echo "Copying from: $REPORT_FILE"
    cp "$REPORT_FILE" ./functional-output/merged/mochawesome.json
    REPORT_JSON_FILE="./functional-output/merged/mochawesome.json"
else
    echo 'No reports found!'
    exit 1
fi

# Validate merged file is not empty
if ! [ -s ./functional-output/merged/mochawesome.json ]; then
    echo "Merged JSON is empty or invalid. Aborting."
    exit 1
fi

# Generate HTML report
echo 'Generating HTML report...'
echo "Running marge on file: $REPORT_JSON_FILE"
marge "$REPORT_JSON_FILE" -f mochawesome -o ./functional-output/merged --inline

echo 'Report generated: functional-output/merged/mochawesome.html'
