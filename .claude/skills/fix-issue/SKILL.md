---
name: fix-issue
description: Fix a GitHub issue
disable-model-invocation: true
---

Fix GitHub issue $ARGUMENTS following our coding standards.

1. Read the issue description
2. Understand the requirements
3. Implement the fix
4. Write tests if necessary
5. Create a branch for the fix with the name `fix/issue-<issue-number>`
6. Commit the changes with a message like "Fixes #<issue-number>: <short description>"
7. Push the branch to the remote repository
8. Create a pull request and link it to the issue
