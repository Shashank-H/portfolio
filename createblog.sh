#!/bin/bash

# Check if title is provided
if [ -z "$1" ]; then
  echo "Usage: $0 \"Blog Title\""
  exit 1
fi

TITLE="$1"
BLOG_DIR="blog"
TEMPLATE="blog_template.html"
INDEX_FILE="$BLOG_DIR/index.html"

# Create blog directory if it doesn't exist
if [ ! -d "$BLOG_DIR" ]; then
  mkdir -p "$BLOG_DIR"
fi

# Generate slug
# 1. Transliterate to ASCII
# 2. Replace non-alphanumeric characters with hyphens
# 3. Remove leading/trailing hyphens
# 4. Convert to lowercase
SLUG=$(echo "$TITLE" | iconv -t ascii//TRANSLIT | sed -r 's/[^a-zA-Z0-9]+/-/g' | sed -r 's/^-+|-+$//g' | tr 'A-Z' 'a-z')

# Create directory for the blog post
BLOG_POST_DIR="$BLOG_DIR/$SLUG"
mkdir -p "$BLOG_POST_DIR"

FILENAME="$BLOG_POST_DIR/index.html"
DATE=$(date +"%B %d, %Y")

# Check if file already exists
if [ -f "$FILENAME" ]; then
  echo "Error: Blog post '$FILENAME' already exists."
  exit 1
fi

# Default tags placeholder
TAGS="<span>Tag1</span> <span>Tag2</span> <span>Tag3</span>"

# Create the blog post file
# We use a temporary file to handle the replacements safely
sed -e "s/{{TITLE}}/$TITLE/g" \
    -e "s/{{OG_TITLE}}/$TITLE/g" \
    -e "s|{{OG_URL}}|https://shashank-h.github.io/portfolio/blog/$SLUG/|g" \
    -e "s/{{DATE}}/$DATE/g" \
    -e "s|{{TAGS}}|$TAGS|g" \
    "$TEMPLATE" > "$FILENAME"

echo "Created $FILENAME"

# Update blog/index.html
# Create the new entry HTML
# We use a temporary file for the entry content to avoid complex escaping in the sed command line if possible,
# but for a short string, variable expansion is fine.
# We need to escape slashes for sed.

ENTRY="      <div class=\"blog-card\">\n        <h3><a href=\"$SLUG/\">$TITLE</a></h3>\n        <span class=\"date\">$DATE</span>\n        <p class=\"description\">Short description of the blog post...</p>\n      </div>"

# Escape backslashes and slashes in ENTRY for use in sed replacement
# Actually, we can use a different delimiter for sed to avoid escaping slashes in HTML (like | or ~)
# But newlines need handling.
# A safer way to insert multi-line content with sed:
# sed -i '/PATTERN/r file_to_insert' target_file
# But we have the content in a variable.
# We can write the entry to a temp file.

TEMP_ENTRY_FILE=$(mktemp)
printf "%b\n" "$ENTRY" > "$TEMP_ENTRY_FILE"

# Insert after the marker <!-- BLOG_ENTRIES -->
sed -i "/<!-- BLOG_ENTRIES -->/r $TEMP_ENTRY_FILE" "$INDEX_FILE"

rm "$TEMP_ENTRY_FILE"

echo "Updated $INDEX_FILE"
