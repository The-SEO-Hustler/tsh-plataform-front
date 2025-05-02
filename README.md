# New Website Documentation

Front-end: Nextjs Hosted on Vercel: code → https://github.com/The-SEO-Hustler/tsh-plataform-front

Back-end tools: Nodejs Hosted on finland server: code https://github.com/The-SEO-Hustler/seo-one-page-analysis

CMS for resources and articles: Wordpress  [https://wordpress-429601-4091958.cloudwaysapps.com/](https://wordpress-429601-4091958.cloudwaysapps.com/)

Dashboard analytics: Nextjs on Vercel: code: [https://github.com/The-SEO-Hustler/tsh-dashboard](https://github.com/The-SEO-Hustler/tsh-dashboard) website: https://tsh-dashboard.vercel.app/dashboard

Database: Firebase free plan: access [https://console.firebase.google.com/](https://console.firebase.google.com/) access your theseohustler acount and enter the /seo-one-page-analysis/ project

Upstash redis is being used to register Nextjs Logs to track tool usage

Always test the pagespeed on Incognito mode, since vercel can display more information if you’re logged (which can decrease the speed)

## Pages

Home page content and all other pages are coded in **/app** folder https://github.com/The-SEO-Hustler/tsh-plataform-front/tree/main/app

For control of pages content in wordpress CMS time of development is needed.

## Blog Articles and Resources

Articles and Resources will be manage in Wordpress

Articles: https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/edit.php

Resources: https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/edit.php?post_type=resources

### Resources Type

Front end expects  types of resources [’playbooks’, ‘spreadsheets’, ‘ebooks’], you can choose which type of resource a post is by selecting its resource type in the wrdpress edit page,

Right now all resources types are displayed the same, but specific modifcations can be developed for each resource type

  

## Blog Articles and Resources updates

How nextjs incrementation static generation works: [https://remelehane.medium.com/understanding-incremental-static-generation-in-next-js-a-practical-guide-d623c7c02b45#:~:text=Incremental Static Generation (ISG) is,after a specified revalidation period](https://remelehane.medium.com/understanding-incremental-static-generation-in-next-js-a-practical-guide-d623c7c02b45#:~:text=Incremental%20Static%20Generation%20(ISG)%20is,after%20a%20specified%20revalidation%20period).

The project is set to update (revalidate) the articles and resources after 3600 seconds (1 hour) that a user visit the specific resource.

Example: you have just edited [https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/post.php?post=2306&action=edit](https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/post.php?post=2306&action=edit), when a user visits the article on the frontend [https://theseohustler.com/playbooks/ai-for-seo](https://theseohustler.com/playbooks/ai-for-seo) nextjs will deliver the static page generated on build time and ater 1 hour will compare the page static page with the content in the source (wordpress), if it’s diferent it will build a new static page (incrementation static generation)

this 3600 seconds number can be decreased, but this higher value is used to prevent too many requests to wordpress, since all the requests to the aticle within the one hour range will result in only one check in wordpress, if the revalidate number would be set in 3 seconds for example, almost every request to a resource or article would result in a check in wordpress

it’s also possible to trigger a new build deploy within the wordpress dashboard, so nextjs will use the latest content available in wordpress and build the static pages, wp deply button: [https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/admin.php?page=deploy_webhook_fields](https://wordpress-429601-4091958.cloudwaysapps.com/wp-admin/admin.php?page=deploy_webhook_fields) 

## Embbed Content

![/public/readme/image.png](/public/readme/image.png)

add /on-page-analyzer pattern and this will display the seocheck form  

## Metadata

Pages metadata can be edited here: https://github.com/The-SEO-Hustler/tsh-plataform-front/blob/main/lib/seo-data.js

## Contact Forms

Forms are being sent to  ‣ 

But will be future available in [https://tsh-dashboard.vercel.app/dashboard](https://tsh-dashboard.vercel.app/dashboard) 

## Tools Workflow

Overall workflow example: 

1 - a user request a website check in [https://theseohustler.com/seo-check](https://theseohustler.com/seo-check)

2 -  → Nextjs will create a document for this check in firebase DB

3 - Nextjs will send the resquest to Nodejs Backend

4 - Backend Receives the request and automatically responds the front with a message notifying that the proccess has begun.

5 - Nextjs Front end receives the response ‘proccess has begun’ and redirects the user to [https://theseohustler.com/seo-check/result?id={docId}](https://theseohustler.com/seo-check/result?id=%7BdocId%7D) 

6 - [https://theseohustler.com/seo-check/result?id={docId}](https://theseohustler.com/seo-check/result?id=%7BdocId%7D) Will listen for updates in DB for this Document id

7 - Backend after immediatly responding it starts proccessing the resquest and updates the Firebase doc Id through the process, allowing front end to give feedback to user about the current status of the request