#!/usr/bin/env python3
"""
Replace :::info tags with {{< admonition >}} shortcodes in markdown files.

This script:
- Finds all instances of :::info tags (ignoring any text on the same line)
- Replaces them with {{< admonition type="note" >}} shortcodes
- Preserves the content between the opening and closing tags
"""

import os
import re
from pathlib import Path


def replace_info_tags(content: str) -> str:
    """
    Replace :::info tags with {{< admonition >}} shortcodes.
    
    Args:
        content: The file content as a string
        
    Returns:
        The modified content with replaced tags
    """
    # Pattern to match :::info (with optional text on same line) followed by content and closing :::
    # This uses a non-greedy match to handle multiple blocks in the same file
    pattern = r':::info[^\n]*\n(.*?)\n:::'
    
    # Replace with admonition shortcode
    replacement = r'{{< admonition type="note" >}}\n\1\n{{< /admonition >}}'
    
    # Use DOTALL flag to make . match newlines
    modified_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    return modified_content


def process_markdown_files(sources_dir: str) -> None:
    """
    Process all markdown files in the sources directory.
    
    Args:
        sources_dir: Path to the sources directory
    """
    sources_path = Path(sources_dir)
    
    if not sources_path.exists():
        print(f"Error: Directory '{sources_dir}' does not exist")
        return
    
    # Find all .md files recursively
    md_files = list(sources_path.rglob("*.md"))
    
    if not md_files:
        print(f"No markdown files found in '{sources_dir}'")
        return
    
    print(f"Found {len(md_files)} markdown file(s)")
    
    files_modified = 0
    total_replacements = 0
    
    for md_file in md_files:
        # Read the file
        with open(md_file, 'r', encoding='utf-8') as f:
            original_content = f.read()
        
        # Replace info tags
        modified_content = replace_info_tags(original_content)
        
        # Check if any changes were made
        if modified_content != original_content:
            # Count replacements
            replacements = original_content.count(':::info')
            total_replacements += replacements
            
            # Write the modified content back
            with open(md_file, 'w', encoding='utf-8') as f:
                f.write(modified_content)
            
            files_modified += 1
            print(f"✓ {md_file.relative_to(sources_path)}: {replacements} replacement(s)")
    
    print(f"\nSummary:")
    print(f"- Files modified: {files_modified}")
    print(f"- Total replacements: {total_replacements}")


def main():
    """Main entry point for the script."""
    # Path to the sources directory
    sources_dir = "/Users/isabelmatwawana/GrafanaDocs/business-text/docs/sources"
    
    print("Starting replacement of :::info tags with {{< admonition >}} shortcodes...\n")
    process_markdown_files(sources_dir)
    print("\nDone!")


if __name__ == "__main__":
    main()
