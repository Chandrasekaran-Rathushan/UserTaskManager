# Project Environment

## Backend
- **IDE:** Visual Studio 2022
- **Framework:** .NET 8.0
- **Database:** MSSQL & SQL Server Management Studio 2019

## Frontend
- **Framework:** Next.js, React with TypeScript
- **IDE:** Visual Studio Code
- **Testing:** Jest
- **Node.js:** v20.15

## Version Control
- GitHub

## Setting Up the Project

### Clone the Repository
Clone the remote repository to your workstation.

### Backend Project Configuration
1. Open `UserTaskManagerBackend` foler in cloned repo:
   - Double-click `UserTaskManagerBackend.sln` in the project directory
   - OR in Visual Studio, go to `File` -> `Open` -> `Project/Solution` and locate `UserTaskManagerBackend.sln`

2. Update the database connection string:
   - Navigate to `\UserTaskManager\UserTaskManagerBackend\TaskAPIs\appsettings.Development.json` 
   - Example: `"Server=MSI\\SQLEXPRESS;Database=TaskDB;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=True"`

3. Clean and Build:
   - Clean the solution and build the project.

4. Run the Web API Service.

### Frontend Project Configuration
1. Open `user-task-manager-frontend` in Visual Studio Code from the cloned repository.

2. Open the terminal and run:
   - `npm install` to install dependencies.

3. Development Environment:
   - Run `next dev` to start the application in development mode.

4. Production Environment:
   - Build the application using `next build` or `npm run build`.
   - Start the application using `next start` or `npm run start`.

5. Testing:
   - Run tests with `npm test` in the terminal.

