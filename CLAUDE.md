# CLAUDE.md - Guide de Développement Backmark

## Vue d'ensemble du projet

Backmark est un système de gestion de tâches basé sur Markdown, **spécialement conçu pour le vibe coding avec l'IA**.

### Objectif principal : Faciliter la collaboration Humain-IA
- Permettre à l'IA de **planifier, documenter et tracker** son travail
- Offrir des **espaces dédiés** pour les plans de l'IA, ses notes et sa documentation
- Gérer les tâches de manière **structurée** pour les sessions de vibe coding
- Maintenir un **historique complet** de toutes les actions (humain et IA)

### Concept principal
- Transformer les fichiers Markdown en système de gestion de projet
- Interface CLI colorée et interactive (terminal UI)
- Support du board Kanban en mode terminal
- Stockage local, offline-first (sans Git pour le moment)
- **Espaces dédiés pour l'IA** : plans, documentation, notes de travail
- Support optionnel du protocole MCP (Model Context Protocol) pour l'intégration AI

## Spécifications détaillées des tâches

### Structure d'une tâche

Chaque tâche est un fichier Markdown avec les métadonnées suivantes :

#### Métadonnées obligatoires
- `id` : Identifiant unique (auto-généré)
- `title` : Titre de la tâche
- `description` : Description détaillée (corps du fichier Markdown)

#### Dates manuelles (saisies par l'utilisateur)
- `start_date` : Date de début planifiée
- `end_date` : Date de fin planifiée
- `release_date` : Date de release/livraison prévue

#### Dates automatiques (gérées par le système)
- `created_date` : Date de création de la tâche
- `updated_date` : Date de dernière modification
- `closed_date` : Date de fermeture (quand status passe à "Done")

#### Organisation
- `status` : Statut de la tâche (To Do, In Progress, Review, Done, etc.)
- `priority` : Priorité (low, medium, high, critical)
- `milestone` : Milestone associé (ex: "v1.0", "Sprint 3", etc.)

#### Hiérarchie et dépendances
- `parent_task` : ID de la tâche parent (si c'est une sous-tâche)
- `subtasks` : Liste des IDs des sous-tâches
- `dependencies` : Liste des IDs des tâches dont celle-ci dépend
- `blocked_by` : Liste des IDs des tâches qui bloquent celle-ci

#### Logs / Historique
- `changelog` : Tableau de logs avec chaque modification
  - `timestamp` : Date et heure de la modification
  - `action` : Type d'action (created, updated, status_changed, assigned, etc.)
  - `details` : Détails de la modification (ex: "status: To Do → In Progress")
  - `user` : Utilisateur ayant effectué l'action (optionnel)

#### Autres métadonnées
- `assignees` : Liste des personnes assignées (peut inclure "AI", "Claude", etc.)
- `labels` : Labels/tags supplémentaires
- `acceptance_criteria` : Critères d'acceptation (checklist)

#### Espaces dédiés pour l'IA
- `ai_plan` : Plan détaillé généré par l'IA pour accomplir la tâche
  - Étapes à suivre
  - Fichiers à créer/modifier
  - Dépendances à installer
  - Approche technique
- `ai_notes` : Notes de travail de l'IA pendant l'implémentation
  - Décisions prises
  - Problèmes rencontrés
  - Solutions appliquées
  - Points d'attention
- `ai_documentation` : Documentation générée par l'IA
  - Explication du code créé
  - Guide d'utilisation
  - Points techniques importants
- `ai_review` : Auto-review de l'IA sur le travail accompli
  - Ce qui a été fait
  - Tests effectués
  - Points à améliorer
  - Questions pour le développeur

## Fonctionnalités principales à implémenter

### Phase 1 : Core CLI & Gestion des tâches
- [x] Initialisation du projet TypeScript
- [ ] **Commande `init`** : Bootstrap d'un nouveau backlog
  - Créer la structure `backlog/`, `backlog/docs/`, `backlog/decisions/`
  - Générer `config.yml` avec configuration par défaut
  - Vérifier la présence d'un repo Git
- [ ] **Commande `task create`** : Créer une nouvelle tâche
  - Format de fichier : `task-{ID} - {Titre}.md`
  - Métadonnées en front-matter YAML
  - Support des options : `-d description`, `-a @assignee`, `-s status`, `-l labels`, `-p priority`
- [ ] **Commande `task list`** : Lister les tâches
  - Affichage en tableau coloré
  - Filtres : `--status`, `--assignee`, `--priority`, `--label`
- [ ] **Commande `task edit`** : Modifier une tâche
  - Édition interactive ou par flags
  - Validation des dépendances circulaires
- [ ] **Commande `task view`** : Afficher les détails d'une tâche

### Phase 2 : Board Kanban Terminal
- [ ] **Commande `board`** : Affichage Kanban interactif
  - Colonnes configurables (To Do / In Progress / Done par défaut)
  - Navigation au clavier (flèches, Tab, Enter)
  - Drag & drop entre colonnes
  - Statistiques en temps réel
- [ ] **Commande `board export`** : Export Markdown du board
  - Génération de rapport avec statistiques
  - Support de versions/releases

### Phase 3 : Search & Documentation
- [ ] **Commande `search`** : Recherche fuzzy
  - Recherche dans tâches, docs, décisions
  - Filtres combinés
  - Résultats colorés avec contexte
- [ ] **Commandes `doc`** : Gestion de documentation
  - `doc create`, `doc list`, `doc view`
  - Support des sous-dossiers
- [ ] **Commandes `decision`** : Architecture Decision Records
  - `decision create`, `decision list`, `decision view`
  - Statuts : proposed, accepted, rejected, superseded

### Phase 4 : Intégration MCP (optionnel)
- [ ] Serveur MCP pour communication avec AI agents
- [ ] Ressources exposées : `backlog://docs/task-workflow`
- [ ] Commandes MCP pour manipulation des tâches

## Stack technique recommandée

### Core
```json
{
  "dependencies": {
    "commander": "^14.0.0",           // CLI framework
    "chalk": "^5.3.0",                // Couleurs terminal
    "inquirer": "^12.0.0",            // Prompts interactifs
    "ora": "^8.0.0",                  // Spinners animés
    "boxen": "^8.0.0",                // Boîtes pour le terminal
    "cli-table3": "^0.6.5",           // Tables formatées
    "gray-matter": "^4.0.3",          // Parser front-matter YAML
    "js-yaml": "^4.1.0",              // YAML parsing/stringification
    "fuse.js": "^7.0.0",              // Fuzzy search
    "date-fns": "^4.0.0",             // Manipulation de dates
    "zod": "^3.23.0"                  // Validation de schémas
  },
  "devDependencies": {
    "typescript": "^5.9.0",
    "@types/node": "^22.0.0",
    "tsx": "^4.0.0",                  // Execute TypeScript
    "vitest": "^2.0.0",               // Tests
    "@biomejs/biome": "^2.0.0"        // Lint + Format
  }
}
```

### Terminal UI (pour le board Kanban)
- **blessed** ou **ink** (React pour le terminal) ou **terminal-kit**
- Recommandation : `blessed-contrib` pour graphiques + Kanban

### Git Integration
- **simple-git** : Wrapper Git pour Node.js
- Auto-commit optionnel

## Architecture du projet

```
backmark/
├── src/
│   ├── cli.ts                    # Point d'entrée CLI
│   ├── commands/                 # Commandes CLI
│   │   ├── init.ts
│   │   ├── task/
│   │   │   ├── create.ts
│   │   │   ├── list.ts
│   │   │   ├── edit.ts
│   │   │   ├── view.ts
│   │   │   └── index.ts
│   │   ├── board/
│   │   │   ├── display.ts
│   │   │   ├── export.ts
│   │   │   └── index.ts
│   │   ├── search.ts
│   │   ├── doc/
│   │   └── decision/
│   ├── core/                     # Logique métier
│   │   ├── backlog.ts           # Classe principale Backlog
│   │   ├── task.ts              # Classe Task + CRUD
│   │   ├── config.ts            # Configuration management
│   │   ├── file-system.ts       # Opérations fichiers
│   │   ├── git.ts               # Intégration Git
│   │   └── parser.ts            # Parsing Markdown + YAML
│   ├── ui/                       # Composants UI terminal
│   │   ├── board-tui.ts         # Kanban board interactif
│   │   ├── table.ts             # Tableaux formatés
│   │   ├── prompts.ts           # Prompts réutilisables
│   │   └── colors.ts            # Thème de couleurs
│   ├── utils/                    # Utilitaires
│   │   ├── validation.ts        # Validators Zod
│   │   ├── date.ts              # Formatage dates
│   │   ├── fuzzy-search.ts      # Wrapper Fuse.js
│   │   └── logger.ts            # Logging coloré
│   ├── types/                    # Définitions TypeScript
│   │   ├── task.ts
│   │   ├── config.ts
│   │   └── index.ts
│   └── mcp/                      # Model Context Protocol (Phase 4)
│       ├── server.ts
│       └── resources.ts
├── templates/                    # Templates Markdown
│   ├── task.md
│   ├── doc.md
│   └── decision.md
├── tests/
├── package.json
├── tsconfig.json
├── biome.json
└── README.md
```

## Structures de données

### Format de tâche (Markdown avec front-matter)

```markdown
---
id: 10
title: "Add core search functionality"

# Dates manuelles
start_date: "2025-10-20"
end_date: "2025-10-25"
release_date: "2025-11-01"

# Dates automatiques
created_date: "2025-10-22T10:30:00Z"
updated_date: "2025-10-22T14:15:00Z"
closed_date: null

# Organisation
status: "In Progress"
priority: "high"
milestone: "v1.0"

# Personnes et labels
assignees:
  - "@alice"
  - "@bob"
labels:
  - "feature"
  - "backend"

# Hiérarchie et dépendances
parent_task: null
subtasks:
  - 11
  - 12
dependencies:
  - 7
  - 8
blocked_by: []

# Historique
changelog:
  - timestamp: "2025-10-22T10:30:00Z"
    action: "created"
    details: "Task created"
    user: "@alice"
  - timestamp: "2025-10-22T14:15:00Z"
    action: "status_changed"
    details: "status: To Do → In Progress"
    user: "@alice"
  - timestamp: "2025-10-22T14:20:00Z"
    action: "assigned"
    details: "assigned: @bob"
    user: "@alice"

# Critères d'acceptation
acceptance_criteria:
  - text: "Search returns results in under 100ms"
    checked: false
  - text: "Supports filtering by status and priority"
    checked: false
  - text: "Highlights matching text in results"
    checked: true

# Espaces pour l'IA
ai_plan: |
  ## Plan d'implémentation

  ### 1. Setup Fuse.js
  - Installer fuse.js via npm
  - Créer le fichier src/utils/fuzzy-search.ts
  - Configurer Fuse.js avec threshold: 0.3

  ### 2. Indexation des tâches
  - Modifier src/core/backlog.ts pour indexer toutes les tâches
  - Créer une méthode searchTasks(query: string, filters?: SearchFilters)
  - Supporter les recherches dans : title, description, labels

  ### 3. Commande CLI
  - Créer src/commands/search.ts
  - Ajouter la commande dans src/cli.ts
  - Afficher les résultats avec highlighting

  ### 4. Tests
  - Tests unitaires pour fuzzy-search.ts
  - Tests d'intégration pour la commande search

ai_notes: |
  ## Notes de développement

  **2025-10-22 14:30** - Démarrage de l'implémentation
  - Installation de fuse.js OK
  - Threshold de 0.3 semble optimal après tests

  **2025-10-22 15:00** - Problème rencontré
  - L'indexation initiale prend trop de temps avec 1000+ tâches
  - Solution : Implémenter un cache avec invalidation sur modification

  **2025-10-22 16:00** - Amélioration
  - Ajout du highlighting dans les résultats
  - Utilisation de chalk pour coloriser les matches

ai_documentation: |
  ## Documentation de la recherche fuzzy

  ### Utilisation
  ```bash
  backmark search "feature" --status "In Progress"
  ```

  ### Configuration Fuse.js
  - **threshold**: 0.3 (0 = exact, 1 = match anything)
  - **keys**: title, description, labels
  - **includeScore**: true pour trier par pertinence

  ### Performance
  - Cache activé pour les grandes collections (>100 tâches)
  - Invalidation automatique à chaque modification
  - Temps de recherche : ~50ms pour 1000 tâches

ai_review: |
  ## Auto-review

  ### ✅ Complété
  - [x] Fuse.js configuré et fonctionnel
  - [x] Cache implémenté pour la performance
  - [x] Highlighting des résultats
  - [x] Commande CLI complète
  - [x] Tests unitaires

  ### 🔍 Tests effectués
  - Recherche dans 1000 tâches : ~45ms ✓
  - Filtres combinés fonctionnent correctement ✓
  - Highlighting fonctionne avec chalk ✓

  ### 💡 Points à améliorer
  - Pourrait ajouter une recherche par regex pour les power users
  - Envisager d'indexer aussi les sous-tâches

  ### ❓ Questions
  - Faut-il indexer le contenu des fichiers docs/ aussi ?
  - Quelle stratégie pour la recherche multi-langue ?
---

# Add core search functionality

## Description
Implement fuzzy search across all tasks, documents, and decisions using Fuse.js.

## Implementation Notes
- Use Fuse.js threshold of 0.3 for optimal results
- Consider caching search index for large backlogs

## Implementation Plan
1. Set up Fuse.js with custom configuration
2. Index all markdown files on startup
3. Create interactive search UI with preview

## Notes
Consider caching search index for large backlogs.
```

### Configuration (config.yml)

```yaml
project:
  name: "Backmark Development"
  createdAt: "2025-10-22T10:00:00Z"

board:
  columns:
    - "To Do"
    - "In Progress"
    - "Review"
    - "Done"

git:
  autoCommit: false
  commitMessagePrefix: "[Backmark]"

display:
  dateFormat: "YYYY-MM-DD HH:mm"
  zeroPaddedIds: true
  theme: "default"

search:
  threshold: 0.3
  maxResults: 50
```

## Exemples d'implémentation

### 1. CLI avec Commander et couleurs

```typescript
// src/cli.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { taskCommands } from './commands/task';
import { boardCommands } from './commands/board';
import { initCommand } from './commands/init';

const program = new Command();

program
  .name('backmark')
  .description(chalk.bold.blue('📋 Backmark - Markdown Task Management'))
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize a new backlog')
  .argument('[name]', 'Project name')
  .action(initCommand);

// Task commands
const task = program.command('task').description('Manage tasks');
taskCommands(task);

// Board commands
const board = program.command('board').description('Kanban board');
boardCommands(board);

program.parse();
```

### 2. Création de tâche avec validation

```typescript
// src/commands/task/create.ts
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';
import { Backlog } from '../../core/backlog';
import { TaskSchema } from '../../utils/validation';

export async function createTask(title: string, options: any) {
  const spinner = ora('Creating task...').start();

  try {
    const backlog = await Backlog.load();

    // Interactive prompt si options manquantes
    if (!options.description) {
      const answers = await inquirer.prompt([
        {
          type: 'editor',
          name: 'description',
          message: 'Task description:'
        }
      ]);
      options.description = answers.description;
    }

    // Validation avec Zod
    const taskData = TaskSchema.parse({
      title,
      description: options.description,
      status: options.status || 'To Do',
      priority: options.priority || 'medium',
      assignees: options.assignees ? options.assignees.split(',') : [],
      labels: options.labels ? options.labels.split(',') : []
    });

    const task = await backlog.createTask(taskData);

    spinner.succeed(chalk.green(`✓ Task ${chalk.bold(`#${task.id}`)} created`));

    console.log(chalk.dim('\nFile:'), chalk.cyan(task.filePath));
    console.log(chalk.dim('Status:'), colorizeStatus(task.status));
    console.log(chalk.dim('Priority:'), colorizePriority(task.priority));

  } catch (error) {
    spinner.fail(chalk.red('Failed to create task'));
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

function colorizeStatus(status: string): string {
  const colors: Record<string, any> = {
    'To Do': chalk.gray,
    'In Progress': chalk.yellow,
    'Done': chalk.green
  };
  return (colors[status] || chalk.white)(status);
}

function colorizePriority(priority: string): string {
  const colors: Record<string, any> = {
    low: chalk.blue,
    medium: chalk.yellow,
    high: chalk.red,
    critical: chalk.bgRed.white
  };
  return (colors[priority] || chalk.white)(priority);
}
```

### 3. Liste de tâches en tableau coloré

```typescript
// src/commands/task/list.ts
import chalk from 'chalk';
import Table from 'cli-table3';
import { Backlog } from '../../core/backlog';

export async function listTasks(options: any) {
  const backlog = await Backlog.load();
  const tasks = await backlog.getTasks({
    status: options.status,
    assignee: options.assignee,
    priority: options.priority,
    label: options.label
  });

  if (tasks.length === 0) {
    console.log(chalk.yellow('No tasks found.'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('ID'),
      chalk.bold('Title'),
      chalk.bold('Status'),
      chalk.bold('Priority'),
      chalk.bold('Assignees'),
      chalk.bold('Updated')
    ],
    colWidths: [6, 40, 15, 12, 20, 12],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  tasks.forEach(task => {
    table.push([
      chalk.bold(`#${task.id}`),
      truncate(task.title, 38),
      colorizeStatus(task.status),
      colorizePriority(task.priority),
      task.assignees.join(', ') || chalk.dim('—'),
      formatDate(task.updated)
    ]);
  });

  console.log(table.toString());
  console.log(chalk.dim(`\nTotal: ${tasks.length} task(s)`));
}
```

### 4. Board Kanban interactif avec blessed

```typescript
// src/ui/board-tui.ts
import blessed from 'blessed';
import contrib from 'blessed-contrib';
import { Backlog } from '../core/backlog';

export class BoardTUI {
  private screen: blessed.Widgets.Screen;
  private grid: any;
  private backlog: Backlog;

  constructor(backlog: Backlog) {
    this.backlog = backlog;
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Backmark Board'
    });

    this.grid = new contrib.grid({
      rows: 12,
      cols: 12,
      screen: this.screen
    });

    this.setupKeybindings();
  }

  async render() {
    const columns = await this.backlog.getConfig('board.columns');
    const colWidth = Math.floor(12 / columns.length);

    columns.forEach((column, index) => {
      const tasks = await this.backlog.getTasksByStatus(column);

      const box = this.grid.set(0, index * colWidth, 12, colWidth, blessed.list, {
        label: ` ${column} (${tasks.length}) `,
        tags: true,
        keys: true,
        vi: true,
        style: {
          selected: {
            bg: 'blue',
            fg: 'white'
          },
          border: {
            fg: this.getColumnColor(column)
          }
        },
        border: {
          type: 'line'
        }
      });

      // Populate tasks
      const items = tasks.map(task =>
        `{${this.getPriorityColor(task.priority)}-fg}#${task.id}{/} ${task.title}`
      );
      box.setItems(items);
    });

    this.screen.render();
  }

  private setupKeybindings() {
    this.screen.key(['escape', 'q', 'C-c'], () => {
      return process.exit(0);
    });

    this.screen.key(['r'], () => {
      this.render();
    });
  }

  private getColumnColor(column: string): string {
    const colors: Record<string, string> = {
      'To Do': 'gray',
      'In Progress': 'yellow',
      'Review': 'cyan',
      'Done': 'green'
    };
    return colors[column] || 'white';
  }

  private getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: 'blue',
      medium: 'yellow',
      high: 'red',
      critical: 'magenta'
    };
    return colors[priority] || 'white';
  }
}
```

### 5. Classe Backlog principale

```typescript
// src/core/backlog.ts
import * as fs from 'fs/promises';
import * as path from 'path';
import matter from 'gray-matter';
import { parse, stringify } from 'yaml';
import { Task, TaskData } from '../types/task';
import { Config } from '../types/config';

export class Backlog {
  private rootPath: string;
  private backlogPath: string;
  private config: Config;

  private constructor(rootPath: string, config: Config) {
    this.rootPath = rootPath;
    this.backlogPath = path.join(rootPath, 'backlog');
    this.config = config;
  }

  static async load(cwd: string = process.cwd()): Promise<Backlog> {
    const configPath = path.join(cwd, 'backlog', 'config.yml');

    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = parse(configContent) as Config;
      return new Backlog(cwd, config);
    } catch (error) {
      throw new Error('Backlog not initialized. Run `backmark init` first.');
    }
  }

  async createTask(data: TaskData): Promise<Task> {
    const id = await this.getNextTaskId();
    const fileName = this.sanitizeFileName(`task-${id} - ${data.title}.md`);
    const filePath = path.join(this.backlogPath, fileName);

    const task: Task = {
      ...data,
      id,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      filePath
    };

    const content = this.serializeTask(task);
    await fs.writeFile(filePath, content, 'utf-8');

    return task;
  }

  async getTasks(filters?: any): Promise<Task[]> {
    const files = await fs.readdir(this.backlogPath);
    const taskFiles = files.filter(f => f.startsWith('task-') && f.endsWith('.md'));

    const tasks: Task[] = [];
    for (const file of taskFiles) {
      const filePath = path.join(this.backlogPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const task = this.parseTask(content, filePath);

      // Apply filters
      if (this.matchesFilters(task, filters)) {
        tasks.push(task);
      }
    }

    return tasks.sort((a, b) => b.id - a.id);
  }

  private parseTask(content: string, filePath: string): Task {
    const { data, content: body } = matter(content);
    return {
      ...data,
      description: body.trim(),
      filePath
    } as Task;
  }

  private serializeTask(task: Task): string {
    const { description, filePath, ...frontmatter } = task;

    return matter.stringify(description, frontmatter);
  }

  private async getNextTaskId(): Promise<number> {
    const tasks = await this.getTasks();
    if (tasks.length === 0) return 1;
    return Math.max(...tasks.map(t => t.id)) + 1;
  }

  private sanitizeFileName(name: string): string {
    return name.replace(/[^a-z0-9\s\-\.]/gi, '').replace(/\s+/g, ' ');
  }

  private matchesFilters(task: Task, filters?: any): boolean {
    if (!filters) return true;

    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    if (filters.assignee && !task.assignees.includes(filters.assignee)) return false;
    if (filters.label && !task.labels.some(l => l === filters.label)) return false;

    return true;
  }

  getConfig<T = any>(key: string): T {
    return key.split('.').reduce((obj, k) => obj?.[k], this.config as any);
  }
}
```

## Plan de développement

### Semaine 1 : Foundation
1. Setup du projet TypeScript
2. Configuration des outils (Biome, TypeScript, tests)
3. Implémentation de la commande `init`
4. Structure de fichiers et parsing YAML/Markdown
5. Classe Backlog de base

### Semaine 2 : Task Management
1. Commandes `task create`, `task list`, `task view`
2. Validation avec Zod
3. Filtres et recherche basique
4. Commande `task edit` avec inquirer
5. Tests unitaires

### Semaine 3 : Board Kanban
1. Setup blessed/blessed-contrib
2. Affichage du board en colonnes
3. Navigation au clavier
4. Drag & drop entre colonnes
5. Export board en Markdown

### Semaine 4 : Advanced Features
1. Fuzzy search avec Fuse.js
2. Gestion complète de l'historique (changelog)
3. Validation des dépendances circulaires
4. Commandes de hiérarchie (`tree`, `deps`, `blocked`)
5. Documentation (`doc` commands) - optionnel
6. Polishing & documentation

### Phase Future : MCP Integration
1. Serveur MCP
2. Exposition des ressources
3. Intégration avec Claude Code

## Commandes CLI cibles

```bash
# Initialization
backmark init "My Project"

# Task management - Création complète
backmark task create "Implement search feature" \
  -d "Implement fuzzy search with Fuse.js" \
  -s "To Do" \
  -p high \
  --start "2025-10-20" \
  --end "2025-10-25" \
  --release "2025-11-01" \
  --milestone "v1.0" \
  --assignees "@alice,@bob" \
  --labels "feature,backend,search,fuse.js,performance"

# Task management - Gestion des sous-tâches
backmark task create "Setup Fuse.js configuration" --parent 10
backmark task create "Implement search UI" --parent 10
backmark task list --parent 10              # Liste les sous-tâches de la tâche #10
backmark task tree 10                       # Affiche l'arbre hiérarchique

# Task management - Dépendances
backmark task create "Deploy search" --depends-on 10,11
backmark task deps 10                       # Affiche les dépendances de la tâche #10
backmark task blocked                       # Liste toutes les tâches bloquées

# Task management - Affichage et filtres
backmark task list --status "In Progress" --priority high
backmark task list --milestone "v1.0"
backmark task list --keyword "search"
backmark task view 7                        # Affiche détails + historique complet
backmark task history 7                     # Affiche uniquement l'historique (changelog)

# Task management - Édition
backmark task edit 7 --status "In Progress"   # Log automatique : status_changed
backmark task edit 7 --priority critical      # Log automatique : priority_changed
backmark task assign 7 @charlie               # Log automatique : assigned
backmark task close 7                         # Status → Done + closed_date + log

# Board
backmark board                    # Interactive TUI
backmark board export             # Export as Markdown
backmark board --milestone "v1.0" # Filtre par milestone

# Search
backmark search "feature" --status "In Progress"
backmark search --milestone "v1.0"

# Documentation
backmark doc create "Architecture" -f "docs/arch.md"
backmark doc list

# Decisions
backmark decision create "Use TypeScript" -s proposed

# Commandes spécifiques pour l'IA (vibe coding)
backmark task ai-plan 7 "Mon plan détaillé..."       # Ajoute/modifie le plan de l'IA
backmark task ai-note 7 "Note de travail..."         # Ajoute une note timestampée
backmark task ai-doc 7 "Documentation du code..."    # Ajoute/modifie la documentation
backmark task ai-review 7 "Auto-review..."           # Ajoute l'auto-review de l'IA

# Affichage des sections IA
backmark task view 7 --ai-plan                       # Affiche uniquement le plan
backmark task view 7 --ai-notes                      # Affiche uniquement les notes
backmark task view 7 --ai-all                        # Affiche tous les espaces IA

# Workflow typique pour une session de vibe coding
backmark task create "Add user authentication" --assignees "Claude"
backmark task ai-plan 15 "$(cat plan.md)"            # L'IA documente son plan
backmark task edit 15 --status "In Progress"         # L'IA démarre le travail
backmark task ai-note 15 "Installed passport.js..."  # L'IA prend des notes
backmark task ai-doc 15 "$(cat auth-guide.md)"       # L'IA génère la doc
backmark task ai-review 15 "$(cat review.md)"        # L'IA fait son auto-review
backmark task close 15                                # Tâche terminée
```

## Bonnes pratiques

### Pour le vibe coding avec l'IA

#### Workflow recommandé
1. **Création de tâche** : L'humain crée la tâche avec les objectifs
2. **Planning** : L'IA documente son plan dans `ai_plan`
3. **Validation** : L'humain valide le plan avant démarrage
4. **Exécution** : L'IA passe le statut en "In Progress" et travaille
5. **Documentation continue** : L'IA ajoute des notes au fur et à mesure dans `ai_notes`
6. **Documentation finale** : L'IA génère la doc dans `ai_documentation`
7. **Review** : L'IA fait son auto-review dans `ai_review`
8. **Validation finale** : L'humain review et ferme la tâche

#### Ce que l'IA doit documenter
- **Dans ai_plan** : Approche technique, fichiers à modifier, étapes précises
- **Dans ai_notes** : Décisions prises, problèmes rencontrés, solutions
- **Dans ai_documentation** : Guide d'utilisation, explications techniques
- **Dans ai_review** : Ce qui fonctionne, ce qui reste à faire, questions

#### Utilisation des logs (changelog)
- Chaque action significative doit être loggée automatiquement
- L'IA peut ajouter des logs manuels pour les décisions importantes
- Format : `timestamp`, `action`, `details`, `user: "AI"` ou `user: "Claude"`

### Gestion des erreurs
- Toujours wrapper les opérations async dans try/catch
- Messages d'erreur colorés et explicites
- Exit codes appropriés (0 = succès, 1 = erreur)

### Performance
- Lazy loading des tâches (ne pas tout charger en mémoire)
- Cache pour les recherches fréquentes
- Indexation pour fuzzy search
- Les champs `ai_*` peuvent être volumineux : ne pas tous les charger par défaut

### UX Terminal
- Spinners pour les opérations longues (ora)
- Confirmations pour les actions destructives
- Tables bien formatées et colorées
- Shortcuts clavier intuitifs
- Affichage spécial pour les sections IA (avec icônes 🤖)

### Tests
- Tests unitaires pour la logique métier
- Tests d'intégration pour les commandes CLI
- Fixtures pour les fichiers Markdown

## Ressources utiles

- [Commander.js docs](https://github.com/tj/commander.js)
- [Chalk docs](https://github.com/chalk/chalk)
- [Blessed docs](https://github.com/chjj/blessed)
- [Inquirer docs](https://github.com/SBoudrias/Inquirer.js)
- [Gray-matter docs](https://github.com/jonschlinkert/gray-matter)
- [Fuse.js docs](https://www.fusejs.io/)

## Next Steps

1. **Setup initial** : `npm init` et installation des dépendances
2. **Structure** : Créer l'arborescence `src/` avec les dossiers principaux
3. **CLI skeleton** : Commander.js avec les commandes de base
4. **Init command** : Première commande fonctionnelle
5. **Task CRUD** : Implémentation complète du cycle de vie des tâches
6. **Board UI** : Interface Kanban avec blessed

---

**Auteur**: Guide généré pour le développement de Backmark
**Date**: 2025-10-22
