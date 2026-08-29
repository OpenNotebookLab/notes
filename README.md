# Open Notebook Lab

Open Notebook Lab is a public collaborative knowledge repository for course and subject notes. It is organized by **course or subject name** and maintained by equal contributors.

> **Detailed notes explain. Review pages summarize. Cheat sheets compress.**

## Reading modes

1. **Detailed topic pages** for learning concepts in depth.
2. **Course review pages** for fast full-course recap.
3. **Print-friendly cheat sheets** for exam preparation.

## Repository structure

```text
notes/
├── README.md
├── CONTRIBUTING.md
├── LICENSE-CONTENT.md
├── LICENSE-CODE.md
├── requirements.txt
├── mkdocs.yml
├── docs/
│   ├── index.md
│   ├── courses/
│   │   ├── index.md
│   │   └── example-course/
│   │       ├── index.md
│   │       ├── topics/
│   │       │   └── 01-example-topic.md
│   │       ├── review.md
│   │       ├── cheatsheet.md
│   │       └── references.md
│   ├── subjects/
│   │   └── index.md
│   ├── templates/
│   │   ├── course-template.md
│   │   ├── topic-template.md
│   │   ├── review-template.md
│   │   └── cheatsheet-template.md
│   └── stylesheets/
│       └── print.css
└── .github/
    ├── workflows/
    │   └── deploy-pages.yml
    └── pull_request_template.md
```

## Local setup

```bash
python -m pip install -r requirements.txt
mkdocs serve
```

Then open the local URL shown by MkDocs (usually `http://127.0.0.1:8000`).

## Add a new course

1. Copy `/home/runner/work/notes/notes/docs/templates/course-template.md` into a new folder under `docs/courses/<course-name>/index.md`.
2. Add `topics/`, `review.md`, `cheatsheet.md`, and `references.md` using the templates.
3. Add the new pages to navigation in `/home/runner/work/notes/notes/mkdocs.yml`.
4. Open a pull request with your changes.

## Contribution workflow

- Create a branch.
- Make focused edits by course/subject.
- Open a pull request and explain what you added or corrected.
- Use the pull request checklist for accuracy, references, formatting, and duplication checks.

See `/home/runner/work/notes/notes/CONTRIBUTING.md` for full rules.

## Academic integrity policy

- Do not upload real university assignments, exam papers, official solutions, or copyrighted course packets.
- Keep examples original or clearly public/open resources.
- Use this repository for learning notes and summaries, not for academic misconduct.

## Licensing policy

This repository uses split licensing:

- **Content** (original notes, diagrams, summaries, cheat sheets):
  [CC BY 4.0](./LICENSE-CONTENT.md)
- **Code and configuration** (scripts, config files, workflow files, original code examples):
  [MIT License](./LICENSE-CODE.md)

Unless otherwise stated, copyright is held by **OpenNotebookLab contributors**.
