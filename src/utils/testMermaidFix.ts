import { fixMermaidDiagramTypeError, quickFix, testSpecificError } from './mermaidErrorFixer';

/**
 * Test the specific error case mentioned by the user
 */
export function testUserError() {
  const problematicCode = `flowchart LR
A[Start] --> B{Is EA Architecture Available?}
B -->|Yes| C[Add EA Architecture]
B -->|No| D[Create EA Architecture]
C --> E[Review EA Architecture]
D --> E
E --> F{Is EA Architecture Correct?}
F -->|Yes| G[End]
F -->|No| H[Revise EA Architecture]
H --> E`;

  console.log('Original problematic code:');
  console.log(problematicCode);
  console.log('\n---\n');

  // Test quick fix
  const quickFixed = quickFix(problematicCode);
  console.log('Quick fix result:');
  console.log(quickFixed);
  console.log('\n---\n');

  // Test comprehensive fix
  const comprehensiveFix = fixMermaidDiagramTypeError(problematicCode);
  console.log('Comprehensive fix result:');
  console.log('Success:', comprehensiveFix.success);
  console.log('Fixed code:');
  console.log(comprehensiveFix.fixedCode);
  console.log('Fixes applied:');
  comprehensiveFix.fixes.forEach((fix, index) => {
    console.log(`${index + 1}. ${fix.type}: ${fix.message}`);
  });

  return {
    original: problematicCode,
    quickFixed,
    comprehensiveFix
  };
}

/**
 * Test with markdown-wrapped code (the actual error case)
 */
export function testMarkdownWrappedError() {
  const markdownWrappedCode = `\`\`\`mermaid
flowchart LR
A[Start] --> B{Is EA Architecture Available?}
B -->|Yes| C[Add EA Architecture]
B -->|No| D[Create EA Architecture]
C --> E[Review EA Architecture]
D --> E
E --> F{Is EA Architecture Correct?}
F -->|Yes| G[End]
F -->|No| H[Revise EA Architecture]
H --> E
\`\`\``;

  console.log('Markdown-wrapped problematic code:');
  console.log(markdownWrappedCode);
  console.log('\n---\n');

  const fixed = quickFix(markdownWrappedCode);
  console.log('Fixed code:');
  console.log(fixed);

  return {
    original: markdownWrappedCode,
    fixed
  };
}

// Export for testing
export { testSpecificError };








