# Middle Messenger (Sprint 2)

## What's New?

— Implemented TypeScript.  
— Added component approach to the project:  
    • (+) Block & Event Bus implementation  
    • (+) ```blocks``` folder onto the same layer as ```components``` & ```pages``` folders  

## Project Overview:

The project is a starter layout for a messenger-style web application.
It includes several static pages and Handlebars templates, uses TypeScript modules for better code structure, and PostCSS with Autoprefixer / CSSNano for optimized and consistent styling. The build is configured with Vite for fast development and bundling.

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

## Utilities & Tips
To count lines of code use ```cloc```  
#### By default ```cloc``` traverses whole directory!  
If you want to specify directory, write ```cloc ./directory-name```  
Same way you can specify file: ```cloc ./directory-name/file-name.ext```  
You can exclude directory or file by using ```clocl --exclude-dir=dir-name1,dir-name2``` or ```cloc --exclude-list-file=file-name.ext```  
Exclude files by extension(s): ```cloc --exclude-ext=extensions```  
