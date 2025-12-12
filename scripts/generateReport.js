/**#!/bin/bash































































































}  process.exit(1);  console.error('❌ Error generating report:', error.message);} catch (error) {  console.log('✅ Report generated:', htmlFile);  fs.writeFileSync(htmlFile, html);  `;    </html>    </body>      </div>        ${scenariosHtml}        <h2>Scenarios</h2>      <div class="scenarios">      </div>        <p class="failed">✗ Failed: ${failed}</p>        <p class="passed">✓ Passed: ${passed}</p>        <p>Total Scenarios: ${passed + failed}</p>        <h2>Summary</h2>      <div class="summary">      <h1>Test Execution Report</h1>    <body>    </head>      </style>        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }        table { width: 100%; border-collapse: collapse; }        .failed { color: #f44336; }        .passed { color: #4CAF50; }        .status { float: right; font-weight: bold; }        .scenario.failed { border-left: 4px solid #f44336; }        .scenario.passed { border-left: 4px solid #4CAF50; }        .scenario { margin: 15px 0; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }        .summary { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px; }        body { font-family: Arial, sans-serif; margin: 20px; }      <style>      <title>Test Report</title>    <head>    <html>    <!DOCTYPE html>  const html = `  });    });    `;      </div>        </table>          ${steps}          <tr><th>Step</th><th>Status</th></tr>        <table>        <h4>${scenario.name} <span class="status">${status}</span></h4>      <div class="scenario ${status}">      scenariosHtml += `        .join('');        )      `        </tr>          <td class="${step.result.status}">${step.result.status}</td>          <td>${step.keyword}${step.name}</td>        <tr>          (step) => `        .map(      const steps = scenario.steps      else failed++;      if (status === 'passed') passed++;      const status = scenario.steps.every((s) => s.result.status === 'passed') ? 'passed' : 'failed';    feature.elements.forEach((scenario) => {  results.forEach((feature) => {  let scenariosHtml = '';    pending = 0;    failed = 0,  let passed = 0,  const results = JSON.parse(data);  const data = fs.readFileSync(jsonFile, 'utf8');try {}  process.exit(1);  console.error('❌ No cucumber-report.json found. Run tests first.');if (!fs.existsSync(jsonFile)) {const htmlFile = path.join(reportDir, 'report.html');const jsonFile = path.join(reportDir, 'cucumber-report.json');const reportDir = path.join(process.cwd(), 'reports');import path from 'path';import fs from 'fs'; */ * Run: node scripts/generateReport.js * Generate HTML Report from Cucumber JSON output
# Script to generate HTML report from Cucumber JSON output
# This uses the html-reporter package to create a visual report

if [ ! -f reports/cucumber-report.json ]; then
  echo "❌ No test results found. Run tests first with: npm test"
  exit 1
fi

echo "📊 Generating HTML report..."
npx html-reporter \
  --jsonDir=reports \
  --output=reports/index.html \
  --screenshotsDirectory=reports/screenshots \
  --storeScreenshots=true

if [ -f reports/index.html ]; then
  echo "✅ Report generated: reports/index.html"
  
  # Open report if on macOS
  if [ "$(uname)" = "Darwin" ]; then
    open reports/index.html
  fi
else
  echo "❌ Failed to generate report"
  exit 1
fi
