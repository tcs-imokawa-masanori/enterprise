/**
 * Utility functions for fixing common Mermaid diagram errors
 */

export interface MermaidError {
  type: string;
  message: string;
  line?: number;
  column?: number;
  fix?: string;
}

export interface MermaidFixResult {
  originalCode: string;
  fixedCode: string;
  fixes: MermaidError[];
  success: boolean;
  error?: string;
}

/**
 * Fix the specific error you mentioned: "No diagram type detected matching given configuration"
 */
export function fixMermaidDiagramTypeError(code: string): MermaidFixResult {
  const errors: MermaidError[] = [];
  let fixedCode = code.trim();
  
  // Remove markdown code blocks if present
  fixedCode = fixedCode.replace(/```mermaid\s*/gi, '');
  fixedCode = fixedCode.replace(/```\s*$/gi, '');
  fixedCode = fixedCode.replace(/```\s*$/gi, '');
  
  // Check if diagram type is missing
  const hasDiagramType = /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/m.test(fixedCode);
  
  if (!hasDiagramType) {
    // Detect diagram type from content
    let diagramType = 'flowchart TD';
    
    if (fixedCode.includes('participant') || fixedCode.includes('->>')) {
      diagramType = 'sequenceDiagram';
    } else if (fixedCode.includes('class ') || fixedCode.includes('{')) {
      diagramType = 'classDiagram';
    } else if (fixedCode.includes('state ') || fixedCode.includes('[*]')) {
      diagramType = 'stateDiagram-v2';
    } else if (fixedCode.includes('title ') && fixedCode.includes('section')) {
      diagramType = 'gantt';
    } else if (fixedCode.includes('mindmap') || fixedCode.includes('root')) {
      diagramType = 'mindmap';
    } else if (fixedCode.includes('pie') || fixedCode.includes('title')) {
      diagramType = 'pie';
    }
    
    fixedCode = diagramType + '\n' + fixedCode;
    
    errors.push({
      type: 'missing_diagram_type',
      message: 'Added missing diagram type declaration',
      fix: `Added "${diagramType}" at the beginning`
    });
  }
  
  // Fix common syntax issues
  fixedCode = fixCommonSyntaxIssues(fixedCode);
  
  return {
    originalCode: code,
    fixedCode,
    fixes: errors,
    success: true
  };
}

/**
 * Fix common Mermaid syntax issues
 */
function fixCommonSyntaxIssues(code: string): string {
  let fixed = code;
  
  // Fix excessive dashes in arrows (like ---- --> ----)
  fixed = fixed.replace(/-{3,}/g, '-->');
  fixed = fixed.replace(/-{2,}/g, '-->');
  
  // Fix arrow syntax issues
  fixed = fixed.replace(/-->/g, ' --> ');
  fixed = fixed.replace(/->/g, ' --> ');
  fixed = fixed.replace(/--\|/g, ' -->|');
  
  // Fix node syntax issues
  fixed = fixed.replace(/\[([^\]]+)\]/g, '[$1]');
  fixed = fixed.replace(/\{([^}]+)\}/g, '{$1}');
  
  // Fix label syntax
  fixed = fixed.replace(/\|([^|]+)\|/g, '|$1|');
  
  // Fix specific parsing errors
  fixed = fixParsingErrors(fixed);
  
  // Remove extra whitespace
  fixed = fixed.replace(/\n\s*\n/g, '\n');
  fixed = fixed.replace(/^\s+/gm, '');
  
  return fixed;
}

/**
 * Fix specific parsing errors
 */
function fixParsingErrors(code: string): string {
  let fixed = code;
  
  // AGGRESSIVE CLEANUP for severely corrupted code
  // This handles cases like the user's extremely corrupted code
  
  // First, identify and extract valid node names and connections
  const lines = fixed.split('\n');
  const cleanedLines: string[] = [];
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    // Skip diagram type lines
    if (line.match(/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/)) {
      cleanedLines.push(line);
      continue;
    }
    
    // Extract node names and create clean connections
    const nodeMatch = line.match(/(\w+)\s*[-\s>]*\s*(\w+)/);
    if (nodeMatch) {
      const [, fromNode, toNode] = nodeMatch;
      cleanedLines.push(`${fromNode} --> ${toNode}`);
    } else {
      // Try to extract single nodes
      const singleNodeMatch = line.match(/(\w+)\s*[-\s>]*\s*$/);
      if (singleNodeMatch) {
        const [, nodeName] = singleNodeMatch;
        cleanedLines.push(nodeName);
      }
    }
  }
  
  fixed = cleanedLines.join('\n');
  
  // Additional cleanup for any remaining corruption
  fixed = fixed.replace(/\s*-\s*-\s*-\s*-\s*-\s*-\s*-\s*-+\s*/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>\s*>\s*>\s*>/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>\s*>\s*>/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>\s*>/g, ' --> ');
  fixed = fixed.replace(/>\s*>\s*>/g, ' --> ');
  
  // Fix patterns like "Start - - - - - - - ------------------- End"
  fixed = fixed.replace(/(\w+)\s*-\s*-\s*-\s*-\s*-\s*-\s*-\s*-+\s*(\w+)/g, '$1 --> $2');
  
  // Fix patterns like "Start ---- --> End" 
  fixed = fixed.replace(/(\w+)\s*-{3,}\s*-->\s*(\w+)/g, '$1 --> $2');
  
  // Fix patterns like "Start --------> End"
  fixed = fixed.replace(/(\w+)\s*-{4,}>\s*(\w+)/g, '$1 --> $2');
  
  // Fix multiple consecutive dashes in the middle
  fixed = fixed.replace(/\s*-\s*-\s*-\s*-\s*-\s*-\s*-\s*-+\s*/g, ' --> ');
  
  // Fix multiple consecutive dashes
  fixed = fixed.replace(/-{4,}/g, '-->');
  
  // Fix spaces around arrows
  fixed = fixed.replace(/\s*-->\s*/g, ' --> ');
  
  // Clean up any remaining excessive dashes
  fixed = fixed.replace(/-{3,}/g, '-->');
  
  return fixed;
}

/**
 * Test the specific error case you mentioned
 */
export function testSpecificError(): MermaidFixResult {
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

  return fixMermaidDiagramTypeError(problematicCode);
}

/**
 * Comprehensive Mermaid error detection and fixing
 */
export function fixAllMermaidErrors(code: string): MermaidFixResult {
  const errors: MermaidError[] = [];
  let fixedCode = code.trim();
  
  try {
    // Step 1: Remove markdown blocks
    const originalCode = fixedCode;
    fixedCode = fixedCode.replace(/```mermaid\s*/gi, '');
    fixedCode = fixedCode.replace(/```\s*$/gi, '');
    fixedCode = fixedCode.replace(/```\s*$/gi, '');
    
    if (originalCode !== fixedCode) {
      errors.push({
        type: 'markdown_blocks',
        message: 'Removed markdown code blocks',
        fix: 'Removed ```mermaid and ``` markers'
      });
    }
    
    // Step 2: Fix diagram type
    const diagramTypeResult = fixMermaidDiagramTypeError(fixedCode);
    fixedCode = diagramTypeResult.fixedCode;
    errors.push(...diagramTypeResult.fixes);
    
    // Step 3: Fix syntax issues
    const syntaxFixed = fixCommonSyntaxIssues(fixedCode);
    if (syntaxFixed !== fixedCode) {
      errors.push({
        type: 'syntax_issues',
        message: 'Fixed common syntax issues',
        fix: 'Corrected arrows, brackets, and formatting'
      });
    }
    fixedCode = syntaxFixed;
    
    // Step 4: Validate brackets and braces
    const bracketIssues = validateBrackets(fixedCode);
    if (bracketIssues.length > 0) {
      fixedCode = fixBracketIssues(fixedCode, bracketIssues);
      errors.push(...bracketIssues);
    }
    
    return {
      originalCode: code,
      fixedCode,
      fixes: errors,
      success: true
    };
    
  } catch (error) {
    return {
      originalCode: code,
      fixedCode: code,
      fixes: errors,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate bracket and brace matching
 */
function validateBrackets(code: string): MermaidError[] {
  const errors: MermaidError[] = [];
  
  // Check brackets
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  if (openBrackets !== closeBrackets) {
    errors.push({
      type: 'unclosed_brackets',
      message: `Unclosed brackets: ${openBrackets} open, ${closeBrackets} close`,
      fix: 'Add missing closing brackets'
    });
  }
  
  // Check braces
  const openBraces = (code.match(/\{/g) || []).length;
  const closeBraces = (code.match(/\}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push({
      type: 'unclosed_braces',
      message: `Unclosed braces: ${openBraces} open, ${closeBraces} close`,
      fix: 'Add missing closing braces'
    });
  }
  
  return errors;
}

/**
 * Fix bracket and brace issues
 */
function fixBracketIssues(code: string, errors: MermaidError[]): string {
  let fixed = code;
  
  for (const error of errors) {
    if (error.type === 'unclosed_brackets') {
      const openBrackets = (fixed.match(/\[/g) || []).length;
      const closeBrackets = (fixed.match(/\]/g) || []).length;
      const missing = openBrackets - closeBrackets;
      if (missing > 0) {
        fixed += ']'.repeat(missing);
      }
    } else if (error.type === 'unclosed_braces') {
      const openBraces = (fixed.match(/\{/g) || []).length;
      const closeBraces = (fixed.match(/\}/g) || []).length;
      const missing = openBraces - closeBraces;
      if (missing > 0) {
        fixed += '}'.repeat(missing);
      }
    }
  }
  
  return fixed;
}

/**
 * Quick fix for the specific error you encountered
 */
export function quickFix(code: string): string {
  // Remove markdown blocks
  let fixed = code.replace(/```mermaid\s*/gi, '').replace(/```\s*$/gi, '').trim();
  
  // Add flowchart type if missing
  if (!/^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram|gantt|pie|gitgraph|mindmap|journey|timeline|quadrantChart|requirement|erDiagram|blockDiagram|info|architectural|entityRelationshipDiagram|userJourney|timeline|sankey-beta|xyChart)/m.test(fixed)) {
    fixed = 'flowchart TD\n' + fixed;
  }
  
  return fixed;
}
