
## TestChimp

* TestChimp provides you with the best tools to filter your candidates so you can make better, faster, and easier hiring decisions

# Main Features:

- Create high-quality assessments, fast
  Organize and optimize your assessment by choosing a distinct name and job role.
  Creating a unique and detailed name allows you to easily keep track of assessments.
- Selecting a job role lets us recommend the most relevant tests. Explore our test library and find the best tests for any job role.Search for specific tests and view test recommendations from us.
- Click on a test to get an in-depth description and live preview. Video responses from your candidates give unique insight into their personality.
- Candidates can also answer your custom questions using long-form text, file upload or multiple choice—it's all up to you. Save time by re-using your favorite custom questions from previous assessments.
- Invite candidates your way
  Connect with candidates by sending email invites directly from TestChimp or straight from your ATS.
- Have a long list of candidates? Easily send multiple invites with a single click. Or have candidates sign up by sharing a direct link
- Analyze and decide on the best candidates
- Watch the results roll in and discover your strongest candidates with TestChimp’s easy-to-read output reports.

#### Tech Stack

* Client: Next
* Server: Node, Express

#### Authors


#### Dependencies
- Package Version Description
- express 4.11.0 Fast and low overhead web framework, for Node.js
- Postgresql 6.8.3 Mongoose MongoDB ODM
- Prisma 4.9.0 source database toolkit. It includes a JavaScript/TypeScript ORM for Node.js, migrations and a modern GUI to view and edit the data in your database. You can use Prisma in new projects or add it to an existing one.
- Bcrypt 5.1.0 Used for hashing the password
- jsonwebtoken 9.0.0 JSON Web Token implementation (symmetric and asymmetric)
- nodemailer 6.8.0 Easy as cake e-mail sending from your Node.js applications
- Joi 17.7.0 Object schema validation
- @prisma/client 4.9.0 Prisma Client is an auto-generated, type-safe and modern JavaScript
- TypeScript ORM for Node.js that's tailored to your data. Supports MySQL, PostgreSQL, MariaDB, SQLite databases

# Dependencies installation

* npm i --save express dotenv jsonwebtoken
* npm i @prisma/client
* npm i -D typescript @types/node @types/express prisma ts-node-dev

* init-typescript
  - npx typescript init

* initialization prisma
  - npx prisma init

* Connecting database
  - Enter username, password, and database name in dotenv file

* Migration
  - Define model
  - Run
  - npx prisma migrate dev <migration_name>
  - npx prisma generate

* Create extension to generate uuid v4
  - await prisma.$queryRaw`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

* view models
  - npx prisma studio

###### External Packages
* hunter.io: Used to verify email is exists on the web or not
