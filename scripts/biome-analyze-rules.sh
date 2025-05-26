#!/bin/bash

# 1. Run Biome on your project, emitting JSON
pnpm biome check --reporter=json . > biome-report.json

# 2. Extract ruleId, count occurrences, list affected files, and separate errors/warnings
jq -r '
  # Function to format diagnostics for a specific severity
  def format_diagnostics(sev_label; items):
    items
    | group_by(.category)
    | map({
        category: .[0].category,
        count: length,
        files: (map(.location.path.file) | unique)
      })
    | sort_by(-.count) # Sort by count descending for this severity group
    | map("\(.count) \(.category) (\(sev_label))\n" + (.files | map("  - \(.)") | join("\n")))
    | join("\n"); # Join all formatted items for this severity into a single string

  .diagnostics as $all_diagnostics
  | ($all_diagnostics | map(select(.severity == "error"))) as $error_items
  | ($all_diagnostics | map(select(.severity == "warning"))) as $warning_items

  | (if ($error_items | length > 0) then "--- Errors ---\n" + (format_diagnostics("error"; $error_items)) else "" end) as $formatted_errors
  | (if ($warning_items | length > 0) then "--- Warnings ---\n" + (format_diagnostics("warning"; $warning_items)) else "" end) as $formatted_warnings

  | if $formatted_errors != "" and $formatted_warnings != "" then
      $formatted_errors + "\n\n" + $formatted_warnings
    elif $formatted_errors != "" then
      $formatted_errors
    elif $formatted_warnings != "" then
      $formatted_warnings
    else
      "No significant lint issues (errors or warnings) found by Biome."
    end
' biome-report.json
