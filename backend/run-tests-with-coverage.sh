#!/bin/bash
set -e

# Clean previous results
echo "Cleaning previous test results..."
mvn clean

# Run the tests and generate JaCoCo report
echo "Running tests and generating JaCoCo report..."
mvn test

# Check if JaCoCo report was generated
JACOCO_REPORT="target/site/jacoco/index.html"
if [ ! -f "$JACOCO_REPORT" ]; then
    echo "JaCoCo report not found at $JACOCO_REPORT"
    # Try to run the report goal explicitly
    echo "Trying to generate report explicitly..."
    mvn jacoco:report
    
    if [ ! -f "$JACOCO_REPORT" ]; then
        echo "Failed to generate JaCoCo report."
        exit 1
    fi
fi

# Display the report location
echo ""
echo "Coverage report generated at: $JACOCO_REPORT"
echo ""

# Try to open the report in the default browser
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Opening report in browser..."
    open "$JACOCO_REPORT"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    if command -v xdg-open &> /dev/null; then
        echo "Opening report in browser..."
        xdg-open "$JACOCO_REPORT"
    else
        echo "xdg-open not found. Please open the report manually at: $JACOCO_REPORT"
    fi
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    echo "Opening report in browser..."
    start "$JACOCO_REPORT"
else
    echo "Unsupported OS. Please open the report manually at: $JACOCO_REPORT"
fi 