# Agents Documentation

## Operational Constraints
- **Production Deployment**: ONLY the user is authorized to invoke `make install`. The agent must NEVER run this command.
- **Git Workflow**: Since this is a git repository, all file operations must use git commands:
    - Use `git mv` for renaming or moving files.
    - Use `git rm` for deleting files or directories.
    - Use `git add` for new files.
