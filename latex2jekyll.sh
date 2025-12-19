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
            --mathjax \
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
            --mathjax \
            --no-highlight \
            -o temp_body.html
    fi

    # Post-processing for references and equations
    perl -i -0777 -pe '
        # Add References header if we have a refs div without header
        s/<div id="refs"([^>]*)>/<h2>References<\/h2>\n<div id="refs"$1>/g;
        
        # Ensure bibliography entries are properly wrapped
        s/<div id="refs"[^>]*>\n(?!<div)/<div id="refs" class="references">\n/g;
        
        # Fix equation environments with labels
        s/\\\[\s*\\label\{([^}]+)\}(.*?)\\\]/\\begin{equation}\\label{$1}$2\\end{equation}/gs;
        
        # Fix theorem/lemma references (hardcoded for this document)
        s/\\ref\{thm:master\}/2/g;
        s/\\ref\{thm:peak\}/6/g;
        s/\\ref\{lem:sine-cancel\}/1/g;
        s/\\ref\{prop:var\}/4/g;
        s/\\ref\{cor:bochner\}/3/g;
    ' temp_body.html
    
    # Combine metadata and HTML
    {
        echo "---"
        cat "$meta_file"
        echo ""
        echo "---"
        echo ""
        echo '<script type="text/x-mathjax-config">
MathJax.Hub.Config({
  TeX: { equationNumbers: { autoNumber: "AMS" } }
});
</script>'
        echo ""
        cat temp_body.html
    } > "$output_file"
    
    # Clean up
    rm -f temp_body.html
    
    echo "✓ Created: $output_file"
done

echo "Done! Check your _posts directory."