# Northcoders News API

# project summary

Live version: https://nc-news-v54w.onrender.com/api/

This project is a RESTful API designed to simulate the backend of a news media web service with the capabilities of interacting with and manipulating data stored within an SQL database using endpoints covering CRUD operations.

This project was built using Test Driven Development covering happy and sad paths.


---
### Clone instructions:

1. copy the following code into your terminal after using `cd` to navigate to your desired directory:

```
git clone https://github.com/The-Nightman/be-nc-news.git
```

2. navigate into the repo folder using `cd`

3. use the following code to create a new repository with the cloned code:
```
git remote set-url origin YOUR_NEW_REPO_URL_HERE
git branch -M main
git push -u origin main
```

4. open the repo inside VsCode using the following: 
```
code .
```
---
### install dependencies:

all dependencies can be installed with the following code:
```
npm install
```
---
### Devlopment Environment Variables Setup:

1. Create two new files within the main directory named: `.env.development` and `.env.test`

2. Within the `.env.development` file add the following code:
```javascript
PGDATABASE=nc_news
```
3. Within the `.env.test` file add the following code:
```javascript
PGDATABASE=nc_news_test
```
4. Proceed to run setup scripts and begin development

### Seed local database:

1. run the following code in the terminal to setup the initial database: 
```
npm run setup-dbs
```
2. run the following code in the terminal to seed the database with the provided data:
```
npm run seed
```

3. to seed the production database with data use:
```
npm run seed-prod
```

### running tests:

The Jest test suites can be run by using the following code along with an optional identifier for the file containing test suites to run:
```
npm test OPTIONAL_IDENTIFIER
```

---
<br />

### Node.js and PostgreSQL minimum requirements
<br />
Node.js v16

psql 9.6.5