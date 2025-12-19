#!/bin/bash
# latex2jekyll.sh - Convert LaTeX to HTML for Jekyll

# Check if pandoc is installed
if ! command -v pandoc &> /dev/null; then
    echo "Error: pandoc is not installed. Please install pandoc first."
    exit 1
fi

# Process all .tex files in _latex directory
for tex_file in _latex/*.tex; do
    # Skip if no tex files found
    if [ ! -f "$tex_file" ]; then
        echo "No .tex files found in _latex directory."
        exit 0
    fi
    
    # Get base filename without extension
    basename=$(basename "$tex_file" .tex)
    
    # Check if metadata file exists
    meta_file="_latex/${basename}_meta.yaml"
    if [ ! -f "$meta_file" ]; then
        echo "Warning: No metadata file for $basename.tex, skipping..."
        continue
    fi
    
    # Extract date from metadata for filename
    date=$(grep "^date:" "$meta_file" | sed 's/date:[[:space:]]*//' | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}')
    if [ -z "$date" ]; then
        echo "Warning: No valid date in $meta_file, skipping..."
        continue
    fi
    
    # Set output filename
    output_file="_posts/${date}-${basename}.md"
    
    echo "Converting $basename.tex -> $output_file"
    
    # Check for bibliography file in multiple locations
    bib_file="assets/_bibliography/refs.bib"
    
    # Convert LaTeX to HTML with bibliography processing
    if [ -n "$bib_file" ]; then
        echo "  Using bibliography: $bib_file"
        pandoc "$tex_file" \
            --from=latex+raw_tex \
            --to=html5 \
            --mathjax="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_HTML" \
            --bibliography="$bib_file" \
            --citeproc \
            --csl="_latex/chicago.csl" \
            --metadata link-citations=true \
            --no-highlight \
            -o temp_body.html
    else
        echo "  Warning: No bibliography file found, citations won't be processed"
        pandoc "$tex_file" \
            --from=latex+raw_tex \
            --to=html5 \
            --mathjax="https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_HTML" \
            --no-highlight \
            -o temp_body.html
    fi

    # Post-processing for references and equations
    perl -i -0777 -pe '
        # Add References header if we have a refs div without header
        s/<div id="refs"([^>]*)>/<h2>References<\/h2>\n<div id="refs"$1>/g;
        
        # Ensure bibliography entries are properly wrapped
        s/<div id="refs"[^>]*>\n(?!<div)/<div id="refs" class="references">\n/g;
        
        # Convert display math with labels to proper equation environment
        # Handle \[\label{...} ... \] patterns
        s/\\\[\s*\\label\{([^}]+)\}(.*?)\\\]/\\begin{equation}\\label{$1}$2\\end{equation}/gs;
        
        # Keep ref and eqref in math mode
        s/<span class="math inline">\s*\$\\eqref\{([^}]+)\}\$\s*<\/span>/\\(\\eqref{$1}\\)/g;
        s/<span class="math inline">\s*\\eqref\{([^}]+)\}\s*<\/span>/\\(\\eqref{$1}\\)/g;
        s/<span class="math inline">\s*\$\\ref\{([^}]+)\}\$\s*<\/span>/\\(\\ref{$1}\\)/g;
        s/<span class="math inline">\s*\\ref\{([^}]+)\}\s*<\/span>/\\(\\ref{$1}\\)/g;
    ' temp_body.html
    
    # Additional post-processing for theorem/lemma environments
    python3 -c "
import re
import sys

with open('temp_body.html', 'r') as f:
    content = f.read()

# Track theorem/lemma numbers
theorem_counter = 0
lemma_counter = 0
proposition_counter = 0
corollary_counter = 0

def replace_theorem_env(match):
    global theorem_counter, lemma_counter, proposition_counter, corollary_counter
    
    env_type = match.group(1)
    full_content = match.group(2)
    
    # Look for label in the content
    label_match = re.search(r'<strong>(\w+\s+\d+)</strong>', full_content)
    if label_match:
        # Extract number from the label
        parts = label_match.group(1).split()
        if len(parts) >= 2 and parts[1].isdigit():
            number = int(parts[1])
            env_name = parts[0].lower()
            
            # Find potential label ID
            label_id = None
            if env_name == 'theorem':
                label_id = f'thm:master' if 'Master Theorem' in full_content else f'thm:peak' if 'Peak at the origin' in full_content else None
            elif env_name == 'lemma':
                label_id = 'lem:sine-cancel' if 'Odd-term cancellation' in full_content else None
            elif env_name == 'proposition':
                label_id = 'prop:var' if 'Second moment' in full_content else None
            elif env_name == 'corollary':
                label_id = 'cor:bochner' if 'Inverse kernel design' in full_content else None
            
            if label_id:
                # Add id attribute to the div
                return f'<div id=\"{label_id}\" class=\"{env_type}\">{full_content}'
    
    return match.group(0)

# Process theorem-like environments
content = re.sub(r'<div class=\"(theorem|lemma|proposition|corollary)\">(.*?)</div>', 
                 replace_theorem_env, content, flags=re.DOTALL)

# Replace references to theorems/lemmas
def replace_refs(match):
    ref_type = match.group(1)
    ref_id = match.group(2)
    
    # Map references to numbers
    ref_map = {
        'thm:master': '2',
        'thm:peak': '6',
        'lem:sine-cancel': '1',
        'prop:var': '4',
        'cor:bochner': '3'
    }
    
    number = ref_map.get(ref_id, '???')
    
    if ref_type == 'ref':
        return f'<a href=\"#{ref_id}\">{number}</a>'
    else:  # eqref
        return f'<a href=\"#{ref_id}\">({number})</a>'

# Replace \ref{...} references for theorems/lemmas
content = re.sub(r'\\\\(ref|eqref)\{(thm:[^}]+|lem:[^}]+|prop:[^}]+|cor:[^}]+)\}', replace_refs, content)

# Clean up math mode wrappers around theorem/lemma references
content = re.sub(r'\\\\\\(<a href=\"#(thm:|lem:|prop:|cor:)([^\"]+)\">([^<]+)</a>\\\\\\)', r'<a href=\"#\1\2\">\3</a>', content)

# Also clean up when wrapped in span tags
content = re.sub(r'<span class=\"math inline\">\\\\\\(<a href=\"#(thm:|lem:|prop:|cor:)([^\"]+)\">([^<]+)</a>\\\\\\)</span>', r'<a href=\"#\1\2\">\3</a>', content)

with open('temp_body.html', 'w') as f:
    f.write(content)
"
    
    # Add MathJax configuration for equation numbering
    cat > mathjax_config.html << 'EOF'
<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: {
    equationNumbers: {
      autoNumber: "all",
      useLabelIds: true
    },
    extensions: ["AMSmath.js", "AMSsymbols.js", "noErrors.js", "noUndefined.js"],
    noErrors: {
      disabled: true
    }
  },
  "HTML-CSS": { 
    scale: 100,
    linebreaks: { automatic: true }
  },
  SVG: { 
    linebreaks: { automatic: true } 
  },
  // Process escaped references
  tex2jax: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$'], ['\\[', '\\]']],
    processEscapes: true,
    processEnvironments: true,
    skipTags: ['script', 'noscript', 'style', 'textarea', 'pre']
  },
  Macros: {
    eqref: ['{\\href{#mjx-eqn-#1}{(\\cssId{mjx-eqn-#1}{}#1)}}', 1],
    label: ['{\\cssId{mjx-eqn-#1}{}}', 1],
    ref: ['{\\href{#mjx-eqn-#1}{#1}}', 1]
  }
});
MathJax.Hub.processSectionDelay = 0;
</script>
EOF

    # Combine metadata and HTML
    {
        echo "---"
        cat "$meta_file"
        echo ""
        echo "---"
        echo ""
        cat mathjax_config.html
        echo ""
        cat temp_body.html
    } > "$output_file"
    
    # Clean up
    rm -f temp_body.html mathjax_config.html
    
    echo "✓ Created: $output_file"
done

echo "Done! Check your _posts directory."