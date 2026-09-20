# Data and Code Management — Autumn 2026
#
# There is no build step: the repository IS the published site. These targets
# are conveniences, nothing more. Everything needs only Python 3 and Git.

PORT ?= 8000
SLIDES_SRC ?= ../slides-2026/build

.DEFAULT_GOAL := help

.PHONY: help serve check slides

help:                ## Show this help
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
	 | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[1m%-10s\033[0m %s\n", $$1, $$2}'

serve:               ## Preview locally at http://localhost:$(PORT)
	@echo "Serving on http://localhost:$(PORT)  (Ctrl-C to stop)"
	@python3 -m http.server $(PORT)

check:               ## Validate course.json and show what students can see
	@python3 tools/check.py

slides:              ## Copy decks (*.pdf, *.html) from $(SLIDES_SRC) into slides/
	@test -d "$(SLIDES_SRC)" || { echo "No such directory: $(SLIDES_SRC)"; exit 1; }
	@found=0; for f in "$(SLIDES_SRC)"/*.pdf "$(SLIDES_SRC)"/*.html; do \
	  [ -f "$$f" ] || continue; cp -v "$$f" slides/; found=1; done; \
	  [ $$found -eq 1 ] || echo "No .pdf or .html decks found in $(SLIDES_SRC)"
	@echo "Now point the session's \"slides\" field in course.json at the new file."
