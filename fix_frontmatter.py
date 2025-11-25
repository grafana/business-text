#!/usr/bin/env python3
"""
Script to fix front matter in markdown files.
Processes YAML front matter to standardize formatting.
"""

import re
import yaml
from pathlib import Path


def process_frontmatter(file_path):
    """
    Process the front matter of a markdown file.
    
    Args:
        file_path: Path to the markdown file
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract front matter and body
    match = re.match(r'^---\n(.*?)\n---\n(.*)$', content, re.DOTALL)
    if not match:
        print(f"No front matter found in {file_path}")
        return
    
    frontmatter_text = match.group(1)
    body = match.group(2)
    
    # Parse YAML
    frontmatter = yaml.safe_load(frontmatter_text)
    
    # Process tags -> keywords (lowercase)
    if 'tags' in frontmatter:
        tags = frontmatter['tags']
        if isinstance(tags, list):
            frontmatter['keywords'] = [tag.lower() for tag in tags]
        frontmatter.pop('tags')
    
    # Remove quotes from title and description (will be handled by YAML dumper)
    # Keep the values as plain strings
    
    # Add "cloud" to product labels if not present
    if 'labels' in frontmatter and 'products' in frontmatter['labels']:
        products = frontmatter['labels']['products']
        if 'cloud' not in products:
            products.append('cloud')
            # Sort for consistency
            frontmatter['labels']['products'] = sorted(products)
    
    # Create new front matter with specified order
    ordered_frontmatter = {}
    field_order = ['title', 'menuTitle', 'description', 'keywords', 'labels', 'weight']
    
    for field in field_order:
        if field in frontmatter:
            ordered_frontmatter[field] = frontmatter[field]
    
    # Convert to YAML with custom formatting
    yaml_lines = []
    
    for key, value in ordered_frontmatter.items():
        if key == 'title':
            yaml_lines.append(f"title: {value}")
        elif key == 'menuTitle':
            yaml_lines.append(f"menuTitle: {value}")
        elif key == 'description':
            yaml_lines.append(f"description: {value}")
        elif key == 'keywords':
            yaml_lines.append("keywords:")
            for item in value:
                yaml_lines.append(f"  - {item}")
        elif key == 'labels':
            yaml_lines.append("labels:")
            if 'products' in value:
                yaml_lines.append("  products:")
                for product in value['products']:
                    yaml_lines.append(f"    - {product}")
        elif key == 'weight':
            yaml_lines.append(f"weight: {value}")
    
    # Reconstruct file
    new_content = "---\n" + "\n".join(yaml_lines) + "\n---\n" + body
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully processed {file_path}")


if __name__ == "__main__":
    # Process all markdown files in the sources folder
    sources_dir = Path(__file__).parent / "docs" / "sources"
    
    if not sources_dir.exists():
        print(f"Sources directory not found: {sources_dir}")
        exit(1)
    
    # Find all .md files recursively
    md_files = list(sources_dir.rglob("*.md"))
    
    if not md_files:
        print(f"No markdown files found in {sources_dir}")
        exit(1)
    
    print(f"Found {len(md_files)} markdown file(s) to process\n")
    
    for file_path in sorted(md_files):
        print(f"Processing: {file_path.relative_to(sources_dir.parent)}")
        try:
            process_frontmatter(file_path)
        except Exception as e:
            print(f"  Error processing {file_path}: {e}")
    
    print(f"\nCompleted processing {len(md_files)} file(s)")
