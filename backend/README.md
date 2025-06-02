# Java Spring Boot Template

A Spring Boot template for the FedTec Lab project, featuring CRUD operations for Users and Expenses with PostgreSQL database integration and Swagger documentation.

## Prerequisites

- Java 21
- Maven
- PostgreSQL

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd java-spring-template
   ```

2. Create a PostgreSQL database:

   ```sql
   CREATE DATABASE fedtec_db;
   ```

3. Update the database configuration in `src/main/resources/application.properties` if needed:

   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/fedtec_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. Build and run the application:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

## API Documentation

Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/{id}` - Update an existing user
- `DELETE /api/users/{id}` - Delete a user

### Expense Endpoints

- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/user/{userId}` - Get all expenses for a specific user
- `GET /api/expenses/{id}` - Get expense by ID
- `POST /api/expenses/user/{userId}` - Create a new expense for a user
- `PUT /api/expenses/{id}` - Update an existing expense
- `DELETE /api/expenses/{id}` - Delete an expense

## Testing and Code Coverage

The project uses JUnit 5 and Mockito for unit testing, with JaCoCo for code coverage reporting.

### Running Tests

You can run the tests using Maven:

```bash
mvn test
```

### Viewing Code Coverage Reports

The project includes JaCoCo for code coverage. After running tests, JaCoCo generates reports at `target/site/jacoco/index.html`.

For convenience, a script has been provided to run tests and automatically open the coverage report:

```bash
# Make the script executable (only needed once)
chmod +x run-tests-with-coverage.sh

# Run the script
./run-tests-with-coverage.sh
```

This script:

1. Cleans previous test results
2. Runs the tests with JaCoCo instrumentation
3. Generates a detailed HTML coverage report
4. Automatically opens the report in your default browser

## Example Requests

### Create a User

```bash
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com"
  }'
```

### Create an Expense

```bash
curl -X POST http://localhost:8080/api/expenses/user/1 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Office Supplies",
    "amount": 150.00,
    "expenseDate": "2024-03-15T10:00:00"
  }'
```

## Project Structure

```
src
├── main
│   ├── java
│   │   └── com
│   │       └── fedtec
│   │           ├── config          # Configuration classes
│   │           ├── controller      # REST controllers
│   │           ├── model           # Entity classes
│   │           ├── repository      # JPA repositories
│   │           ├── service         # Service layer
│   │           └── JavaSpringTemplateApplication.java
│   └── resources
│       └── application.properties  # Application configuration
└── test
    └── java
        └── com
            └── fedtec
                └── service         # Service tests
```

## Features

- Java 21
- Spring Boot 3.2.3
- PostgreSQL Database
- JPA/Hibernate
- Swagger/OpenAPI Documentation
- RESTful API Design
- Input Validation
- Transaction Management
- Lombok for reducing boilerplate code
- JUnit 5 & Mockito for testing
- JaCoCo for code coverage reporting

## SonarQube Integration

This project includes support for SonarQube code quality analysis. SonarQube offers automated code reviews, detects bugs, vulnerabilities, and code smells across your project.

### Local SonarQube Setup

To run SonarQube analysis locally:

1. **Install and start a local SonarQube server** (one-time setup):

   ```bash
   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
   ```

   **Important**: This step is mandatory. The analysis script requires a running SonarQube server.

2. **Access SonarQube UI** at http://localhost:9000 (default credentials: admin/admin)

3. **Generate a SonarQube token**:

   - Log in to SonarQube
   - Go to your profile (top right) → "My Account" → "Security" → "Generate Token"
   - Save this token securely

4. **Run SonarQube analysis** using the provided script:

   ```bash
   # Make sure SonarQube container is running first
   docker ps | grep sonarqube || docker start sonarqube

   # Run with token as argument
   ./run-sonar.sh YOUR_TOKEN

   # Or save token to a file (more secure)
   echo "YOUR_TOKEN" > sonar-token.txt
   ./run-sonar.sh
   ```

   _Note: The script automatically creates the project if it doesn't exist, but does not start the SonarQube container._

5. **View results** at http://localhost:9000/dashboard?id=java-spring-template

### Using SonarCloud for CI/CD

For CI/CD integration (like GitHub Actions), SonarCloud is the recommended approach:

1. Sign up at [SonarCloud](https://sonarcloud.io)
2. Create an organization and project
3. Get a token from SonarCloud
4. Update project properties:
   ```properties
   sonar.host.url=https://sonarcloud.io
   sonar.organization=your-organization-key
   sonar.projectKey=your-project-key
   ```
5. Add the token to your CI/CD environment variables/secrets

### Manual SonarQube Analysis

You can also run the analysis manually with Maven:

```bash
mvn clean verify sonar:sonar \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=YOUR_TOKEN \
  -Dsonar.projectKey=java-spring-template
```

### Requirements

- Java 21
- Maven
- Docker (for running local SonarQube instance)
- curl (for the automation script)
- jq (optional, for enhanced script functionality)

### Troubleshooting

- If you see "Unsupported class file major version 67" warnings, these are harmless compatibility notices between JaCoCo and Java 21
- If you get "Connection refused" errors, ensure your SonarQube server is running
- If analysis fails with "Project not found", ensure you've created the project in SonarQube first or use the `./run-sonar.sh` script which handles this automatically

For SonarQube documentation, visit: https://docs.sonarqube.org/

## Viewing the Checkstyle Report

Checkstyle is a static code analysis tool (linter) that checks your Java code against coding standards and style guidelines. This project uses Google's Java Style Guide.

After you've run the site lifecycle and generated the reports, you can open the Checkstyle HTML in your browser:

1. **Generate the site**  
   From your project root, run:

   ```bash
      mvn clean site
   ```

   **⚠️ Important**: Running `mvn clean site` will **delete your JaCoCo coverage reports** because the `clean` goal removes the entire `target/` directory, including `target/site/jacoco/`.

   **To generate both Checkstyle and JaCoCo reports together:**
   ```bash
   mvn clean test site  # This will regenerate tests and coverage, then add Checkstyle
   ```

   **Alternative options:**
   ```bash
   # Generate Checkstyle only (preserves existing coverage reports)
   mvn site

   # Generate coverage first, then Checkstyle
   ./run-tests-with-coverage.sh
   mvn site
   ```

2. **_Locate the Report_**
   The Checkstyle report is written to:

   ```bash
      target/site/checkstyle.html
   ```

3. **_Open it in your Browser_**

   - MacOS

   ```bash
   open target/site/checkstyle.html
   ```

   - Linux

   ```bash
   xdg-open target/site/checkstyle.html
   ```

   - Windows(PowerShell)

   ```bash
   start .\target\site\checkstyle.html
   ```
