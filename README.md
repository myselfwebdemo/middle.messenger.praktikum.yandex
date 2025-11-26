# Middle Messenger (Sprint 2)

## Project Overview:

The project is a starter layout for a messenger-style web application.
It includes several static pages and Handlebars templates, uses TypeScript modules for better code structure, and PostCSS with autoprefixer alongside CSSnano for optimized styling. The build is configured with Vite for fast development and bundling.

## Fast Deploy

```bash
npm install        # build dependencies
npm run start      # start dev-server at http://localhost:3000
npm run build      # build project in dist/
npm run preview    # start local preview of the build
```

## Deployed App
Link: https://middle-messenger-yandex-praktikum.netlify.app/

## Figma Prototype Of The App
https://www.figma.com/design/EIJl6jgQEAapCA8nKsz0wp/Chat_external_link--Copy-?node-id=0-1&t=YNX3VAGORjhamOaX-1
<<<<<<< HEAD
=======

## What's New? New Functionality
### Real-Time Functionality
- Added WebSocket connection for real-time chat messaging  
- Implemented message history loading and incremental loading on scroll  
- Added automatic reconnection logic and token renewal  
- Integrated full chat API:  
    - (+) login, signup, logout  
    - (+) create/delete chats  
    - (+) add/remove users  
    - (+) fetch chat token  
    - (+) request/send messages in real time  

## Tech Stack
- **TypeScript** — static typing and safer architecture.  
- **Vite** — fast build and development server.  
- **Handlebars** — templating for rendering UI blocks.  
- **ESLint**, **Stylelint**, **EditorConfig** — code quality and consistency.  
- **Custom EventBus + Block system** — component-based architecture.  

## Input Fields Validation Rules
### Registration Form
| Field | Rules |
|-------|-------|
| **first_name / second_name** | Must start with a capital letter (Latin or Cyrillic). No spaces, digits, or special characters except dash `-`. Cannot be blank. |
| **login** | 3–20 characters, must contain at least one letter, may include numbers, dash `-`, or underscore `_`. Cannot contain spaces. |
| **email** | Must contain `@` and a dot after it. Local part may include letters, numbers, `-`, `_`, or `.`. Domain must include letters before the dot. TLD must have at least 2 letters. |
| **password** | 8–40 characters, must include at least one uppercase letter and one number. Cannot be blank. |
| **password-rep** | Must match `password`. Cannot be blank. |
| **phone** | 10–15 digits, must start with `+`. Only numbers allowed. Cannot be blank. |
| **message** | Cannot be blank. |

### Login Form
| Field | Rules |
|-------|-------|
| **login** | Cannot be blank on submit. Optional otherwise. |
| **password** | Cannot be blank on submit. Optional otherwise. |

## Utilities & Tips
### Cloc: find out number of lines in your project
To count lines of code use ```cloc```  
#### By default ```cloc``` traverses whole directory!  
If you want to specify directory, write ```cloc ./directory-name```  
Same way you can specify file: ```cloc ./directory-name/file-name.ext```  
You can exclude directory or file by using ```clocl --exclude-dir=dir-name1,dir-name2``` or ```cloc --exclude-list-file=file-name.ext```  
Exclude files by extension(s): ```cloc --exclude-ext=extensions```
### Stylelint: check your styles
To run stylelint use command ``` npx stylelint "**/*.css" ```
### ESLint: check your scripts
To run stylelint use command ``` npx eslint . ```, ``` npx eslint src ``` or ``` npx eslint src/specific.file ```
>>>>>>> sprint_3
