/**
 * Test Report Generator for Fitbit Service
 * 
 * Generates a natural language report from Jest test results
 */

const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '../reports');
if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
}

const testSuites = {
    'S6.TS1': { name: 'Health Endpoint Tests', file: 'health.test.js', tests: 1 },
    'S6.TS2': { name: 'API Key Management Tests', file: 'api-key-management.test.js', tests: 5 },
    'S6.TS3': { name: 'Patient Summary Tests', file: 'patient-summary.test.js', tests: 4 },
    'S6.TS4': { name: 'Batch Operations Tests', file: 'batch-operations.test.js', tests: 3 },
    'S6.TS5': { name: 'Demo Endpoints Tests', file: 'demo-endpoints.test.js', tests: 2 },
    'S6.TS6': { name: 'Fitbit API Integration Tests', file: 'fitbit-integration.test.js', tests: 4 }
};

function generateReport() {
    const timestamp = new Date().toISOString();
    let report = '';

    report += '═══════════════════════════════════════════════════════════════════\n';
    report += '                 FITBIT SERVICE TEST REPORT                        \n';
    report += '═══════════════════════════════════════════════════════════════════\n';
    report += `Generated: ${timestamp}\n`;
    report += 'Service: Fitbit Service (S6)\n';
    report += 'Test Framework: Jest + Supertest\n';
    report += '═══════════════════════════════════════════════════════════════════\n\n';

    report += '## EXECUTIVE SUMMARY\n\n';
    report += 'The Fitbit Service test suite validates the integration with Fitbit API\n';
    report += 'to retrieve patient health data including steps, heart rate, and sleep\n';
    report += 'patterns. Tests cover API key management, data retrieval, batch operations,\n';
    report += 'and error handling.\n\n';

    report += '## TEST SUITES OVERVIEW\n\n';
    let totalTests = 0;
    Object.entries(testSuites).forEach(([id, suite]) => {
        report += `${id}: ${suite.name}\n`;
        report += `   File: tests/${suite.file}\n`;
        report += `   Tests: ${suite.tests}\n\n`;
        totalTests += suite.tests;
    });
    report += `Total Test Cases: ${totalTests}\n\n`;

    report += '## DETAILED TEST RESULTS\n\n';
    
    Object.entries(testSuites).forEach(([id, suite]) => {
        report += `### ${id}: ${suite.name}\n`;
        report += `${'─'.repeat(70)}\n\n`;
        
        switch(id) {
            case 'S6.TS1':
                report += '**Tests:**\n';
                report += '- S6.TS1.1: Health endpoint returns 200 with service name\n\n';
                break;
            case 'S6.TS2':
                report += '**Tests:**\n';
                report += '- S6.TS2.1: Link API key to patient\n';
                report += '- S6.TS2.2: Validate required fields\n';
                report += '- S6.TS2.3: Return success message\n';
                report += '- S6.TS2.4: Unlink API key\n';
                report += '- S6.TS2.5: Validate patientId for unlink\n\n';
                break;
            case 'S6.TS3':
                report += '**Tests:**\n';
                report += '- S6.TS3.1: Return health data summary\n';
                report += '- S6.TS3.2: Include steps, heart rate, and sleep\n';
                report += '- S6.TS3.3: Handle unlinked patient (404)\n';
                report += '- S6.TS3.4: Handle invalid patientId (404)\n\n';
                break;
            case 'S6.TS4':
                report += '**Tests:**\n';
                report += '- S6.TS4.1: Return multiple patient data\n';
                report += '- S6.TS4.2: Validate patientIds array\n';
                report += '- S6.TS4.3: Handle partial failures\n\n';
                break;
            case 'S6.TS5':
                report += '**Tests:**\n';
                report += '- S6.TS5.1: Link demo data\n';
                report += '- S6.TS5.2: Use DEMO_KEY\n\n';
                break;
            case 'S6.TS6':
                report += '**Tests:**\n';
                report += '- S6.TS6.1: Make correct API calls\n';
                report += '- S6.TS6.2: Parse API responses\n';
                report += '- S6.TS6.3: Handle API errors\n';
                report += '- S6.TS6.4: Respect rate limiting\n\n';
                break;
        }
    });

    report += '## HOW TO RUN TESTS\n\n';
    report += '```bash\n';
    report += '# Install dependencies\n';
    report += 'npm install\n\n';
    report += '# Run all tests\n';
    report += 'npm test\n\n';
    report += '# Run with coverage\n';
    report += 'npm run test:coverage\n\n';
    report += '# Generate this report\n';
    report += 'npm run test:report\n';
    report += '```\n\n';

    report += '═══════════════════════════════════════════════════════════════════\n';
    report += '                       END OF REPORT                               \n';
    report += '═══════════════════════════════════════════════════════════════════\n';

    const reportPath = path.join(reportsDir, 'test-report-natural-language.txt');
    fs.writeFileSync(reportPath, report);
    
    console.log('\n✓ Natural language test report generated:');
    console.log(`  ${reportPath}\n`);
    
    const mdReport = report.replace(/═/g, '=').replace(/─/g, '-');
    const mdReportPath = path.join(reportsDir, 'test-report-natural-language.md');
    fs.writeFileSync(mdReportPath, mdReport);
    
    console.log('✓ Markdown test report generated:');
    console.log(`  ${mdReportPath}\n`);
}

try {
    generateReport();
} catch (error) {
    console.error('Error generating report:', error);
    process.exit(1);
}
