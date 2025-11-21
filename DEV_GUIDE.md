# Project tree

- `Linux / macOS`

```bash
  tree -I "node_modules|dist|.git|.vscode|logs|tmp|coverage" > project-tree.txt
```

- `Windows PowerShell`

```bash
tree /F /A | findstr /V "node_modules dist .git .vscode logs tmp coverage" > project-tree.txt
```
